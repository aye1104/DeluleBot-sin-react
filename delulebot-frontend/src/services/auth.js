import * as api from './api'

export const login   = (username, password)        => api.post('/auth/login', { username, password })
export const registro = (username, password, name) => api.post('/auth/registro', { username, password, name })
export const logout  = ()                          => api.post('/auth/logout', {})
