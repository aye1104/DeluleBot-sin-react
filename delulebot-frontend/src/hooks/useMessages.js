import { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import * as MensajesService from '../services/mensajes'

export function useMessages() {
  const { user } = useAuth()
  const msgs   = useRef({})
  const unread = useRef({})
  const loaded = useRef({})
  const [, forceRender] = useState(0)
  const tick = () => forceRender(n => n + 1)

  async function loadMessages(contactId) {
    if (loaded.current[contactId]) return
    try {
      const data = await MensajesService.getAll(contactId)
      msgs.current[contactId] = Array.isArray(data) ? data : []
    } catch {
      msgs.current[contactId] = []
    }
    loaded.current[contactId] = true
    tick()
  }

  function getMessages(contactId) {
    return msgs.current[contactId] || []
  }

  function addMessage(contactId, msg) {
    if (!msgs.current[contactId]) msgs.current[contactId] = []
    msgs.current[contactId].push(msg)
    if (user && msg.senderId !== user.id)
      unread.current[contactId] = (unread.current[contactId] || 0) + 1
    MensajesService.send(contactId, msg).catch(err => console.warn('[useMessages] send:', err.message))
    tick()
  }

  function markAsRead(contactId) {
    unread.current[contactId] = 0
    tick()
  }

  function updateMessageStatus(contactId, msgId, status) {
    const list = msgs.current[contactId] || []
    const idx  = list.findIndex(m => m.id === msgId)
    if (idx !== -1) list[idx].status = status
    MensajesService.setStatus(contactId, msgId, status).catch(console.warn)
    tick()
  }

  function addReaction(contactId, msgId, emoji) {
    const list = msgs.current[contactId] || []
    const idx  = list.findIndex(m => m.id === msgId)
    if (idx === -1) return
    if (!list[idx].reactions) list[idx].reactions = []
    if (list[idx].reactions.some(r => r.userId === user?.id)) return
    list[idx].reactions.push({ emoji, userId: user?.id })
    MensajesService.react(contactId, msgId, emoji).catch(console.warn)
    tick()
  }

  function deleteMessage(contactId, msgId) {
    const list = msgs.current[contactId] || []
    const idx  = list.findIndex(m => m.id === msgId)
    if (idx !== -1) list[idx].deleted = true
    MensajesService.remove(contactId, msgId).catch(console.warn)
    tick()
  }

  function clearConversation(contactId) {
    msgs.current[contactId]   = []
    unread.current[contactId] = 0
    loaded.current[contactId] = true
    MensajesService.clear(contactId).catch(console.warn)
    tick()
  }

  function getUnreadCount(contactId) { return unread.current[contactId] || 0 }

  function getLastMessage(contactId) {
    const list = msgs.current[contactId] || []
    return list.length ? list[list.length - 1] : null
  }

  return {
    loadMessages, getMessages, addMessage, markAsRead,
    updateMessageStatus, addReaction, deleteMessage,
    clearConversation, getUnreadCount, getLastMessage,
  }
}
