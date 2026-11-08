import { useId } from 'react'
import { BOW } from './keyBow.js'

// A stitched key in the style of the journey key: the logo's diamond bow, a two-row blade and
// `teeth` teeth (stage n of six gets n). Unearned teeth show as faint ghosts.
const P = 8, R = 4.96
const TOOTH_X = [0, 1, 2, 3, 4, 5].map(i => 116 + i * 24)
const TIP = 268
const dia = (x, y) => `${x},${y - R} ${x + R},${y} ${x},${y + R} ${x - R},${y}`

const cells = []
BOW.forEach(p => cells.push({ p, t: 'bow' }))
for (let x = 92; x <= TIP - P; x += P) for (const y of [40, 48]) cells.push({ p: dia(x, y), t: 'shaft', x })
cells.push({ p: dia(TIP, 44), t: 'shaft', x: TIP })
TOOTH_X.forEach((x, k) => {
  for (let r = 0; r <= k; r++) for (const cx of [x, x + P]) cells.push({ p: dia(cx, 56 + r * P), t: 'tooth', k, x: cx })
})

export default function StitchKey({ teeth = 1, size = 150, color, dim = 'rgba(255,255,255,.1)', animate = true, className = '' }) {
  const id = useId().replace(/:/g, '')
  const fill = color || `url(#g${id})`
  return (
    <svg className={`skey ${animate ? 'stitch-anim' : ''} ${className}`} width={size} height={size * 112 / 284} viewBox="-6 -6 284 112" aria-hidden="true">
      {!color && (
        <defs>
          <linearGradient id={`g${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="272" y2="100">
            <stop offset="0" className="skey-a" /><stop offset=".5" className="skey-b" /><stop offset="1" className="skey-c" />
          </linearGradient>
        </defs>
      )}
      {cells.map((c, n) => {
        const ghost = c.t === 'tooth' && c.k >= teeth
        const i = c.t === 'bow' ? 0 : c.t === 'shaft' ? (c.x - 92) / P / 2 : 14 + c.k * 3
        return <polygon key={n} points={c.p} fill={ghost ? dim : fill} style={{ '--i': i }} />
      })}
    </svg>
  )
}
