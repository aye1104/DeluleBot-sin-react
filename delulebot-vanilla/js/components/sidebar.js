import { getUser } from '../auth.js'
import { getLastMessage, getUnreadCount } from '../messages.js'
import { createChatCard } from './chatCard.js'
import { escapeHtml } from '../utils.js'

const STATUS_LABEL = { disponible: 'Disponible', ocupado: 'Ocupado', no_molestar: 'No molestar' }

export function createSidebar({ contacts, activeContactId, onSelectContact, onOpenProfile, onLogout, hidden }) {
  const aside = document.createElement('aside')
  aside.className = `sidebar${hidden ? ' sidebar--hidden' : ''}`
  aside.dataset.search = ''

  function render() {
    const user   = getUser()
    const search = aside.dataset.search || ''

    let list = [...contacts]
      .sort((a, b) => (getLastMessage(b.id)?.timestamp || 0) - (getLastMessage(a.id)?.timestamp || 0))

    if (search) list = list.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()))

    aside.innerHTML = `
      <div class="sidebar__header">
        <div class="sidebar__header-row">
          <h1 class="sidebar__title">DeluleBot</h1>
          <div class="sidebar__footer sidebar__footer--header" role="button" title="Editar perfil" id="sb-profile">
            <div class="sidebar__footer-avatar" id="sb-avatar"></div>
            <div class="sidebar__footer-info">
              <div class="sidebar__footer-name">${escapeHtml(user?.name || 'Usuario')}</div>
              <div class="sidebar__footer-status">${escapeHtml(STATUS_LABEL[user?.status] || 'Disponible')}</div>
            </div>
            <button class="sidebar__footer-settings" id="sb-logout" title="Cerrar sesión">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                width="16" height="16">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="sidebar__search">
          <img class="sidebar__search-icon" src="/assets/icons/buscador.svg" alt="Buscar" />
          <input type="text" id="sb-search" placeholder="Buscar chat..." autocomplete="off" value="${escapeHtml(search)}" />
        </div>
      </div>

      <div class="sidebar__list" id="sb-list"></div>
    `

    // Avatar
    const avatarWrap = aside.querySelector('#sb-avatar')
    if (user?.photo) {
      const img = document.createElement('img')
      img.src = user.photo; img.alt = 'Mi perfil'
      img.addEventListener('error', () => img.replaceWith(makePh(user?.name)))
      avatarWrap.appendChild(img)
    } else {
      avatarWrap.appendChild(makePh(user?.name))
    }

    // Lista
    const listEl = aside.querySelector('#sb-list')
    list.forEach(c => listEl.appendChild(createChatCard({
      contact: c,
      isActive: c.id === activeContactId,
      lastMsg: getLastMessage(c.id),
      unreadCount: getUnreadCount(c.id),
      onClick: () => onSelectContact(c.id),
    })))

    // Eventos
    aside.querySelector('#sb-profile').addEventListener('click', onOpenProfile)
    aside.querySelector('#sb-logout').addEventListener('click', e => { e.stopPropagation(); onLogout() })
    aside.querySelector('#sb-search').addEventListener('input', e => { aside.dataset.search = e.target.value; render() })
  }

  render()

  return {
    el: aside,
    update({ contacts: c, activeContactId: a, hidden: h }) {
      contacts = c; activeContactId = a
      aside.className = `sidebar${h ? ' sidebar--hidden' : ''}`
      render()
    },
  }
}

function makePh(name) {
  const d = document.createElement('div')
  d.className = 'chat-card__avatar-placeholder'
  d.style.cssText = 'display:flex;width:32px;height:32px;font-size:.8rem'
  d.textContent = (name || 'U').charAt(0).toUpperCase()
  return d
}
