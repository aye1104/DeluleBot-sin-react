import { getUser } from './auth.js'
import { renderLogin } from './pages/login.js'
import { renderApp } from './pages/app.js'

const root = document.getElementById('root')

function navigate(path) {
  history.pushState({}, '', path)
  route()
}

function route() {
  root.innerHTML = ''
  const path = location.pathname
  if (path === '/app' || path.startsWith('/app/')) {
    if (!getUser()) { navigate('/login'); return }
    renderApp(root, navigate)
  } else {
    renderLogin(root, navigate)
  }
}

window.addEventListener('popstate', route)
route()
