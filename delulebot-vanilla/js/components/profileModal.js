import { getUser, saveProfile } from '../auth.js'
import { put } from '../api.js'
import { escapeHtml } from '../utils.js'

const VALID_STATUS = [
  { value: 'disponible',  label: '🟢 Disponible' },
  { value: 'ocupado',     label: '🟡 Ocupado' },
  { value: 'no_molestar', label: '🔴 No molestar' },
]

export function openProfileModal({ onClose, onSaved } = {}) {
  const user = getUser()
  let name         = user?.name || ''
  let desc         = user?.descripcion || ''
  let status       = user?.status || 'disponible'
  let photo        = user?.photo || null
  let pendingPhoto = undefined
  let saving       = false

  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1055;display:flex;align-items:center;justify-content:center;padding:1rem'
  overlay.addEventListener('click', close)

  const card = document.createElement('div')
  card.style.cssText = 'background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.22);width:100%;max-width:480px;display:flex;flex-direction:column;overflow:hidden'
  card.addEventListener('click', e => e.stopPropagation())
  overlay.appendChild(card)

  card.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem 1rem;border-bottom:1px solid #e0e3e8">
      <h5 style="margin:0;font-size:1.05rem;font-weight:700;color:#1a1a1a">Editar perfil</h5>
      <button id="pm-close" style="background:none;border:none;cursor:pointer;color:#9aa0ac;font-size:1.2rem;padding:.2rem;border-radius:6px;display:flex;align-items:center">✕</button>
    </div>
    <div style="padding:1.5rem;display:flex;flex-direction:column;gap:1.1rem">
      <div style="display:flex;flex-direction:column;align-items:center;gap:.75rem">
        <div id="pm-avatar" style="width:88px;height:88px;border-radius:50%;border:3px solid #e0e3e8;background:#d1fae5;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#1b6b3a;flex-shrink:0;user-select:none"></div>
        <div style="display:flex;gap:.5rem">
          <label for="pm-file" style="padding:.35rem .85rem;font-size:.8rem;font-weight:500;border-radius:8px;cursor:pointer;border:1px solid #d1d5db;background:#fff;color:#374151">
            📷 Cambiar foto
            <input type="file" id="pm-file" accept="image/jpeg,image/png,image/webp" style="display:none" />
          </label>
          <button id="pm-remove-photo" style="padding:.35rem .85rem;font-size:.8rem;font-weight:500;border-radius:8px;cursor:pointer;border:1px solid #fca5a5;background:#fff;color:#ef4444">Quitar foto</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:.35rem">
        <label style="font-size:.8rem;font-weight:600;color:#374151" for="pm-name">Nombre</label>
        <input id="pm-name" type="text" maxlength="40" placeholder="Tu nombre" value="${escapeHtml(name)}"
          style="padding:.6rem .875rem;font-size:.9rem;border:1.5px solid #e0e3e8;border-radius:8px;outline:none;color:#1a1a1a;font-family:inherit;background:#f9fafb" />
      </div>
      <div style="display:flex;flex-direction:column;gap:.35rem">
        <label style="font-size:.8rem;font-weight:600;color:#374151" for="pm-desc">Descripción</label>
        <input id="pm-desc" type="text" maxlength="80" placeholder="Ej: En línea y disponible" value="${escapeHtml(desc)}"
          style="padding:.6rem .875rem;font-size:.9rem;border:1.5px solid #e0e3e8;border-radius:8px;outline:none;color:#1a1a1a;font-family:inherit;background:#f9fafb" />
      </div>
      <div style="display:flex;flex-direction:column;gap:.35rem">
        <label style="font-size:.8rem;font-weight:600;color:#374151" for="pm-status">Estado</label>
        <select id="pm-status" style="padding:.6rem .875rem;font-size:.9rem;border:1.5px solid #e0e3e8;border-radius:8px;outline:none;color:#1a1a1a;font-family:inherit;background:#f9fafb;cursor:pointer;width:100%">
          ${VALID_STATUS.map(s => `<option value="${s.value}"${s.value === status ? ' selected' : ''}>${s.label}</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="pm-error" style="display:none;margin:0 1.5rem;padding:.55rem .875rem;background:#fef2f2;color:#b91c1c;border-radius:8px;font-size:.82rem;border:1px solid #fca5a5"></div>
    <div style="display:flex;justify-content:flex-end;gap:.75rem;padding:1rem 1.5rem;border-top:1px solid #e0e3e8">
      <button id="pm-cancel" style="padding:.55rem 1.25rem;font-size:.875rem;font-weight:500;border-radius:8px;cursor:pointer;border:1px solid #d1d5db;background:#fff;color:#374151">Cancelar</button>
      <button id="pm-save" style="padding:.55rem 1.25rem;font-size:.875rem;font-weight:600;border-radius:8px;cursor:pointer;border:none;background:#1b6b3a;color:#fff">Guardar cambios</button>
    </div>
  `

  document.body.appendChild(overlay)

  function close() { overlay.remove(); onClose?.() }
  function renderAvatar() {
    const av = card.querySelector('#pm-avatar')
    if (photo) {
      av.style.backgroundImage = `url('${photo}')`
      av.style.backgroundSize = 'cover'
      av.style.backgroundPosition = 'center'
      av.textContent = ''
    } else {
      av.style.backgroundImage = ''
      av.textContent = (name || 'U').charAt(0).toUpperCase()
    }
  }
  renderAvatar()

  card.querySelector('#pm-close').addEventListener('click', close)
  card.querySelector('#pm-cancel').addEventListener('click', close)
  card.querySelector('#pm-remove-photo').addEventListener('click', () => { pendingPhoto = null; photo = null; renderAvatar() })

  card.querySelector('#pm-file').addEventListener('change', e => {
    const file = e.target.files[0]
    if (!file) return
    const errEl = card.querySelector('#pm-error')
    errEl.style.display = 'none'
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        try {
          const MAX = 320, scale = Math.min(1, MAX / Math.max(img.width, img.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(img.width * scale)
          canvas.height = Math.round(img.height * scale)
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
          pendingPhoto = dataUrl; photo = dataUrl; renderAvatar()
        } catch {
          errEl.textContent = 'No se pudo procesar la imagen. Probá con otro archivo.'
          errEl.style.display = 'block'
        }
      }
      img.onerror = () => {
        errEl.textContent = 'El archivo seleccionado no es una imagen válida.'
        errEl.style.display = 'block'
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })

  const nameInput = card.querySelector('#pm-name')
  const descInput = card.querySelector('#pm-desc')
  const statusSel = card.querySelector('#pm-status')
  nameInput.addEventListener('focus', e => { e.target.style.borderColor = '#1b6b3a' })
  nameInput.addEventListener('blur',  e => { e.target.style.borderColor = '#e0e3e8' })
  descInput.addEventListener('focus', e => { e.target.style.borderColor = '#1b6b3a' })
  descInput.addEventListener('blur',  e => { e.target.style.borderColor = '#e0e3e8' })

  card.querySelector('#pm-save').addEventListener('click', async () => {
    if (saving) return
    saving = true
    const btn    = card.querySelector('#pm-save')
    const errEl  = card.querySelector('#pm-error')
    errEl.style.display = 'none'
    btn.textContent = 'Guardando...'
    btn.style.background = '#d1d5db'
    try {
      const changes = { name: nameInput.value.trim() || 'Usuario', descripcion: descInput.value.trim(), status: statusSel.value }
      if (pendingPhoto !== undefined) changes.photo = pendingPhoto
      const saved = await put('/perfil', changes)
      saveProfile(saved)
      onSaved?.(saved)
      close()
    } catch (err) {
      errEl.textContent = err.message || 'No se pudo guardar. Intentá de nuevo.'
      errEl.style.display = 'block'
      btn.textContent = 'Guardar cambios'
      btn.style.background = '#1b6b3a'
    } finally {
      saving = false
    }
  })
}
