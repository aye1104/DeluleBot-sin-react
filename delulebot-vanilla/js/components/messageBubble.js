import { escapeHtml } from '../utils.js'

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '👍']
const STATUS_ICON = { sent: '✓', delivered: '✓✓', read: '✓✓' }

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export function createMessageBubble({ msg, isOwn, isSearchMatch, isSearchActive, onContextMenu, onReact, userId }) {
  const alreadyReacted = (msg.reactions || []).some(r => r.userId === userId)

  const reactionCounts = {}
  ;(msg.reactions || []).forEach(r => {
    reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1
  })

  let cls = `message-wrapper ${isOwn ? 'own' : 'other'}`
  if (isSearchMatch)  cls += ' search-match'
  if (isSearchActive) cls += ' search-match--active'

  const wrapper = document.createElement('div')
  wrapper.className = cls
  wrapper.dataset.msgId = msg.id

  const bubble = document.createElement('div')
  bubble.className = `message-bubble${msg.deleted ? ' deleted' : ''}`
  bubble.addEventListener('contextmenu', e => onContextMenu(e, msg, isOwn))

  bubble.innerHTML = `
    <p class="message-bubble__text">${msg.deleted ? 'Mensaje eliminado' : escapeHtml(msg.text)}</p>
    <div class="message-bubble__meta">
      <span class="message-bubble__time">${formatTime(msg.timestamp)}</span>
      ${isOwn && !msg.deleted ? `<span class="msg-status msg-status--${msg.status || 'sent'}">${STATUS_ICON[msg.status] || '✓'}</span>` : ''}
    </div>
  `

  if (!msg.deleted && !alreadyReacted) {
    let hideTimer = null
    const picker = document.createElement('div')
    picker.className = 'reaction-picker'
    REACTION_EMOJIS.forEach(emoji => {
      const span = document.createElement('span')
      span.className = 'reaction-picker__emoji'
      span.textContent = emoji
      span.addEventListener('click', e => {
        e.stopPropagation()
        clearTimeout(hideTimer)
        picker.classList.remove('visible')
        onReact(msg.id, emoji)
      })
      picker.appendChild(span)
    })
    const show = () => { clearTimeout(hideTimer); picker.classList.add('visible') }
    const hide = () => { hideTimer = setTimeout(() => picker.classList.remove('visible'), 200) }
    bubble.addEventListener('mouseenter', show)
    bubble.addEventListener('mouseleave', hide)
    picker.addEventListener('mouseenter', show)
    picker.addEventListener('mouseleave', hide)
    bubble.appendChild(picker)
  }

  wrapper.appendChild(bubble)

  if (Object.keys(reactionCounts).length > 0) {
    const reactDiv = document.createElement('div')
    reactDiv.className = 'message-reactions'
    Object.entries(reactionCounts).forEach(([emoji, count]) => {
      const chip = document.createElement('span')
      chip.className = 'reaction-chip'
      chip.textContent = count > 1 ? `${emoji} ${count}` : emoji
      reactDiv.appendChild(chip)
    })
    wrapper.appendChild(reactDiv)
  }

  return wrapper
}
