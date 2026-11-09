import { useId } from 'react'
import StitchKey from './StitchKey.jsx'

// The locked box from Week 0, stitched on the logo's 8-unit grid. When it scrolls in the lid
// lifts and the six-tooth key rises out of it.
const P = 8, R = 3.9
const COLS = 27, ROWS = 9
const dia = (x, y) => `${x},${y - R} ${x + R},${y} ${x},${y + R} ${x - R},${y}`
const at = (c, r) => [c * P + P / 2, r * P + P / 2]

const front = []
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
  const edge = r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1
  const mid = (COLS - 1) / 2, d = Math.abs(c - mid) + Math.abs(r - 4)
  const motif = d === 3 || (d === 0) || (r === 4 && (c === 3 || c === COLS - 4)) // tatreez diamond + side stitches
  if (edge || motif) front.push(at(c, r))
}
const lid = []
for (let r = 0; r < 2; r++) for (let c = -1; c <= COLS; c++) lid.push(at(c, r))

export default function KeyBox() {
  const id = useId().replace(/:/g, '')
  const g = `url(#kx${id})`
  const W = (COLS + 2) * P
  return (
    <div className="kbox" aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id={`kx${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="90">
            <stop offset="0" className="skey-a" /><stop offset=".5" className="skey-b" /><stop offset="1" className="skey-c" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="skey kbox-lid" width={W} height={2 * P} viewBox={`${-P} 0 ${W} ${2 * P}`}>
        {lid.map(([x, y], n) => <polygon key={n} points={dia(x, y)} fill={g} />)}
      </svg>
      <div className="kbox-mouth"><div className="kbox-key"><StitchKey teeth={6} size={280} animate={false} /></div></div>
      <div className="kbox-glow" />
      <svg className="skey kbox-front" width={COLS * P} height={ROWS * P} viewBox={`0 0 ${COLS * P} ${ROWS * P}`}>
        {front.map(([x, y], n) => <polygon key={n} points={dia(x, y)} fill={g} />)}
      </svg>
    </div>
  )
}
