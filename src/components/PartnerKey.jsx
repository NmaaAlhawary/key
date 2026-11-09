import { useId } from 'react'

// Stitched-diamond marks for the supporter tiles, drawn on the logo's 8-unit grid.
// Each '#' is one stitch.
const MARKS = {
  // crowned ring key with a long toothed blade
  master: [
    '#.#.#..............',
    '#####..............',
    '.###...............',
    '#####..............',
    '##.################',
    '##.################',
    '#####....##..##..##',
    '.###.....##..##..##',
    '.........##.......',
  ],
  // heart-bow key: the one you hand to someone you trust
  spare: [
    '.##.##.............',
    '#######............',
    '#######............',
    '###################',
    '###################',
    '.#####......##..##.',
    '..###.......##.....',
    '...#...............',
  ],
  // keyhole: the locksmith makes the lock and the key fit
  locksmith: [
    '..###..',
    '.#####.',
    '#######',
    '#######',
    '.#####.',
    '..###..',
    '.#####.',
    '.#####.',
    '#######',
  ],
  // padlock: bring the lock, teams bring the keys
  lock: [
    '..###..',
    '.#...#.',
    '.#...#.',
    '#######',
    '#######',
    '###.###',
    '###.###',
    '#######',
    '#######',
  ],
}

const P = 8, R = 4.4

export default function PartnerKey({ kind = 'master', height = 54, color, className = '' }) {
  const id = useId().replace(/:/g, '')
  const rows = MARKS[kind]
  const w = Math.max(...rows.map(r => r.length)) * P, h = rows.length * P
  const fill = color || `url(#pk${id})`
  const cells = []
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    if (c !== '#') return
    const cx = x * P + P / 2, cy = y * P + P / 2
    cells.push(`${cx},${cy - R} ${cx + R},${cy} ${cx},${cy + R} ${cx - R},${cy}`)
  }))
  return (
    <svg className={`skey pkey ${className}`} height={height} width={height * w / h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {!color && (
        <defs>
          <linearGradient id={`pk${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
            <stop offset="0" className="skey-a" /><stop offset=".5" className="skey-b" /><stop offset="1" className="skey-c" />
          </linearGradient>
        </defs>
      )}
      {cells.map((p, n) => <polygon key={n} points={p} fill={fill} />)}
    </svg>
  )
}
