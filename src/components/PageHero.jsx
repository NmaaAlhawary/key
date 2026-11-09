import { asset } from '../asset.js'
import Logo from './Logo.jsx'

// Page header: full-bleed photo, a glass caption box bottom-left, optional pill on the right, then a stitch line.
export default function PageHero({ img, title, text, side, credit, logo }) {
  return (
    <>
      <section className={`phero ${img ? '' : 'art'}`}>
        {img && <img src={asset(img)} alt="" />}
        {logo && <div className="phero-logo"><Logo height={92} dark color="#f3e6c4" /></div>}
        <div className="hero-box">
          <h1>{title}</h1>
          {text && <p>{text}</p>}
        </div>
        {side && <div className="hero-side">{side}</div>}
        {credit && <small className="credit">{credit}</small>}
      </section>
    </>
  )
}
