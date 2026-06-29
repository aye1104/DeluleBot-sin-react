import * as api from './api'

export const get  = ()        => api.get('/perfil')
export const save = (changes) => api.put('/perfil', changes)
