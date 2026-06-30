import { getUser } from './auth.js'
import { get, post, patch, del } from './api.js'

const msgs   = {}
const unread = {}
const loaded = {}
const _listeners = new Set()

function tick() { _listeners.forEach(fn => fn()) }

export function onMessagesChange(fn) {
  _listeners.add(fn)
  return () => _listeners.delete(fn)
}

const base    = (cId)      => `/contactos/${cId}/mensajes`
const msgBase = (cId, mId) => `${base(cId)}/${mId}`

export async function loadMessages(contactId) {
  if (loaded[contactId]) return
  try {
    const data = await get(base(contactId))
    msgs[contactId] = Array.isArray(data) ? data : []
  } catch {
    msgs[contactId] = []
  }
  loaded[contactId] = true
  tick()
}

export function getMessages(contactId)  { return msgs[contactId] || [] }
export function getUnreadCount(contactId) { return unread[contactId] || 0 }
export function getLastMessage(contactId) {
  const list = msgs[contactId] || []
  return list.length ? list[list.length - 1] : null
}

// Agrega un mensaje local sin llamar al backend (para respuestas del bot)
export function addLocalMessage(contactId, msg) {
  if (!msgs[contactId]) msgs[contactId] = []
  msgs[contactId].push(msg)
  tick()
}

export function addMessage(contactId, msg) {
  if (!msgs[contactId]) msgs[contactId] = []
  msgs[contactId].push(msg)
  const user = getUser()
  if (user && msg.senderId !== user.id)
    unread[contactId] = (unread[contactId] || 0) + 1
  tick()
  post(base(contactId), msg).catch(err => {
    console.warn('[messages] send:', err.message)
    const list = msgs[contactId]
    if (list) {
      const i = list.findIndex(m => m.id === msg.id)
      if (i !== -1) list.splice(i, 1)
    }
    tick()
  })
}

export function markAsRead(contactId) {
  unread[contactId] = 0
  tick()
}

export function updateMessageStatus(contactId, msgId, status) {
  const list = msgs[contactId] || []
  const idx  = list.findIndex(m => m.id === msgId)
  if (idx !== -1) list[idx].status = status
  patch(msgBase(contactId, msgId) + '/status', { status }).catch(console.warn)
  tick()
}

export function addReaction(contactId, msgId, emoji) {
  const list = msgs[contactId] || []
  const idx  = list.findIndex(m => m.id === msgId)
  if (idx === -1) return
  if (!list[idx].reactions) list[idx].reactions = []
  const user = getUser()
  if (list[idx].reactions.some(r => r.userId === user?.id)) return
  list[idx].reactions.push({ emoji, userId: user?.id })
  patch(msgBase(contactId, msgId) + '/reaction', { emoji }).catch(err => {
    console.warn('[messages] reaction:', err.message)
    const l = msgs[contactId]
    const i = l?.findIndex(m => m.id === msgId) ?? -1
    if (i !== -1 && l[i].reactions) {
      l[i].reactions = l[i].reactions.filter(r => r.userId !== user?.id)
    }
    tick()
  })
  tick()
}

export function deleteMessage(contactId, msgId) {
  const list = msgs[contactId] || []
  const idx  = list.findIndex(m => m.id === msgId)
  if (idx === -1) return
  list[idx].deleted = true
  tick()
  del(msgBase(contactId, msgId)).catch(err => {
    console.warn('[messages] delete:', err.message)
    const i = msgs[contactId]?.findIndex(m => m.id === msgId) ?? -1
    if (i !== -1) msgs[contactId][i].deleted = false
    tick()
  })
}

export function clearConversation(contactId) {
  const prev = msgs[contactId]
  msgs[contactId]   = []
  unread[contactId] = 0
  loaded[contactId] = true
  tick()
  del(base(contactId)).catch(err => {
    console.warn('[messages] clear:', err.message)
    msgs[contactId] = prev
    tick()
  })
}
