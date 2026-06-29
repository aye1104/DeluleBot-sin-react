import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMessages } from '../hooks/useMessages'
import * as ContactosService from '../services/contactos'
import * as PerfilService from '../services/perfil'
import localContacts from '../data/contacts'
import Sidebar from '../components/Sidebar/Sidebar'
import ChatPanel from '../components/Chat/ChatPanel'
import ProfileModal from '../components/Profile/ProfileModal'

export default function AppPage() {
  const { saveProfile, logout } = useAuth()
  const navigate = useNavigate()
  const msgHook = useMessages()

  const [contacts, setContacts] = useState(localContacts)
  const [activeContactId, setActiveContactId] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)

  useEffect(() => {
    Promise.allSettled([
      ContactosService.getAll(),
      PerfilService.get(),
    ]).then(([contactosRes, perfilRes]) => {
      const contactList = contactosRes.status === 'fulfilled' ? contactosRes.value : localContacts
      if (contactosRes.status === 'fulfilled') setContacts(contactList)
      if (perfilRes.status === 'fulfilled') saveProfile(perfilRes.value)

      // Precargar mensajes de todos los contactos para poblar el sidebar
      contactList.forEach(c => msgHook.loadMessages(c.id))
    })
  }, [])

  async function handleSelectContact(contactId) {
    setActiveContactId(contactId)
    await msgHook.loadMessages(contactId)
    msgHook.markAsRead(contactId)
    if (window.innerWidth <= 768) setSidebarHidden(true)
  }

  function handleBack() {
    setActiveContactId(null)
    setSidebarHidden(false)
  }

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  function handleDeleteConversation() {
    msgHook.clearConversation(activeContactId)
    setActiveContactId(null)
    setSidebarHidden(false)
  }

  const activeContact = contacts.find(c => c.id === activeContactId) ?? null

  return (
    <div className="app-layout">
      <Sidebar
        contacts={contacts}
        activeContactId={activeContactId}
        onSelectContact={handleSelectContact}
        onOpenProfile={() => setShowProfile(true)}
        onLogout={handleLogout}
        msgHook={msgHook}
        hidden={sidebarHidden}
      />
      <ChatPanel
        contact={activeContact}
        msgHook={msgHook}
        onBack={handleBack}
        onDeleteConversation={handleDeleteConversation}
      />
      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          onSaved={saveProfile}
        />
      )}
    </div>
  )
}
