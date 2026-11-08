import { KEYS } from '../content.js'
import { asset } from '../asset.js'

// The six stages drawn as the teeth of one long key: bow = the locked box, tip = the Vault.
export default function KeyBlade() {
  return (
    <div className="blade">
      <div className="blade-bow">
        <img className="k-dark" src={asset('/img/key-gold-dark.svg')} alt="" />
        <img className="k-light" src={asset('/img/key-gold.svg')} alt="" />
        <span>Week 0<br /><b>The locked box</b></span>
      </div>
      <div className="blade-shaft">
        <div className="blade-bar" />
        <div className="blade-teeth">
          {KEYS.map((k, i) => (
            <div className="tooth" key={k.n} style={{ '--h': `${(i + 2) * 14}px`, '--d': `${0.15 + i * 0.12}s` }}>
              <i />
              <span className="tooth-n">{k.n}</span>
              <b>{k.name.replace(' key', '')}</b>
              <small>{k.week}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="blade-tip"><span>Week 8<br /><b>The Vault</b></span></div>
    </div>
  )
}
