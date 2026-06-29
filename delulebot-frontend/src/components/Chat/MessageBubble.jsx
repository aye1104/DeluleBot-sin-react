import { useState, useRef } from 'react'

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '👍']
const STATUS_ICON = { sent: '✓', delivered: '✓✓', read: '✓✓' }

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export default function MessageBubble({ msg, isOwn, isSearchMatch, isSearchActive, onContextMenu, onReact, userId }) {
  const [pickerVisible, setPickerVisible] = useState(false)
  const hideTimer = useRef(null)

  const alreadyReacted = (msg.reactions || []).some(r => r.userId === userId)

  const reactionCounts = {}
  ;(msg.reactions || []).forEach(r => {
    reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1
  })

  function showPicker() {
    clearTimeout(hideTimer.current)
    if (!msg.deleted && !alreadyReacted) setPickerVisible(true)
  }

  function hidePicker() {
    hideTimer.current = setTimeout(() => setPickerVisible(false), 200)
  }

  let wrapperClass = `message-wrapper ${isOwn ? 'own' : 'other'}`
  if (isSearchMatch)  wrapperClass += ' search-match'
  if (isSearchActive) wrapperClass += ' search-match--active'

  return (
    <div className={wrapperClass} data-msg-id={msg.id}>
      <div
        className={`message-bubble${msg.deleted ? ' deleted' : ''}`}
        onContextMenu={e => onContextMenu(e, msg, isOwn)}
        onMouseEnter={showPicker}
        onMouseLeave={hidePicker}
      >
        <p className="message-bubble__text">
          {msg.deleted ? 'Mensaje eliminado' : msg.text}
        </p>

        <div className="message-bubble__meta">
          <span className="message-bubble__time">{formatTime(msg.timestamp)}</span>
          {isOwn && !msg.deleted && (
            <span className={`msg-status msg-status--${msg.status || 'sent'}`}>
              {STATUS_ICON[msg.status] || '✓'}
            </span>
          )}
        </div>

        {!msg.deleted && !alreadyReacted && (
          <div
            className={`reaction-picker${pickerVisible ? ' visible' : ''}`}
            onMouseEnter={showPicker}
            onMouseLeave={hidePicker}
          >
            {REACTION_EMOJIS.map(emoji => (
              <span
                key={emoji}
                className="reaction-picker__emoji"
                onClick={e => {
                  e.stopPropagation()
                  clearTimeout(hideTimer.current)
                  setPickerVisible(false)
                  onReact(msg.id, emoji)
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {Object.keys(reactionCounts).length > 0 && (
        <div className="message-reactions">
          {Object.entries(reactionCounts).map(([emoji, count]) => (
            <span key={emoji} className="reaction-chip">
              {count > 1 ? `${emoji} ${count}` : emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
