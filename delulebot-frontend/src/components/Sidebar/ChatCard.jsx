import { useState } from 'react'

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const hhmm = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  if (sameDay(d, now)) return hhmm
  if (sameDay(d, yesterday)) return `Ayer ${hhmm}`
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function ChatCard({ contact, isActive, lastMsg, unreadCount, onClick }) {
  const [imgError, setImgError] = useState(false)

  const preview = lastMsg
    ? (lastMsg.deleted ? 'Mensaje eliminado' : lastMsg.text)
    : 'Iniciá la conversación'

  return (
    <div className={`chat-card${isActive ? ' active' : ''}`} onClick={onClick}>
      <div className="chat-card__avatar">
        {!imgError ? (
          <img src={contact.foto} alt={contact.nombre} onError={() => setImgError(true)} />
        ) : (
          <div className="chat-card__avatar-placeholder" style={{ display: 'flex' }}>
            {contact.nombre.charAt(0).toUpperCase()}
          </div>
        )}
        <span className={`chat-card__status-dot ${contact.estado}`}></span>
      </div>
      <div className="chat-card__info">
        <div className="chat-card__top">
          <span className="chat-card__name">{contact.nombre}</span>
          <span className="chat-card__time">{formatTime(lastMsg?.timestamp)}</span>
        </div>
        <div className="chat-card__bottom">
          <span className="chat-card__preview">{preview}</span>
          {unreadCount > 0 && <span className="chat-card__badge">{unreadCount}</span>}
        </div>
      </div>
    </div>
  )
}
