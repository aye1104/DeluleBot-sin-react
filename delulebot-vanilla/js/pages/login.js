import { getUser, setSession } from '../auth.js'
import { post } from '../api.js'
import { escapeHtml } from '../utils.js'

export function renderLogin(container, navigate) {
  if (getUser()) { navigate('/app'); return }

  let tab = 'login', showPass = false, loading = false
  let username = '', password = '', usernameErr = '', passwordErr = '', loginErr = null
  let regUsername = '', regName = '', regPassword = '', regConfirm = ''
  let regUsernameErr = '', regPasswordErr = '', regConfirmErr = '', registerErr = ''

  function render() {
    container.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <div class="login-logo">
            <div class="login-logo__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
          </div>
          <h1 class="login-title">${tab === 'login' ? 'Inicia sesión' : 'Crear cuenta'}</h1>
          <p class="login-subtitle">${tab === 'login' ? 'Bienvenido a DeluleBot' : 'Únete a DeluleBot'}</p>
          <div class="login-tabs">
            <button class="login-tab${tab === 'login' ? ' active' : ''}" data-tab="login" type="button">Iniciar sesión</button>
            <button class="login-tab${tab === 'register' ? ' active' : ''}" data-tab="register" type="button">Registrarse</button>
          </div>
          ${tab === 'login' ? loginForm() : registerForm()}
        </div>
        <div class="login-footer">
          <div class="login-footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Encriptación de extremo a extremo
          </div>
          <div class="login-footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            Servidores neutrales
          </div>
        </div>
      </div>
    `
    bind()
    if (tab === 'login') container.querySelector('#username')?.focus()
  }

  function loginForm() {
    return `
      <form id="lf" novalidate>
        <div class="form-group">
          <label class="form-label" for="username">Usuario</label>
          <input class="form-input form-control${usernameErr ? ' error' : ''}" type="text" id="username"
            placeholder="Tu nombre de usuario" autocomplete="username" value="${escapeHtml(username)}" />
          ${usernameErr && usernameErr !== ' ' ? `<span class="form-error visible">${usernameErr}</span>` : ''}
        </div>
        <div class="form-group">
          <label class="form-label" for="password">Contraseña</label>
          <div class="form-input-wrapper">
            <input class="form-input form-control${passwordErr ? ' error' : ''}"
              type="${showPass ? 'text' : 'password'}" id="password"
              placeholder="••••••••" autocomplete="current-password" value="${escapeHtml(password)}" />
            <button class="btn-toggle-password" type="button" id="toggle-pass">${showPass ? eyeOff() : eye()}</button>
          </div>
          ${passwordErr && passwordErr !== ' ' ? `<span class="form-error visible">${passwordErr}</span>` : ''}
        </div>
        <button class="btn-primary btn btn-success w-100" type="submit" ${loading ? 'disabled' : ''}>
          ${loading ? '<span class="spinner"></span> Ingresando...' : 'Entrar'}
        </button>
        ${loginErr ? errBanner() : ''}
      </form>
    `
  }

  function registerForm() {
    return `
      <form id="rf" novalidate>
        <div class="form-group">
          <label class="form-label" for="regUsername">Usuario</label>
          <input class="form-input form-control${regUsernameErr ? ' error' : ''}" type="text" id="regUsername"
            placeholder="Elegí un nombre de usuario" autocomplete="off" value="${escapeHtml(regUsername)}" />
          ${regUsernameErr ? `<span class="form-error visible">${regUsernameErr}</span>` : ''}
        </div>
        <div class="form-group">
          <label class="form-label" for="regName">Nombre para mostrar</label>
          <input class="form-input form-control" type="text" id="regName"
            placeholder="¿Cómo querés que te llamen?" autocomplete="off" value="${escapeHtml(regName)}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="regPassword">Contraseña</label>
          <input class="form-input form-control${regPasswordErr ? ' error' : ''}" type="password" id="regPassword"
            placeholder="••••••••" autocomplete="new-password" value="${escapeHtml(regPassword)}" />
          ${regPasswordErr ? `<span class="form-error visible">${regPasswordErr}</span>` : ''}
        </div>
        <div class="form-group">
          <label class="form-label" for="regConfirm">Confirmar contraseña</label>
          <input class="form-input form-control${regConfirmErr ? ' error' : ''}" type="password" id="regConfirm"
            placeholder="••••••••" autocomplete="new-password" value="${escapeHtml(regConfirm)}" />
          ${regConfirmErr ? `<span class="form-error visible">${regConfirmErr}</span>` : ''}
        </div>
        <button class="btn-primary btn btn-success w-100" type="submit" ${loading ? 'disabled' : ''}>
          ${loading ? '<span class="spinner"></span> Creando cuenta...' : 'Crear cuenta'}
        </button>
        ${registerErr ? `<span class="form-error visible" style="text-align:center;margin-top:.75rem">${registerErr}</span>` : ''}
      </form>
    `
  }

  function errBanner() {
    if (typeof loginErr === 'string')
      return `<span class="form-error visible" style="text-align:center;margin-top:.75rem">${loginErr}</span>`
    return `<span class="form-error visible" style="text-align:center;margin-top:.75rem">
      ${loginErr.text}<span class="login-error-link" id="go-reg">${loginErr.linkLabel}</span>
    </span>`
  }

  function bind() {
    container.querySelectorAll('.login-tab').forEach(b => b.addEventListener('click', () => {
      tab = b.dataset.tab; loginErr = null; usernameErr = ''; passwordErr = ''
      regUsernameErr = ''; regPasswordErr = ''; regConfirmErr = ''; registerErr = ''; render()
    }))
    container.querySelector('#go-reg')?.addEventListener('click', () => { tab = 'register'; loginErr = null; render() })
    container.querySelector('#toggle-pass')?.addEventListener('click', () => {
      username = container.querySelector('#username')?.value || username
      password = container.querySelector('#password')?.value || password
      showPass = !showPass; render()
    })

    const lf = container.querySelector('#lf')
    if (lf) {
      lf.addEventListener('input', e => {
        if (e.target.id === 'username') { username = e.target.value; usernameErr = ''; loginErr = null }
        if (e.target.id === 'password') { password = e.target.value; passwordErr = ''; loginErr = null }
      })
      lf.addEventListener('submit', handleLogin)
    }

    const rf = container.querySelector('#rf')
    if (rf) {
      rf.addEventListener('input', e => {
        if (e.target.id === 'regUsername') { regUsername = e.target.value; regUsernameErr = '' }
        if (e.target.id === 'regName')     { regName     = e.target.value }
        if (e.target.id === 'regPassword') { regPassword = e.target.value; regPasswordErr = '' }
        if (e.target.id === 'regConfirm')  { regConfirm  = e.target.value; regConfirmErr  = '' }
      })
      rf.addEventListener('submit', handleRegister)
    }
  }

  async function handleLogin(e) {
    e?.preventDefault()
    let valid = true; usernameErr = ''; passwordErr = ''; loginErr = null
    if (!username.trim()) { usernameErr = 'Ingresá tu usuario.';    valid = false }
    if (!password)        { passwordErr = 'Ingresá tu contraseña.'; valid = false }
    if (!valid) { render(); return }
    loading = true; render()
    let navigated = false
    try {
      const data = await post('/auth/login', { username: username.trim(), password })
      setSession(data.user); navigated = true; navigate('/app')
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        loginErr = { text: err.message + ' ', linkLabel: 'Registrate acá' }
      } else {
        loginErr = err.message || 'Contraseña incorrecta.'; passwordErr = ' '
      }
      usernameErr = ' '
    } finally { loading = false; if (!navigated) render() }
  }

  async function handleRegister(e) {
    e?.preventDefault()
    let valid = true; regUsernameErr = ''; regPasswordErr = ''; regConfirmErr = ''; registerErr = ''
    if (!regUsername.trim()) { regUsernameErr = 'Ingresá un usuario.';    valid = false }
    if (!regPassword)        { regPasswordErr = 'Ingresá una contraseña.'; valid = false }
    if (regPassword && regConfirm !== regPassword) { regConfirmErr = 'Las contraseñas no coinciden.'; valid = false }
    if (!valid) { render(); return }
    loading = true; render()
    let navigated = false
    try {
      const data = await post('/auth/registro', { username: regUsername.trim(), password: regPassword, name: regName.trim() || regUsername.trim() })
      setSession(data.user); navigated = true; navigate('/app')
    } catch (err) {
      registerErr = err.message || 'Error al crear la cuenta.'
    } finally { loading = false; if (!navigated) render() }
  }

  render()
}

const eye    = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
const eyeOff = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
