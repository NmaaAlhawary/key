// Small fetch wrapper: JSON in, JSON out, errors thrown with the server's message.
// On GitHub Pages there is no server: forms show a note instead of sending.
export const STATIC = import.meta.env.VITE_STATIC === '1'

export async function api(path, { method = 'GET', body, form } = {}) {
  if (STATIC) throw new Error('The online forms open with applications on 1 March 2027.')
  const opts = { method, credentials: 'same-origin', headers: {} }
  if (form) opts.body = form
  else if (body !== undefined) { opts.body = JSON.stringify(body); opts.headers['Content-Type'] = 'application/json' }
  const res = await fetch(import.meta.env.BASE_URL.replace(/\/$/, '') + path, opts)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) { const e = new Error(data.error || `Request failed (${res.status})`); e.status = res.status; throw e }
  return data
}

export const fmtDate = s => s ? new Date(s.replace(' ', 'T') + (s.includes('Z') ? '' : 'Z')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
export const fmtTime = s => s ? new Date(s.replace(' ', 'T') + (s.includes('Z') ? '' : 'Z')).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''
