import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Adds a scroll-in reveal to common blocks on every page, staggered within each group.
const SEL = [
  '.sec .h2', '.lead', '.split > *', '.tiles > *', '.jcard', '.gcard', '.kcard', '.ccard', '.rcard', '.ctabox',
  '.datecard', '.row-media', '.row-in > div:not(.row-media)', '.band-in', '.org .wrap > *', '.faq details',
  '.ptable', '.give > div', '.blade', '.postcards .postcard', '.free', '.stats > div', '.apply-side', '.apply-card', '.dform', '.subhead', '.rhythm', '.jfoot',
].join(',')

export function useReveal() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    let io
    const t = setTimeout(() => {
      const els = [...document.querySelectorAll(SEL)].filter(el => !el.closest('.hero, .pop'))
      const groups = new Map()
      els.forEach(el => {
        const g = groups.get(el.parentElement) || 0
        groups.set(el.parentElement, g + 1)
        el.style.setProperty('--d', `${Math.min(g, 6) * 0.08}s`)
        if (el.classList.contains('row-media')) el.classList.add(el.closest('.flip') ? 'rv-r' : 'rv-l')
        el.classList.add('rv')
      })
      document.querySelectorAll('.stitch-anim').forEach(el => els.includes(el) || els.push(el))
      io = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => io.observe(el))
    }, 60)
    return () => { clearTimeout(t); io?.disconnect() }
  }, [pathname])
}

// Counts a number up from 0 when it scrolls into view.
export function countUp(root = document) {
  root.querySelectorAll('[data-count]').forEach(el => {
    const end = Number(el.dataset.count), suf = el.dataset.suffix || ''
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = now => { const k = Math.min(1, (now - t0) / 1100); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(tick) }
      requestAnimationFrame(tick)
    })
    io.observe(el)
  })
}
