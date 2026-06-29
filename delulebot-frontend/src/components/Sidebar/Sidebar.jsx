import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ChatCard from './ChatCard'

const STATUS_LABEL = { disponible: 'Disponible', ocupado: 'Ocupado', no_molestar: 'No molestar' }

export default function Sidebar({ contacts, activeContactId, onSelectContact, onOpenProfile, onLogout, msgHook, hidden }) {
  const { user } = useAuth()
  const [tab, setTab] = useState('mensajes')
  const [search, setSearch] = useState('')
  const [footerImgError, setFooterImgError] = useState(false)

  let list = contacts
  if (tab === 'mensajes') {
    list = contacts
      .filter(c => msgHook.getMessages(c.id).length > 0)
      .sort((a, b) => {
        const tA = msgHook.getLastMessage(a.id)?.timestamp || 0
        const tB = msgHook.getLastMessage(b.id)?.timestamp || 0
        return tB - tA
      })
  } else {
    list = contacts.filter(c => msgHook.getMessages(c.id).length === 0)
  }

  if (search) {
    list = list.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()))
  }

  function switchTab(t) {
    setTab(t)
    setSearch('')
  }

  return (
    <aside className={`sidebar${hidden ? ' sidebar--hidden' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__header-row">
          <h1 className="sidebar__title">DeluleBot</h1>

          <div className="sidebar__footer sidebar__footer--header" role="button" title="Editar perfil"
            onClick={onOpenProfile}>
            <div className="sidebar__footer-avatar">
              {user?.photo && !footerImgError ? (
                <img src={user.photo} alt="Mi perfil" onError={() => setFooterImgError(true)} />
              ) : (
                <div className="chat-card__avatar-placeholder"
                  style={{ display: 'flex', width: 32, height: 32, fontSize: '.8rem' }}>
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="sidebar__footer-info">
              <div className="sidebar__footer-name">{user?.name || 'Usuario'}</div>
              <div className="sidebar__footer-status">{STATUS_LABEL[user?.status] || 'Disponible'}</div>
            </div>
            <button className="sidebar__footer-settings" title="Cerrar sesión"
              onClick={e => { e.stopPropagation(); onLogout() }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                width="16" height="16">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="sidebar__search">
          <img className="sidebar__search-icon" src="/assets/icons/buscador.svg" alt="Buscar" />
          <input type="text" placeholder="Buscar contacto..." autoComplete="off"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <nav className="sidebar__nav">
        <button className={`sidebar__nav-btn${tab === 'mensajes' ? ' active' : ''}`}
          onClick={() => switchTab('mensajes')}>
          <img src="/assets/icons/mensaje.svg" width="15" height="15" alt="" />
          Mensajes
        </button>
        <button className={`sidebar__nav-btn${tab === 'contactos' ? ' active' : ''}`}
          onClick={() => switchTab('contactos')}>
          <img src="/assets/icons/contacto.svg" width="15" height="15" alt="" />
          Contactos
        </button>
      </nav>

      <div className="sidebar__list">
        {list.length === 0 ? (
          <div className="sidebar__empty">
            {tab === 'mensajes' ? (
              <>
                <div className="sidebar__empty-icon">💬</div>
                <p>No hay conversaciones aún.<br/>Tocá <strong>Contactos</strong> para empezar.</p>
              </>
            ) : (
              <>
                <div className="sidebar__empty-icon">✅</div>
                <p>Ya tenés una conversación<br/>con todos tus contactos.</p>
              </>
            )}
          </div>
        ) : (
          list.map(contact => (
            <ChatCard
              key={contact.id}
              contact={contact}
              isActive={contact.id === activeContactId}
              lastMsg={msgHook.getLastMessage(contact.id)}
              unreadCount={msgHook.getUnreadCount(contact.id)}
              onClick={() => onSelectContact(contact.id)}
            />
          ))
        )}
      </div>
    </aside>
  )
}
