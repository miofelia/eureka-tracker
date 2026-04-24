import { useNavigate, useParams } from 'react-router-dom'
import { allSets } from '../data/eurekaSets'
import { getOwned, isFlagged } from '../data/userProgress'
import './SetDetail.css'


const SLOT_ICON = { Head: 'head', Hands: 'hand', Feet: 'feet' }

const COLOR_HEX = {
  Yellow: '#facc15', Green: '#4ade80', Red: '#f87171', Pink: '#f472b6',
  Blue: '#60a5fa', Purple: '#c084fc', White: '#f1f5f9', Iridescent: null,
}

function formatSource(source) {
  if (!source) return null
  const dng = <img src="/icons/ui/dungeon.png" alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.style.display = 'none' }} />
  const lmt = <img src="/icons/ui/limited.png" alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.style.display = 'none' }} />
  const qst = <img src="/icons/ui/quest.png" alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.style.display = 'none' }} />
  switch (source.type) {
    case 'dungeon': return <>{dng} {source.name}</>
    case 'all':     return <>{dng} All Dungeons</>
    case 'quest':   return <>{qst} {source.name}</>
    case 'event':   return <>{lmt} Limited Event (Patch {source.patch})</>
    default:        return null
  }
}

function tileStyle(color, owned) {
  if (owned) return {}
  if (color === 'Iridescent') return {}
  return { borderColor: COLOR_HEX[color] ?? '#888' }
}

function GridTile({ set, slot, color, owned, flagged, onToggle, onFlag }) {
  const src = `/icons/sets/${set.id}-${color.toLowerCase()}-${slot.toLowerCase()}.png`

  return (
    <div className="sd-tile-wrap">
      <button
        className={[
          'sd-tile',
          owned                            ? 'sd-tile--owned'      : '',
          color === 'Iridescent' && !owned ? 'sd-tile--iridescent' : '',
        ].filter(Boolean).join(' ')}
        style={tileStyle(color, owned)}
        onClick={onToggle}
        aria-pressed={owned}
        aria-label={`${slot} ${color}`}
      >
        <img
          className="sd-tile__img"
          src={src}
          alt={`${color} ${slot}`}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        <span
          className="sd-tile__color"
          style={{ color: owned ? '#6b7280' : color === 'Iridescent' ? '#f1f5f9' : (COLOR_HEX[color] ?? '#888') }}
        >{color}</span>
      </button>

      <button
        className={`sd-tile__flag ${flagged ? 'sd-tile__flag--active' : ''}`}
        onClick={onFlag}
        aria-label={flagged ? `Unflag ${slot} ${color}` : `Flag ${slot} ${color}`}
        aria-pressed={flagged}
      >
        <img src="/icons/ui/flag.png" alt="flag" style={{ height: '26px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
      </button>
    </div>
  )
}

export default function SetDetail({ progress, toggleOwned, flags, toggleFlagged }) {
  const { setId } = useParams()
  const navigate  = useNavigate()

  const set = allSets.find((s) => s.id === setId)

  if (!set) {
    return (
      <div className="setdetail">
        <button className="setdetail__back" onClick={() => navigate(-1)}>
          <img src="/icons/ui/back.png" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={e => { e.currentTarget.style.display = 'none' }}/>
          back
        </button>
        <p style={{ color: '#a78bfa' }}>Set not found.</p>
      </div>
    )
  }

  const totalVariants = set.colors.length * set.slots.length
  const ownedVariants = set.colors.reduce((sum, color) =>
    sum + set.slots.filter((slot) => getOwned(progress, set.id, color, slot)).length, 0
  )
  const completeColorSets = set.colors.filter((color) =>
    set.slots.every((slot) => getOwned(progress, set.id, color, slot))
  ).length
  const earnedDiamonds = completeColorSets * set.diamondsPerColorSet
  const totalDiamonds  = set.colors.length  * set.diamondsPerColorSet

  return (
    <div className="setdetail">
      <div className="setdetail__header">
        <button className="setdetail__back" onClick={() => navigate(-1)}>
          <img src="/icons/ui/back.png" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
          {set.name}
        </button>
        <p className="setdetail__meta">
          {set.style.join(' · ')} · {set.label} · {formatSource(set.source)}
        </p>
        <div className="setdetail__stats">
          <span>{ownedVariants} / {totalVariants} Variants</span>
          <span>
            <img src="/icons/ui/diamond.png" alt="💎" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.style.display = 'none' }} />
            {' '}{earnedDiamonds} / {totalDiamonds}
          </span>
        </div>
      </div>

      <div className="sd-grid sd-grid--header">
        {set.slots.map((slot) => (
          <div key={slot} className="sd-col-label">
            <img
              src={`/icons/ui/${SLOT_ICON[slot]}.png`}
              alt={slot}
              style={{ height: '20px' }}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        ))}
      </div>

      <div className="sd-grid">
        {set.colors.map((color) =>
          set.slots.map((slot) => (
            <GridTile
              key={`${color}-${slot}`}
              set={set}
              slot={slot}
              color={color}
              owned={getOwned(progress, set.id, color, slot)}
              flagged={isFlagged(flags ?? {}, set.id, color, slot)}
              onToggle={() => toggleOwned(set.id, color, slot)}
              onFlag={() => toggleFlagged(set.id, color, slot)}
            />
          ))
        )}
      </div>
    </div>
  )
}
