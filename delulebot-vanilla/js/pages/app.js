import { getUser, logout, saveProfile } from '../auth.js'
import { loadMessages, onMessagesChange, clearConversation } from '../messages.js'
import { get } from '../api.js'
import localContacts from '../data/contacts.js'
import { createSidebar } from '../components/sidebar.js'
import { createChatPanel } from '../components/chatPanel.js'
import { openProfileModal } from '../components/profileModal.js'

export function renderApp(container, navigate) {
  if (!getUser()) { navigate('/login'); return }

  let contacts        = localContacts
  let activeContactId = null
  let sidebarHidden   = false
  let unsub           = null

  container.innerHTML = ''
  const layout = document.createElement('div')
  layout.className = 'app-layout'
  container.appendChild(layout)

  const sidebarInst = createSidebar({
    contacts, activeContactId,
    onSelectContact: selectContact,
    onOpenProfile: () => openProfileModal({
      onSaved: () => sidebarInst.update({ contacts, activeContactId, hidden: sidebarHidden, reloadHeader: true }),
    }),
    onLogout: handleLogout,
    hidden: sidebarHidden,
  })
  layout.appendChild(sidebarInst.el)

  const panelInst = createChatPanel({ onBack: handleBack, onDeleteConversation: handleDeleteConv })
  layout.appendChild(panelInst.el)

  unsub = onMessagesChange(() => {
    sidebarInst.update({ contacts, activeContactId, hidden: sidebarHidden })
    panelInst.refreshMessages()
  })

  // Cargar datos del servidor
  Promise.allSettled([
    get('/contactos'),
    get('/perfil'),
  ]).then(([cRes, pRes]) => {
    if (cRes.status === 'fulfilled') contacts = cRes.value
    if (pRes.status === 'fulfilled') saveProfile(pRes.value)
    contacts.forEach(c => loadMessages(c.id))
    sidebarInst.update({ contacts, activeContactId, hidden: sidebarHidden, reloadHeader: true })
  })

  // Precargar mensajes locales
  contacts.forEach(c => loadMessages(c.id))

  async function selectContact(contactId) {
    activeContactId = contactId
    const contact = contacts.find(c => c.id === contactId) ?? null
    await loadMessages(contactId)
    panelInst.setContact(contact)
    sidebarInst.update({ contacts, activeContactId, hidden: sidebarHidden })
    if (window.innerWidth <= 768) {
      sidebarHidden = true
      sidebarInst.update({ contacts, activeContactId, hidden: sidebarHidden })
    }
  }

  function handleBack() {
    activeContactId = null; sidebarHidden = false
    panelInst.setContact(null)
    sidebarInst.update({ contacts, activeContactId, hidden: sidebarHidden })
  }

  async function handleLogout() {
    if (unsub) unsub()
    await logout()
    navigate('/login')
  }

  function handleDeleteConv() {
    if (activeContactId !== null) clearConversation(activeContactId)
    activeContactId = null; sidebarHidden = false
    panelInst.setContact(null)
    sidebarInst.update({ contacts, activeContactId, hidden: sidebarHidden })
  }
}
