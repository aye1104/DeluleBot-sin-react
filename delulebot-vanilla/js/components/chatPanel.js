import { getUser } from '../auth.js'
import { getMessages, addMessage, addLocalMessage, updateMessageStatus, addReaction, deleteMessage, markAsRead } from '../messages.js'
import { getAutoReply } from '../bot.js'
import { createMessageBubble } from './messageBubble.js'
import { escapeHtml, safeFoto } from '../utils.js'

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '👍']
const STATUS_MAP = { online: 'En línea', ocupado: 'Ocupado', 'no-molestar': 'No molestar' }

function dateLabel(ts) {
  if (!ts) return ''
  const d = new Date(ts), now = new Date()
  const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  const yest = new Date(now); yest.setDate(now.getDate() - 1)
  if (same(d, now))  return 'Hoy'
  if (same(d, yest)) return 'Ayer'
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function createChatPanel({ onBack, onDeleteConversation }) {
  let contact     = null
  let isTyping    = false
  let showEmoji   = false
  let showSearch  = false
  let searchQuery = ''
  let searchIdx   = -1
  let avatarErr   = false

  const main = document.createElement('main')
  main.className = 'chat-panel'

  function matches() {
    if (!searchQuery || !contact) return []
    const q = searchQuery.toLowerCase()
    return getMessages(contact.id).filter(m => !m.deleted && m.text.toLowerCase().includes(q))
  }

  function scrollBottom() {
    setTimeout(() => {
      const el = main.querySelector('.chat-messages')
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }, 50)
  }

  function sendMessage() {
    const ta = main.querySelector('#cp-textarea')
    if (!ta) return
    const text = ta.value.trim()
    if (!text || !contact) return
    const user = getUser()
    if (!user) return

    const msg = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      senderId: user.id, text,
      timestamp: Date.now(), status: 'sent', reactions: [], deleted: false,
    }
    addMessage(contact.id, msg)
    ta.value = ''; ta.style.height = 'auto'
    showEmoji = false
    renderMessages(); scrollBottom()

    const cId = contact.id
    setTimeout(() => { updateMessageStatus(cId, msg.id, 'delivered'); renderMessages() }, 1200)
    setTimeout(() => { updateMessageStatus(cId, msg.id, 'read');      renderMessages() }, 3000)

    isTyping = true; renderTyping()
    setTimeout(() => {
      isTyping = false
      addLocalMessage(cId, {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        senderId: cId,
        text: getAutoReply(contact, text),
        timestamp: Date.now(),
        status: 'read',
        reactions: [],
        deleted: false,
      })
      markAsRead(cId); renderTyping(); renderMessages(); scrollBottom()
    }, 1200 + Math.random() * 1000)
  }

  function renderMessages() {
    const wrap = main.querySelector('.chat-messages')
    if (!wrap || !contact) return
    const user = getUser(), msgs = getMessages(contact.id), ms = matches()
    const grouped = []; let last = null
    for (const m of msgs) {
      const lbl = dateLabel(m.timestamp)
      if (lbl !== last) { grouped.push({ type: 'sep', label: lbl, key: `sep-${m.id}` }); last = lbl }
      grouped.push({ type: 'msg', msg: m })
    }
    wrap.innerHTML = ''
    grouped.forEach(item => {
      if (item.type === 'sep') {
        const d = document.createElement('div'); d.className = 'date-separator'
        d.innerHTML = `<span class="date-separator__label">${item.label}</span>`
        wrap.appendChild(d)
      } else {
        wrap.appendChild(createMessageBubble({
          msg: item.msg,
          isOwn: item.msg.senderId === user?.id,
          isSearchMatch: ms.some(m => m.id === item.msg.id),
          isSearchActive: ms[searchIdx]?.id === item.msg.id,
          onContextMenu: handleCtxMenu,
          onReact: (msgId, emoji) => { addReaction(contact.id, msgId, emoji); renderMessages() },
          userId: user?.id,
        }))
      }
    })
  }

  function renderTyping() {
    const ind = main.querySelector('#cp-typing')
    if (!ind || !contact) return
    if (isTyping) {
      ind.innerHTML = `
        <div class="typing-indicator__avatar"><img src="${safeFoto(contact.foto)}" alt="${escapeHtml(contact.nombre)}" /></div>
        <div class="typing-indicator__bubble">
          <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>`
      ind.classList.add('visible')
    } else {
      ind.classList.remove('visible'); ind.innerHTML = ''
    }
  }

  function handleCtxMenu(e, msg, isOwn) {
    e.preventDefault(); e.stopPropagation()
    if (msg.deleted) return
    closeCtx()
    const user = getUser()
    const menu = document.createElement('div')
    menu.className = 'message-context-menu'
    menu.style.cssText = `display:block;left:${Math.min(e.clientX, window.innerWidth - 160)}px;top:${Math.min(e.clientY, window.innerHeight - 100)}px`
    menu.addEventListener('click', ev => ev.stopPropagation())

    if (!msg.reactions?.some(r => r.userId === user?.id)) {
      const ri = document.createElement('div')
      ri.className = 'message-context-menu__reactions'
      ri.innerHTML = REACTION_EMOJIS.map(e => `<span class="message-context-menu__emoji" data-emoji="${e}">${e}</span>`).join('')
      ri.querySelectorAll('.message-context-menu__emoji').forEach(btn => {
        btn.addEventListener('click', ev => {
          ev.stopPropagation()
          addReaction(contact.id, msg.id, btn.dataset.emoji)
          closeCtx(); renderMessages()
        })
      })
      menu.appendChild(ri)
    }
    if (isOwn) {
      const di = document.createElement('div'); di.className = 'message-context-menu__item danger'
      di.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> Eliminar mensaje`
      di.addEventListener('click', () => { deleteMessage(contact.id, msg.id); closeCtx(); renderMessages() })
      menu.appendChild(di)
    }
    main.appendChild(menu)
  }

  function closeCtx() { main.querySelector('.message-context-menu')?.remove() }

  function showDeleteModal() {
    const ov = document.createElement('div')
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:1055;display:flex;align-items:center;justify-content:center'
    ov.addEventListener('click', () => ov.remove())
    ov.innerHTML = `
      <div class="modal-content" style="max-width:320px;border-radius:12px;background:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.18)" onclick="event.stopPropagation()">
        <div class="modal-body text-center py-4 px-4">
          <div style="font-size:2rem;margin-bottom:.5rem">🗑️</div>
          <h6 class="fw-semibold mb-1">¿Eliminar conversación?</h6>
          <p class="text-muted small mb-0">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer border-0 justify-content-center gap-2 pt-0 pb-4">
          <button class="btn btn-secondary btn-sm px-4" id="del-cancel">Cancelar</button>
          <button class="btn btn-danger btn-sm px-4" id="del-confirm">Eliminar</button>
        </div>
      </div>`
    ov.querySelector('#del-cancel').addEventListener('click', () => ov.remove())
    ov.querySelector('#del-confirm').addEventListener('click', () => { ov.remove(); onDeleteConversation() })
    document.body.appendChild(ov)
  }

  function buildPanel() {
    main.innerHTML = ''; main.addEventListener('click', closeCtx)

    if (!contact) {
      main.innerHTML = `<div class="chat-panel--empty" style="display:flex"><div class="empty-state"><div class="empty-state-icon">💬</div><h3>Seleccioná un chat</h3><p>Elegí una conversación del panel izquierdo<br/>para empezar a chatear.</p></div></div>`
      return
    }

    main.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%">
        <header class="chat-header">
          <button class="chat-header__back" id="cp-back" title="Volver">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div class="chat-header__avatar" id="cp-hdr-avatar"></div>
          <div class="chat-header__info">
            <p class="chat-header__name">${escapeHtml(contact.nombre)}</p>
            <p class="chat-header__sub" id="cp-sub"><span>${escapeHtml(STATUS_MAP[contact.estado] || contact.estado)}</span></p>
          </div>
          <div class="chat-header__actions">
            <button class="chat-header__action-btn" id="cp-search-toggle" title="Buscar en el chat">
              <img src="/assets/icons/buscador.svg" width="18" height="18" alt="Buscar" />
            </button>
            <button class="chat-header__action-btn chat-header__action-btn--danger" id="cp-del-conv" title="Eliminar conversación">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </header>

        <div class="chat-search-bar" id="cp-search-bar">
          <input type="text" id="cp-search-input" placeholder="Buscar mensaje..." autocomplete="off" />
          <span class="chat-search-count" id="cp-search-count"></span>
          <button class="chat-search-nav" id="cp-prev" title="Anterior">↑</button>
          <button class="chat-search-nav" id="cp-next" title="Siguiente">↓</button>
          <button class="chat-search-close" id="cp-search-close" title="Cerrar">✕</button>
        </div>

        <div class="chat-messages"></div>
        <div class="typing-indicator" id="cp-typing"></div>

        <div class="chat-input-area" id="cp-input-area">
          <div class="input-emoji-picker" id="cp-emoji-picker">
            ${REACTION_EMOJIS.map(e => `<span class="input-emoji-picker__btn" data-emoji="${e}">${e}</span>`).join('')}
          </div>
          <button class="chat-input-area__btn btn-emoji" id="cp-emoji-btn" title="Emoji">
            <img src="/assets/icons/emoji-reaccion.svg" width="20" height="20" alt="Emoji" />
          </button>
          <textarea class="chat-input-area__field" id="cp-textarea" placeholder="Escribe un mensaje..." rows="1" autocomplete="off"></textarea>
          <button class="chat-input-area__btn btn-send" id="cp-send" title="Enviar" disabled>
            <img src="/assets/icons/enviar.svg" width="20" height="20" alt="Enviar" />
          </button>
        </div>
        <p class="chat-secure-label">CHAT SEGURO Y CIFRADO</p>
      </div>
    `

    // Avatar header
    const av = main.querySelector('#cp-hdr-avatar')
    if (!avatarErr) {
      const img = document.createElement('img')
      img.src = safeFoto(contact.foto); img.alt = escapeHtml(contact.nombre)
      img.addEventListener('error', () => { avatarErr = true; img.replaceWith(ph(contact.nombre, 'chat-header__avatar-placeholder')) })
      av.appendChild(img)
    } else {
      av.appendChild(ph(contact.nombre, 'chat-header__avatar-placeholder'))
    }
    const dot = document.createElement('span'); dot.className = `chat-header__status-dot ${contact.estado}`
    av.appendChild(dot)

    main.querySelector('#cp-back').addEventListener('click', onBack)
    main.querySelector('#cp-del-conv').addEventListener('click', e => { e.stopPropagation(); showDeleteModal() })

    // Search
    main.querySelector('#cp-search-toggle').addEventListener('click', e => {
      e.stopPropagation(); showSearch = !showSearch; searchQuery = ''; searchIdx = -1
      const bar = main.querySelector('#cp-search-bar')
      if (showSearch) { bar.classList.add('visible'); main.querySelector('#cp-search-input').focus() }
      else bar.classList.remove('visible')
      renderMessages()
    })
    main.querySelector('#cp-search-input').addEventListener('input', e => { searchQuery = e.target.value; searchIdx = 0; updateCount(); renderMessages() })
    main.querySelector('#cp-search-input').addEventListener('keydown', e => {
      const ms = matches()
      if (e.key === 'Enter') { searchIdx = ms.length ? (searchIdx + 1) % ms.length : -1; renderMessages() }
      if (e.key === 'Escape') { showSearch = false; searchQuery = ''; main.querySelector('#cp-search-bar').classList.remove('visible'); renderMessages() }
    })
    main.querySelector('#cp-prev').addEventListener('click', () => { const ms = matches(); searchIdx = (searchIdx - 1 + ms.length) % ms.length; renderMessages() })
    main.querySelector('#cp-next').addEventListener('click', () => { const ms = matches(); searchIdx = (searchIdx + 1) % ms.length; renderMessages() })
    main.querySelector('#cp-search-close').addEventListener('click', () => { showSearch = false; searchQuery = ''; main.querySelector('#cp-search-bar').classList.remove('visible'); renderMessages() })

    // Emoji
    main.querySelector('#cp-emoji-btn').addEventListener('click', () => {
      showEmoji = !showEmoji; main.querySelector('#cp-emoji-picker').classList.toggle('visible', showEmoji)
    })
    main.querySelectorAll('.input-emoji-picker__btn').forEach(btn => btn.addEventListener('click', () => {
      const ta = main.querySelector('#cp-textarea'), pos = ta.selectionStart ?? ta.value.length
      ta.value = ta.value.slice(0, pos) + btn.dataset.emoji + ta.value.slice(pos)
      ta.dispatchEvent(new Event('input')); showEmoji = false
      main.querySelector('#cp-emoji-picker').classList.remove('visible')
      setTimeout(() => ta.focus(), 0)
    }))

    // Textarea + send
    const ta = main.querySelector('#cp-textarea'), sb = main.querySelector('#cp-send')
    ta.addEventListener('input', e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; sb.disabled = !e.target.value.trim() })
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } })
    sb.addEventListener('click', sendMessage)
    main.querySelector('#cp-input-area').addEventListener('click', e => e.stopPropagation())

    renderMessages(); scrollBottom()
  }

  function updateCount() {
    const el = main.querySelector('#cp-search-count'); if (!el) return
    const ms = matches()
    el.textContent = searchQuery ? (ms.length ? `${Math.min(searchIdx + 1, ms.length)} / ${ms.length}` : 'Sin resultados') : ''
  }

  buildPanel()

  return {
    el: main,
    setContact(c) { contact = c; avatarErr = false; isTyping = false; showSearch = false; searchQuery = ''; searchIdx = -1; buildPanel() },
    refreshMessages() { renderMessages(); scrollBottom() },
  }
}

function ph(name, cls = 'chat-card__avatar-placeholder') {
  const d = document.createElement('div'); d.className = cls; d.style.display = 'flex'
  d.textContent = (name || '?').charAt(0).toUpperCase(); return d
}
