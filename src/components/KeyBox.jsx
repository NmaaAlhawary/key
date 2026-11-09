import { useId } from 'react'
import StitchKey from './StitchKey.jsx'

// The locked box from Week 0: a dark chest with a gold tatreez band, drawn as an open box in
// oblique view. When it scrolls in the lid swings up, light spills out and the key rises.
const R = 3.2
const dia = (x, y, r = R) => `${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`

// Box geometry (viewBox 0 0 320 270): front face, right side, opening, lid.
const F = { x0: 34, x1: 246, y0: 160, y1: 250 }
const DX = 38, DY = -28
const opening = `${F.x0},${F.y0} ${F.x1},${F.y0} ${F.x1 + DX},${F.y0 + DY} ${F.x0 + DX},${F.y0 + DY}`
const side = `${F.x1},${F.y0} ${F.x1 + DX},${F.y0 + DY} ${F.x1 + DX},${F.y1 + DY} ${F.x1},${F.y1}`
const LID_H = 92, LID_LEAN = 14
const lid = `${F.x0 + DX},${F.y0 + DY} ${F.x1 + DX},${F.y0 + DY} ${F.x1 + DX + LID_LEAN},${F.y0 + DY - LID_H} ${F.x0 + DX + LID_LEAN},${F.y0 + DY - LID_H}`

// Stitches on the front: two bands of diamonds and a tatreez diamond round the keyhole.
const stitches = []
for (let x = F.x0 + 10; x <= F.x1 - 10; x += 8) { stitches.push([x, F.y0 + 11]); stitches.push([x, F.y1 - 11]) }
const cx = (F.x0 + F.x1) / 2, cy = (F.y0 + F.y1) / 2
for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
  const d = Math.abs(i) + Math.abs(j)
  if (d === 3) stitches.push([cx + i * 7, cy + j * 7])
}
for (const s of [-1, 1]) for (const k of [5, 8]) stitches.push([cx + s * k * 9, cy])

export default function KeyBox() {
  const id = useId().replace(/:/g, '')
  const u = n => `url(#${n}${id})`
  return (
    <div className="kbox" aria-hidden="true">
      <svg className="kbox-back" viewBox="0 0 320 270">
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7e3ae" /><stop offset=".5" stopColor="#d9b46a" /><stop offset="1" stopColor="#a9833f" />
          </linearGradient>
          <linearGradient id={`in${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" /><stop offset="1" stopColor="#2a2216" />
          </linearGradient>
          <linearGradient id={`lid${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#1c170f" /><stop offset="1" stopColor="#0b0907" />
          </linearGradient>
          <pattern id={`lat${id}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="5" fill="#d9b46a" />
          </pattern>
          <linearGradient id={`fade${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity=".75" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`m${id}`}><polygon points={lid} fill={u('fade')} /></mask>
        </defs>
        <g className="kbox-lid">
          <polygon points={lid} fill={u('lid')} stroke={u('g')} strokeWidth="1.6" strokeLinejoin="round" />
          <polygon points={lid} fill={u('lat')} mask={u('m')} opacity=".3" />
        </g>
        <polygon points={opening} fill={u('in')} stroke={u('g')} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <div className="kbox-beam" />
      <div className="kbox-mouth"><div className="kbox-key"><StitchKey teeth={6} size={250} animate={false} /></div></div>
      <svg className="kbox-front" viewBox="0 0 320 270">
        <defs>
          <linearGradient id={`fg${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f7e3ae" /><stop offset=".5" stopColor="#d9b46a" /><stop offset="1" stopColor="#a9833f" />
          </linearGradient>
          <linearGradient id={`body${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#221c13" /><stop offset="1" stopColor="#0c0a07" />
          </linearGradient>
        </defs>
        <polygon points={side} fill="#0a0806" stroke={u('fg')} strokeWidth="1.4" strokeLinejoin="round" />
        <rect x={F.x0} y={F.y0} width={F.x1 - F.x0} height={F.y1 - F.y0} rx="3" fill={u('body')} stroke={u('fg')} strokeWidth="1.8" />
        {stitches.map(([x, y], n) => <polygon key={n} points={dia(x, y)} fill={u('fg')} />)}
        <circle cx={cx} cy={cy - 3} r="4.2" fill="#050403" />
        <path d={`M${cx - 2.4} ${cy} L${cx + 2.4} ${cy} L${cx + 3.4} ${cy + 9} L${cx - 3.4} ${cy + 9} Z`} fill="#050403" />
        <circle cx={cx} cy={cy + 2} r="13" fill="none" stroke={u('fg')} strokeWidth="1.2" opacity=".7" />
      </svg>
    </div>
  )
}
