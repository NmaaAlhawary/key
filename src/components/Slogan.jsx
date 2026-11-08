// The KEYS slogan, with a gold stitch diamond between each part.
export const SLOGAN = ['Eight weeks.', 'Six keys.', 'One Vault.']

export default function Slogan({ className = '' }) {
  return (
    <p className={`slogan ${className}`} aria-label={SLOGAN.join(' ')}>
      {SLOGAN.map((s, i) => <span key={s}>{i > 0 && <i aria-hidden="true" />}{s}</span>)}
    </p>
  )
}
