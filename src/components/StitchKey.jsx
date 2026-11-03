// A small stitched key in the tatreez style: diamond bow, a shaft, and `teeth` rising teeth.
// Stage n of six gets n teeth, so the six cards read as one growing key.
export default function StitchKey({ teeth = 1, size = 150, color = 'var(--red)', dim = 'rgba(255,255,255,.08)', animate = true }) {
  const u = 8, cells = []
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (Math.abs(i) + Math.abs(j) === 2 || (Math.abs(i) + Math.abs(j) === 1)) cells.push([i + 2, j + 2, Math.abs(i) + Math.abs(j) === 1 ? 'in' : 'ring'])
  for (let x = 5; x < 18; x++) cells.push([x, 2, 'shaft'])
  for (let k = 0; k < 6; k++) for (let d = 1; d <= 1 + Math.floor(k / 2); d++) cells.push([7 + k * 2, 2 + d, k < teeth ? 'tooth' : 'ghost'])
  return (
    <svg className={animate ? 'stitch-anim' : ''} width={size} height={size * 0.36} viewBox="-6 -6 152 54" aria-hidden="true">
      {cells.map(([x, y, t], n) => {
        const cx = x * u, cy = y * u, h = t === 'in' ? u * 0.38 : u * 0.6
        return <polygon key={n} points={`${cx},${cy - h} ${cx + h},${cy} ${cx},${cy + h} ${cx - h},${cy}`} fill={t === 'ghost' ? dim : color} style={{ '--i': n, '--o': t === 'in' ? 0.55 : 1 }} />
      })}
    </svg>
  )
}
