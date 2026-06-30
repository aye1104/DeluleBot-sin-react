// Escapa caracteres HTML para prevenir XSS al insertar en innerHTML
export function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Valida que una URL de foto sea segura antes de usarla como src
export function safeFoto(url) {
  if (!url) return ''
  if (url.startsWith('/assets/')) return url
  if (/^data:image\/(jpeg|png|webp);base64,/.test(url)) return url
  return ''
}
