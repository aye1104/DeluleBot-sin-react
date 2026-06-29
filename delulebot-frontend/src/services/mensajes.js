import * as api from './api'

const base    = (cId)       => `/contactos/${cId}/mensajes`
const msgBase = (cId, mId)  => `${base(cId)}/${mId}`

export const getAll      = (cId)              => api.get(base(cId))
export const send        = (cId, msg)         => api.post(base(cId), msg)
export const setStatus   = (cId, mId, status) => api.patch(`${msgBase(cId, mId)}/status`, { status })
export const react       = (cId, mId, emoji)  => api.patch(`${msgBase(cId, mId)}/reaction`, { emoji })
export const remove      = (cId, mId)         => api.patch(`${msgBase(cId, mId)}/delete`, {})
export const clear       = (cId)              => api.del(base(cId))
