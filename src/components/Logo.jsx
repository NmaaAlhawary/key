import { asset } from '../asset.js'
// The KEYS lockup: the tatreez key (red cross-stitch diamonds, Jordan's seven-point star in the bow)
// beside the wide, thin wordmark. `dark` picks the version cut for dark backgrounds.
export function Wordmark({ height = 24 }) {
  return (
    <svg height={height} viewBox="-4 -4 352 108" role="img" aria-label="KEYS" style={{ display: 'block' }}>
      <g fill="none" stroke="currentColor" strokeWidth="6.2" strokeLinejoin="miter">
        <path d="M3 0V100" />
        <path d="M70 0 3 66" />
        <path d="M28 41 76 100" />
        <path d="M100 0V100M97 3H156M97 50H150M97 97H158" />
        <path d="M174 0 213 54M252 0 213 54M213 54V100" />
        <path d="M335 17C327 7 314 3 299 3C279 3 266 11 266 26C266 43 282 47 300 50C320 53 336 58 336 74C336 90 320 97 300 97C282 97 268 92 260 81" />
      </g>
    </svg>
  )
}

// `small` swaps to the square-stitch key, drawn for 32 to 64 px.
export function KeyMark({ height = 60, dark = false, small = false }) {
  const src = small ? '/img/key-small-gold.svg' : dark ? '/img/key-gold-dark.svg' : '/img/key-gold.svg'
  return <img src={asset(src)} alt="" aria-hidden="true" style={{ height, width: 'auto', display: 'block' }} />
}

export default function Logo({ height = 24, color = 'currentColor', dark = false, small = false, mark = true, className = '' }) {
  return (
    <span className={`logo ${className}`} style={{ color, gap: height * 0.55 }}>
      {mark && <KeyMark height={height * 1.9} dark={dark} small={small} />}
      <Wordmark height={height} />
    </span>
  )
}
