import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as authService from '../services/auth'

export default function LoginPage() {
  const { user, setSession } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  // Login fields
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameErr, setUsernameErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [loginErr, setLoginErr] = useState(null) // null | string | { text, linkLabel }

  // Register fields
  const [regUsername, setRegUsername] = useState('')
  const [regName, setRegName] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regUsernameErr, setRegUsernameErr] = useState('')
  const [regPasswordErr, setRegPasswordErr] = useState('')
  const [regConfirmErr, setRegConfirmErr] = useState('')
  const [registerErr, setRegisterErr] = useState('')

  const usernameRef = useRef(null)

  useEffect(() => {
    if (user) navigate('/app', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    if (tab === 'login') usernameRef.current?.focus()
  }, [tab])

  function switchTab(t) {
    setTab(t)
    setLoginErr(null)
    setUsernameErr('')
    setPasswordErr('')
    setRegisterErr('')
    setRegUsernameErr('')
    setRegPasswordErr('')
    setRegConfirmErr('')
  }

  async function handleLogin(e) {
    e?.preventDefault()
    let valid = true
    if (!username.trim()) { setUsernameErr('Ingresá tu usuario.'); valid = false }
    if (!password)         { setPasswordErr('Ingresá tu contraseña.'); valid = false }
    if (!valid) return

    setLoading(true)
    setLoginErr(null)
    try {
      const data = await authService.login(username.trim(), password)
      setSession(data.user)
      navigate('/app', { replace: true })
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        setLoginErr({ text: err.message + ' ', linkLabel: 'Registrate acá' })
      } else {
        setLoginErr(err.message || 'Contraseña incorrecta.')
        setPasswordErr(' ')
      }
      setUsernameErr(' ')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e?.preventDefault()
    let valid = true
    setRegUsernameErr('')
    setRegPasswordErr('')
    setRegConfirmErr('')
    setRegisterErr('')

    if (!regUsername.trim()) { setRegUsernameErr('Ingresá un usuario.'); valid = false }
    if (!regPassword)         { setRegPasswordErr('Ingresá una contraseña.'); valid = false }
    if (regPassword && regConfirm !== regPassword) {
      setRegConfirmErr('Las contraseñas no coinciden.'); valid = false
    }
    if (!valid) return

    setLoading(true)
    try {
      const data = await authService.registro(regUsername.trim(), regPassword, regName.trim() || regUsername.trim())
      setSession(data.user)
      navigate('/app', { replace: true })
    } catch (err) {
      setRegisterErr(err.message || 'Error al crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              width="26" height="26">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
        </div>

        <h1 className="login-title">{tab === 'login' ? 'Inicia sesión' : 'Crear cuenta'}</h1>
        <p className="login-subtitle">{tab === 'login' ? 'Bienvenido a DeluleBot' : 'Únete a DeluleBot'}</p>

        {/* Tabs */}
        <div className="login-tabs">
          <button className={`login-tab${tab === 'login' ? ' active' : ''}`} type="button"
            onClick={() => switchTab('login')}>Iniciar sesión</button>
          <button className={`login-tab${tab === 'register' ? ' active' : ''}`} type="button"
            onClick={() => switchTab('register')}>Registrarse</button>
        </div>

        {/* ── Login Form ─────────────────────────────────────────── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Usuario</label>
              <input ref={usernameRef} className={`form-input form-control${usernameErr ? ' error' : ''}`}
                type="text" id="username" placeholder="Tu nombre de usuario"
                autoComplete="username"
                value={username}
                onChange={e => { setUsername(e.target.value); setUsernameErr(''); setLoginErr(null) }} />
              {usernameErr && usernameErr !== ' ' && <span className="form-error visible">{usernameErr}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <div className="form-input-wrapper">
                <input className={`form-input form-control${passwordErr ? ' error' : ''}`}
                  type={showPass ? 'text' : 'password'} id="password"
                  placeholder="••••••••" autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordErr(''); setLoginErr(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button className="btn-toggle-password" type="button"
                  title="Mostrar contraseña" aria-label="Mostrar contraseña"
                  onClick={() => setShowPass(v => !v)}>
                  {!showPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      width="17" height="17">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      width="17" height="17">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              </div>
              {passwordErr && passwordErr !== ' ' && <span className="form-error visible">{passwordErr}</span>}
            </div>

            <button className="btn-primary btn btn-success w-100" type="submit" disabled={loading}>
              {loading ? <><span className="spinner"></span> Ingresando...</> : 'Entrar'}
            </button>

            {loginErr && (
              <span className="form-error visible" style={{ textAlign: 'center', marginTop: '.75rem' }}>
                {typeof loginErr === 'string' ? loginErr : (
                  <>
                    {loginErr.text}
                    <span className="login-error-link" onClick={() => switchTab('register')}>
                      {loginErr.linkLabel}
                    </span>
                  </>
                )}
              </span>
            )}
          </form>
        )}

        {/* ── Register Form ──────────────────────────────────────── */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="regUsername">Usuario</label>
              <input className={`form-input form-control${regUsernameErr ? ' error' : ''}`}
                type="text" id="regUsername" placeholder="Elegí un nombre de usuario"
                autoComplete="off"
                value={regUsername}
                onChange={e => { setRegUsername(e.target.value); setRegUsernameErr('') }} />
              {regUsernameErr && <span className="form-error visible">{regUsernameErr}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regName">Nombre para mostrar</label>
              <input className="form-input form-control" type="text" id="regName"
                placeholder="¿Cómo querés que te llamen?" autoComplete="off"
                value={regName}
                onChange={e => setRegName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regPassword">Contraseña</label>
              <input className={`form-input form-control${regPasswordErr ? ' error' : ''}`}
                type="password" id="regPassword" placeholder="••••••••"
                autoComplete="new-password"
                value={regPassword}
                onChange={e => { setRegPassword(e.target.value); setRegPasswordErr('') }} />
              {regPasswordErr && <span className="form-error visible">{regPasswordErr}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regConfirm">Confirmar contraseña</label>
              <input className={`form-input form-control${regConfirmErr ? ' error' : ''}`}
                type="password" id="regConfirm" placeholder="••••••••"
                autoComplete="new-password"
                value={regConfirm}
                onChange={e => { setRegConfirm(e.target.value); setRegConfirmErr('') }}
                onKeyDown={e => e.key === 'Enter' && handleRegister()} />
              {regConfirmErr && <span className="form-error visible">{regConfirmErr}</span>}
            </div>

            <button className="btn-primary btn btn-success w-100" type="submit" disabled={loading}>
              {loading ? <><span className="spinner"></span> Creando cuenta...</> : 'Crear cuenta'}
            </button>

            {registerErr && (
              <span className="form-error visible" style={{ textAlign: 'center', marginTop: '.75rem' }}>
                {registerErr}
              </span>
            )}
          </form>
        )}

      </div>

      {/* Footer */}
      <div className="login-footer">
        <div className="login-footer-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Encriptación de extremo a extremo
        </div>
        <div className="login-footer-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          Servidores neutrales
        </div>
      </div>
    </div>
  )
}
