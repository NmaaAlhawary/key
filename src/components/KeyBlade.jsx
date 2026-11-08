import { KEYS } from '../content.js'
import { BOW } from './keyBow.js'

// The six stages drawn as the teeth of one long key, all on the logo's 8-unit diamond grid:
// bow = the locked box, six teeth = the six keys, tip = the Vault.
const P = 8, R = 4.96
const VB = { x: -2, y: -2, w: 628, h: 112 }
const BAR = { from: 92, to: 612, rows: [40, 48] }
const TIP = 620
const TOOTH_X = KEYS.map((_, i) => 148 + i * 88)   // left column of each tooth
const TOOTH_TOP = 56

const dia = (x, y) => `${x},${y - R} ${x + R},${y} ${x},${y + R} ${x - R},${y}`
const pct = x => `${((x - VB.x) / VB.w) * 100}%`

const shaft = []
for (let x = BAR.from; x <= BAR.to; x += P) for (const y of BAR.rows) shaft.push([x, y])
shaft.push([TIP, 44])
const teeth = TOOTH_X.flatMap((x, i) => Array.from({ length: i + 1 }, (_, r) => [[x, TOOTH_TOP + r * P], [x + P, TOOTH_TOP + r * P]]).flat())

export default function KeyBlade() {
  const stops = (a, b, c) => <><stop offset="0" stopColor={a} /><stop offset=".5" stopColor={b} /><stop offset="1" stopColor={c} /></>
  return (
    <div className="blade">
      <div className="kb-row">
      <svg className="kb" viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} aria-hidden="true">
        <defs>
          <linearGradient id="kb-dark" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="620" y2="110">{stops('#F7E3AE', '#D9B46A', '#A9833F')}</linearGradient>
          <linearGradient id="kb-light" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="620" y2="110">{stops('#C29B55', '#A9823F', '#7A5A26')}</linearGradient>
        </defs>
        <g className="kb-bow">{BOW.map((p, i) => <polygon key={i} points={p} />)}</g>
        <g className="kb-shaft">{shaft.map(([x, y]) => <polygon key={`${x}-${y}`} points={dia(x, y)} style={{ '--i': (x - BAR.from) / P }} />)}</g>
        <g className="kb-teeth">{teeth.map(([x, y]) => <polygon key={`${x}-${y}`} points={dia(x, y)} style={{ '--i': 125 + (y - TOOTH_TOP) / P * 3 }} />)}</g>
      </svg>
        <div className="kb-vault"><small>Week 8</small><b>The Vault</b></div>
      </div>

      <div className="kb-labels">
        <div className="kb-l kb-end" style={{ left: pct(44) }}><small>Week 0</small><b>The locked box</b></div>
        {KEYS.map((k, i) => (
          <div className="kb-l" key={k.n} style={{ left: pct(TOOTH_X[i] + P / 2) }}>
            <span>{k.n}</span><b>{k.name.replace(' key', '')}</b><small>{k.week}</small>
          </div>
        ))}
      </div>
    </div>
  )
}
