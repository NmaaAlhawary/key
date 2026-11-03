import { useEffect, useState } from 'react'
import { api, STATIC } from './api.js'

// Public settings the admin controls: whether the call is open, and the dates shown.
export function useSettings() {
  const [s, setS] = useState({ apps_open: true, call_dates: '1 to 14 March 2027', season_label: 'Season one · Amman', seat_price: '350 JOD' })
  useEffect(() => { if (STATIC) { setS(x => ({ ...x, apps_open: false })); return } api('/api/public/settings').then(setS).catch(() => {}) }, [])
  return s
}
