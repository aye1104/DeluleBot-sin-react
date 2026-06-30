import { post } from './api.js'

let _user = null
try { _user = JSON.parse(localStorage.getItem('chat_session')) } catch {}

const _listeners = new Set()

function _notify() { _listeners.forEach(fn => fn(_user)) }

export function getUser()  { return _user }

export function onAuthChange(fn) {
  _listeners.add(fn)
  return () => _listeners.delete(fn)
}

export function setSession(userData) {
  localStorage.setItem('chat_session', JSON.stringify(userData))
  _user = userData
  _notify()
}

export function saveProfile(changes) {
  _user = { ..._user, ...changes }
  localStorage.setItem('chat_session', JSON.stringify(_user))
  _notify()
}

export async function logout() {
  try { await post('/auth/logout', {}) } catch (err) { console.warn('[auth] logout:', err.message) }
  localStorage.removeItem('chat_session')
  _user = null
  _notify()
}
