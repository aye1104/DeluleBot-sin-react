// Previene XSS al insertar strings en innerHTML
export function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function safeFoto(url) {
  if (!url) return ''
  if (url.startsWith('/assets/')) return url
  if (/^data:image\/(jpeg|png|webp);base64,/.test(url)) return url
  return ''
}
