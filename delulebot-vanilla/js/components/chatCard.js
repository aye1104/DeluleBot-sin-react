import { escapeHtml, safeFoto } from '../utils.js'

function formatTime(ts) {
  if (!ts) return ''
  const d   = new Date(ts)
  const now = new Date()
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const hhmm = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  if (sameDay(d, now))       return hhmm
  if (sameDay(d, yesterday)) return `Ayer ${hhmm}`
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function createChatCard({ contact, isActive, lastMsg, unreadCount, onClick }) {
  const div = document.createElement('div')
  div.className = `chat-card${isActive ? ' active' : ''}`
  div.addEventListener('click', onClick)

  const preview = lastMsg
    ? (lastMsg.deleted ? 'Mensaje eliminado' : escapeHtml(lastMsg.text))
    : 'Iniciá la conversación'

  div.innerHTML = `
    <div class="chat-card__avatar">
      <img src="${safeFoto(contact.foto)}" alt="${escapeHtml(contact.nombre)}" />
      <span class="chat-card__status-dot ${contact.estado}"></span>
    </div>
    <div class="chat-card__info">
      <div class="chat-card__top">
        <span class="chat-card__name">${escapeHtml(contact.nombre)}</span>
        <span class="chat-card__time">${formatTime(lastMsg?.timestamp)}</span>
      </div>
      <div class="chat-card__bottom">
        <span class="chat-card__preview">${preview}</span>
        ${unreadCount > 0 ? `<span class="chat-card__badge">${unreadCount}</span>` : ''}
      </div>
    </div>
  `

  div.querySelector('img').addEventListener('error', function () {
    const ph = document.createElement('div')
    ph.className = 'chat-card__avatar-placeholder'
    ph.style.display = 'flex'
    ph.textContent = contact.nombre.charAt(0).toUpperCase()
    this.replaceWith(ph)
  })

  return div
}
