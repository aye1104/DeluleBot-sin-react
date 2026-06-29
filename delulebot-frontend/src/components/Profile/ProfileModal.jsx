import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as PerfilService from '../../services/perfil'

const VALID_STATUS = [
  { value: 'disponible',  label: '🟢 Disponible' },
  { value: 'ocupado',     label: '🟡 Ocupado' },
  { value: 'no_molestar', label: '🔴 No molestar' },
]

const s = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 1055,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.25rem 1.5rem 1rem',
    borderBottom: '1px solid #e0e3e8',
  },
  title: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#9aa0ac', fontSize: '1.2rem', lineHeight: 1,
    padding: '0.2rem', borderRadius: 6,
    display: 'flex', alignItems: 'center',
  },
  body: {
    padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '1.1rem',
  },
  avatarArea: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
  },
  avatar: (photo) => ({
    width: 88, height: 88, borderRadius: '50%',
    border: '3px solid #e0e3e8',
    background: photo ? `url('${photo}') center/cover no-repeat` : '#d1fae5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 700, color: '#1b6b3a',
    flexShrink: 0,
    userSelect: 'none',
  }),
  avatarBtns: {
    display: 'flex', gap: '0.5rem',
  },
  btnOutline: {
    padding: '0.35rem 0.85rem',
    fontSize: '0.8rem', fontWeight: 500,
    borderRadius: 8, cursor: 'pointer',
    border: '1px solid #d1d5db',
    background: '#fff', color: '#374151',
  },
  btnDanger: {
    padding: '0.35rem 0.85rem',
    fontSize: '0.8rem', fontWeight: 500,
    borderRadius: 8, cursor: 'pointer',
    border: '1px solid #fca5a5',
    background: '#fff', color: '#ef4444',
  },
  field: {
    display: 'flex', flexDirection: 'column', gap: '0.35rem',
  },
  label: {
    fontSize: '0.8rem', fontWeight: 600, color: '#374151',
  },
  input: {
    padding: '0.6rem 0.875rem',
    fontSize: '0.9rem',
    border: '1.5px solid #e0e3e8',
    borderRadius: 8,
    outline: 'none',
    color: '#1a1a1a',
    fontFamily: 'inherit',
    transition: 'border-color 0.18s',
    background: '#f9fafb',
  },
  select: {
    padding: '0.6rem 0.875rem',
    fontSize: '0.9rem',
    border: '1.5px solid #e0e3e8',
    borderRadius: 8,
    outline: 'none',
    color: '#1a1a1a',
    fontFamily: 'inherit',
    background: '#f9fafb',
    cursor: 'pointer',
    width: '100%',
  },
  footer: {
    display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e0e3e8',
  },
  btnCancel: {
    padding: '0.55rem 1.25rem',
    fontSize: '0.875rem', fontWeight: 500,
    borderRadius: 8, cursor: 'pointer',
    border: '1px solid #d1d5db',
    background: '#fff', color: '#374151',
  },
  btnSave: (disabled) => ({
    padding: '0.55rem 1.25rem',
    fontSize: '0.875rem', fontWeight: 600,
    borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    background: disabled ? '#d1d5db' : '#1b6b3a',
    color: '#fff',
  }),
}

export default function ProfileModal({ onClose, onSaved }) {
  const { user } = useAuth()

  const [name, setName]               = useState(user?.name || '')
  const [desc, setDesc]               = useState(user?.descripcion || '')
  const [status, setStatus]           = useState(user?.status || 'disponible')
  const [photo, setPhoto]             = useState(user?.photo || null)
  const [pendingPhoto, setPendingPhoto] = useState(undefined)
  const [saving, setSaving]           = useState(false)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const MAX = 320
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75)
        setPendingPhoto(dataUrl)
        setPhoto(dataUrl)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  function handleRemovePhoto() {
    setPendingPhoto(null)
    setPhoto(null)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const changes = { name: name.trim() || 'Usuario', descripcion: desc.trim(), status }
      if (pendingPhoto !== undefined) changes.photo = pendingPhoto
      const saved = await PerfilService.save(changes)
      onSaved(saved)
      onClose()
    } catch (err) {
      console.error('[Perfil] Error al guardar:', err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={s.header}>
          <h5 style={s.title}>Editar perfil</h5>
          <button style={s.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Body */}
        <div style={s.body}>

          {/* Avatar */}
          <div style={s.avatarArea}>
            <div style={s.avatar(photo)}>
              {!photo && (name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={s.avatarBtns}>
              <label style={s.btnOutline} htmlFor="inputFotoPerfil">
                📷 Cambiar foto
                <input type="file" id="inputFotoPerfil"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
              <button style={s.btnDanger} onClick={handleRemovePhoto}>Quitar foto</button>
            </div>
          </div>

          {/* Nombre */}
          <div style={s.field}>
            <label style={s.label} htmlFor="inputNombre">Nombre</label>
            <input id="inputNombre" type="text" maxLength={40}
              placeholder="Tu nombre"
              style={s.input}
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#1b6b3a'}
              onBlur={e => e.target.style.borderColor = '#e0e3e8'}
            />
          </div>

          {/* Descripción */}
          <div style={s.field}>
            <label style={s.label} htmlFor="inputDesc">Descripción</label>
            <input id="inputDesc" type="text" maxLength={80}
              placeholder="Ej: En línea y disponible"
              style={s.input}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#1b6b3a'}
              onBlur={e => e.target.style.borderColor = '#e0e3e8'}
            />
          </div>

          {/* Estado */}
          <div style={s.field}>
            <label style={s.label} htmlFor="selectEstado">Estado</label>
            <select id="selectEstado" style={s.select}
              value={status} onChange={e => setStatus(e.target.value)}>
              {VALID_STATUS.map(st => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <button style={s.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={s.btnSave(saving)} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </div>
  )
}
