const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (res.status === 401 && !path.startsWith('/auth/')) {
    localStorage.removeItem('chat_session')
    window.location.href = '/login'
    return
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err  = new Error(body.error || `API ${res.status}`)
    err.status = res.status
    err.code   = body.code
    throw err
  }
  return res.json()
}

export const get   = (path)       => request(path)
export const post  = (path, body) => request(path, { method: 'POST',   body: JSON.stringify(body) })
export const put   = (path, body) => request(path, { method: 'PUT',    body: JSON.stringify(body) })
export const patch = (path, body) => request(path, { method: 'PATCH',  body: JSON.stringify(body) })
export const del   = (path)       => request(path, { method: 'DELETE' })
