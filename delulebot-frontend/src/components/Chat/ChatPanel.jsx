import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAutoReply } from '../../utils/bot'
import MessageBubble from './MessageBubble'

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '👍']
const STATUS_MAP = { online: 'En línea', ocupado: 'Ocupado', 'no-molestar': 'No molestar' }

function getDateLabel(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(d, now)) return 'Hoy'
  if (isSameDay(d, yesterday)) return 'Ayer'
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function ChatPanel({ contact, msgHook, onBack, onDeleteConversation }) {
  const { user } = useAuth()
  const [inputText, setInputText]       = useState('')
  const [isTyping, setIsTyping]         = useState(false)
  const [showEmoji, setShowEmoji]       = useState(false)
  const [showSearch, setShowSearch]     = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const [searchIdx, setSearchIdx]       = useState(-1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contextMenu, setContextMenu]   = useState(null)
  const [avatarError, setAvatarError]   = useState(false)

  const chatMessagesRef = useRef(null)
  const inputRef        = useRef(null)

  const messages = contact ? msgHook.getMessages(contact.id) : []

  const searchMatches = (() => {
    if (!searchQuery || !contact) return []
    const q = searchQuery.toLowerCase()
    return messages.filter(m => !m.deleted && m.text.toLowerCase().includes(q))
  })()

  useEffect(() => {
    setTimeout(() => {
      chatMessagesRef.current?.scrollTo({ top: chatMessagesRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }, [messages.length, isTyping])

  // Reset avatar error when contact changes
  useEffect(() => { setAvatarError(false) }, [contact?.id])

  function sendMessage() {
    const text = inputText.trim()
    if (!text || !contact || !user) return

    const msg = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      senderId: user.id,
      text,
      timestamp: Date.now(),
      status: 'sent',
      reactions: [],
      deleted: false,
    }

    msgHook.addMessage(contact.id, msg)
    setInputText('')
    setShowEmoji(false)

    // Simulate status: sent → delivered → read
    const cId = contact.id
    setTimeout(() => msgHook.updateMessageStatus(cId, msg.id, 'delivered'), 1200)
    setTimeout(() => msgHook.updateMessageStatus(cId, msg.id, 'read'), 3000)

    // Bot response
    const delay = 1200 + Math.random() * 1000
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply = {
        id: Date.now().toString(),
        senderId: cId,
        text: getAutoReply(contact, text),
        timestamp: Date.now(),
        status: 'read',
        reactions: [],
        deleted: false,
      }
      msgHook.addMessage(cId, reply)
      msgHook.markAsRead(cId)
    }, delay)
  }

  // Build grouped message list with date separators
  const grouped = []
  let lastDate = null
  for (const msg of messages) {
    const label = getDateLabel(msg.timestamp)
    if (label !== lastDate) {
      grouped.push({ type: 'sep', label, key: `sep-${msg.id}` })
      lastDate = label
    }
    grouped.push({ type: 'msg', msg, key: msg.id })
  }

  if (!contact) {
    return (
      <main className="chat-panel">
        <div className="chat-panel--empty" style={{ display: 'flex' }}>
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Seleccioná un chat</h3>
            <p>Elegí una conversación del panel izquierdo<br/>para empezar a chatear.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="chat-panel" onClick={() => setContextMenu(null)}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Header */}
        <header className="chat-header" id="chatHeader">
          <button className="chat-header__back" title="Volver" onClick={onBack}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              width="20" height="20">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="chat-header__avatar">
            {!avatarError ? (
              <img src={contact.foto} alt={contact.nombre} onError={() => setAvatarError(true)} />
            ) : (
              <div className="chat-header__avatar-placeholder" style={{ display: 'flex' }}>
                {contact.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <span className={`chat-header__status-dot ${contact.estado}`}></span>
          </div>

          <div className="chat-header__info">
            <p className="chat-header__name">{contact.nombre}</p>
            <p className="chat-header__sub">
              {isTyping
                ? <span className="chat-header__typing visible">escribiendo...</span>
                : <span>{STATUS_MAP[contact.estado] || contact.estado}</span>
              }
            </p>
          </div>

          <div className="chat-header__actions">
            <button className="chat-header__action-btn" title="Buscar en el chat"
              onClick={e => { e.stopPropagation(); setShowSearch(v => !v); setSearchQuery('') }}>
              <img src="/assets/icons/buscador.svg" width="18" height="18" alt="Buscar" />
            </button>
            <button className="chat-header__action-btn chat-header__action-btn--danger" title="Eliminar conversación"
              onClick={e => { e.stopPropagation(); setShowDeleteModal(true) }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Search bar */}
        {showSearch && (
          <div className="chat-search-bar visible">
            <input type="text" placeholder="Buscar mensaje..." autoComplete="off" autoFocus
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchIdx(0) }}
              onKeyDown={e => {
                if (e.key === 'Enter') setSearchIdx(i => searchMatches.length ? (i + 1) % searchMatches.length : -1)
                if (e.key === 'Escape') { setShowSearch(false); setSearchQuery('') }
              }} />
            {searchQuery && (
              <span className="chat-search-count">
                {searchMatches.length ? `${Math.min(searchIdx + 1, searchMatches.length)} / ${searchMatches.length}` : 'Sin resultados'}
              </span>
            )}
            <button className="chat-search-nav" title="Anterior"
              onClick={() => setSearchIdx(i => (i - 1 + searchMatches.length) % searchMatches.length)}>↑</button>
            <button className="chat-search-nav" title="Siguiente"
              onClick={() => setSearchIdx(i => (i + 1) % searchMatches.length)}>↓</button>
            <button className="chat-search-close" title="Cerrar"
              onClick={() => { setShowSearch(false); setSearchQuery('') }}>✕</button>
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages" ref={chatMessagesRef}>
          {grouped.map(item =>
            item.type === 'sep' ? (
              <div key={item.key} className="date-separator">
                <span className="date-separator__label">{item.label}</span>
              </div>
            ) : (
              <MessageBubble
                key={item.key}
                msg={item.msg}
                isOwn={item.msg.senderId === user?.id}
                isSearchMatch={searchMatches.some(m => m.id === item.msg.id)}
                isSearchActive={searchMatches[searchIdx]?.id === item.msg.id}
                onContextMenu={(e, msg, isOwn) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (msg.deleted) return
                  setContextMenu({
                    x: Math.min(e.clientX, window.innerWidth - 160),
                    y: Math.min(e.clientY, window.innerHeight - 100),
                    msg,
                    isOwn,
                  })
                }}
                onReact={(msgId, emoji) => msgHook.addReaction(contact.id, msgId, emoji)}
                userId={user?.id}
              />
            )
          )}
        </div>

        {/* Typing indicator */}
        {isTyping && (
          <div className="typing-indicator visible">
            <div className="typing-indicator__avatar">
              <img src={contact.foto} alt={contact.nombre} />
            </div>
            <div className="typing-indicator__bubble">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="chat-input-area" onClick={e => e.stopPropagation()}>
          <div className={`input-emoji-picker${showEmoji ? ' visible' : ''}`}>
            {REACTION_EMOJIS.map(emoji => (
              <span key={emoji} className="input-emoji-picker__btn"
                onClick={() => {
                  const pos = inputRef.current?.selectionStart ?? inputText.length
                  setInputText(prev => prev.slice(0, pos) + emoji + prev.slice(pos))
                  setShowEmoji(false)
                  setTimeout(() => inputRef.current?.focus(), 0)
                }}>
                {emoji}
              </span>
            ))}
          </div>

          <button className="chat-input-area__btn btn-emoji" title="Emoji"
            onClick={() => setShowEmoji(v => !v)}>
            <img src="/assets/icons/emoji-reaccion.svg" width="20" height="20" alt="Emoji" />
          </button>

          <textarea
            ref={inputRef}
            className="chat-input-area__field"
            placeholder="Escribe un mensaje..."
            rows="1"
            autoComplete="off"
            value={inputText}
            onChange={e => {
              setInputText(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
            }}
          />

          <button className="chat-input-area__btn btn-send" title="Enviar"
            disabled={!inputText.trim()}
            onClick={sendMessage}>
            <img src="/assets/icons/enviar.svg" width="20" height="20" alt="Enviar" />
          </button>
        </div>

        <p className="chat-secure-label">CHAT SEGURO Y CIFRADO</p>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div className="message-context-menu" style={{ display: 'block', left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}>
          {!contextMenu.msg.reactions?.some(r => r.userId === user?.id) && (
            <div className="message-context-menu__item" onClick={() => {
              msgHook.addReaction(contact.id, contextMenu.msg.id, '❤️')
              setContextMenu(null)
            }}>
              <img src="/assets/icons/emoji-reaccion.svg" width="15" height="15" alt="" />
              Reaccionar
            </div>
          )}
          {contextMenu.isOwn && (
            <div className="message-context-menu__item danger" onClick={() => {
              msgHook.deleteMessage(contact.id, contextMenu.msg.id)
              setContextMenu(null)
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
              Eliminar mensaje
            </div>
          )}
        </div>
      )}

      {/* Delete conversation modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 1055, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" style={{ maxWidth: 320, borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            onClick={e => e.stopPropagation()}>
            <div className="modal-body text-center py-4 px-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗑️</div>
              <h6 className="fw-semibold mb-1">¿Eliminar conversación?</h6>
              <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer border-0 justify-content-center gap-2 pt-0 pb-4">
              <button className="btn btn-secondary btn-sm px-4" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="btn btn-danger btn-sm px-4" onClick={() => { setShowDeleteModal(false); onDeleteConversation() }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
