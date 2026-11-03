import { asset } from '../asset.js'

// Linen page header: title on the left, an optional framed photo postcard on the right, a stitch line below.
export default function PageHero({ img, title, text, side, credit, label }) {
  return (
    <section className="phero2">
      <div className="wrap phero2-in">
        <div className="phero2-text">
          {label && <div className="label red">{label}</div>}
          <h1>{title}</h1>
          {text && <p>{text}</p>}
          {side && <div className="phero2-side">{side}</div>}
        </div>
        {img && (
          <figure className="postcard tilt">
            <img src={asset(img)} alt="" />
            {credit && <figcaption>{credit}</figcaption>}
          </figure>
        )}
      </div>
      <div className="stitch-line" />
    </section>
  )
}
