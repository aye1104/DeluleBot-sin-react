import { createContext, useContext, useState } from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext(null)

function _readSession() {
  try { return JSON.parse(localStorage.getItem('chat_session')) }
  catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(_readSession)

  function setSession(userData) {
    localStorage.setItem('chat_session', JSON.stringify(userData))
    setUser(userData)
  }

  function saveProfile(changes) {
    const updated = { ...user, ...changes }
    localStorage.setItem('chat_session', JSON.stringify(updated))
    setUser(updated)
  }

  async function logout() {
    try { await authService.logout() } catch {}
    localStorage.removeItem('chat_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setSession, saveProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
