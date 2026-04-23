import { useNavigate } from 'react-router-dom'
import { specialSets } from '../data/eurekaSets'
import { getOwned, isFlagged } from '../data/userProgress'
import './SetDetail.css'
import './ThreeStarDetail.css'

const imgFallback = e => { e.currentTarget.onerror = null; e.currentTarget.src = e.currentTarget.src.replace('.webp', '.png') }

const COLOR_HEX = {
  Yellow: '#facc15', Green: '#4ade80', Red: '#f87171', Pink: '#f472b6',
  Blue: '#60a5fa', Purple: '#c084fc', White: '#f1f5f9',
}

function formatSource(source) {
  if (!source) return ''
  const limitedIcon = <img src="/icons/ui/limited.webp" alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={imgFallback} />
  const questIcon   = <img src="/icons/ui/quest.webp"   alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={imgFallback} />
  switch (source.type) {
    case 'event': return <>{limitedIcon} Limited Event (Patch {source.patch})</>
    case 'quest': return <>{questIcon} {source.name}</>
    default:      return ''
  }
}

function SlotTile({ setId, slot, color, owned, flagged, onToggle, onFlag }) {
  const src = `/icons/sets/${setId}-${color.toLowerCase()}-${slot.toLowerCase()}.webp`

  return (
    <div className="sd-tile-wrap">
      <button
        className={['sd-tile', owned ? 'sd-tile--owned' : ''].filter(Boolean).join(' ')}
        style={owned ? {} : { borderColor: COLOR_HEX[color] ?? '#888' }}
        onClick={onToggle}
        aria-pressed={owned}
        aria-label={`${slot} ${color}`}
      >
        <img
          className="sd-tile__img"
          src={src}
          alt={`${color} ${slot}`}
          onError={imgFallback}
        />
        <span
          className="sd-tile__color"
          style={{ color: owned ? '#6b7280' : (COLOR_HEX[color] ?? '#888') }}
        >{slot}</span>
      </button>
      <button
        className={`sd-tile__flag ${flagged ? 'sd-tile__flag--active' : ''}`}
        onClick={onFlag}
        aria-label={flagged ? `Unflag ${slot} ${color}` : `Flag ${slot} ${color}`}
        aria-pressed={flagged}
      >
        <img src="/icons/ui/flag.webp" alt="flag" style={{ height: '26px' }} onError={imgFallback} />
      </button>
    </div>
  )
}

function SetBlock({ set, progress, toggleOwned, flags, toggleFlagged }) {
  const color = set.colors[0]
  const ownedCount = set.slots.filter((slot) => getOwned(progress, set.id, color, slot)).length
  const done = ownedCount === set.slots.length

  return (
    <div className={`tsd-block ${done ? 'tsd-block--done' : ''}`}>
      <h3 className="tsd-block__name">{set.name}</h3>
      <p className="tsd-block__style">{set.style.join(' · ')} · {set.label}</p>
      <p className="tsd-block__source">{formatSource(set.source)}</p>
      <div className="sd-grid">
        {set.slots.map((slot) => (
          <SlotTile
            key={slot}
            setId={set.id}
            slot={slot}
            color={color}
            owned={getOwned(progress, set.id, color, slot)}
            flagged={isFlagged(flags ?? {}, set.id, color, slot)}
            onToggle={() => toggleOwned(set.id, color, slot)}
            onFlag={() => toggleFlagged(set.id, color, slot)}
          />
        ))}
      </div>
    </div>
  )
}

export default function SpecialDetail({ progress, toggleOwned, flags, toggleFlagged }) {
  const navigate = useNavigate()

  const totalVariants = specialSets.reduce((sum, set) => sum + set.colors.length * set.slots.length, 0)
  const ownedVariants = specialSets.reduce((sum, set) =>
    sum + set.colors.flatMap(color => set.slots.filter(slot => getOwned(progress, set.id, color, slot))).length, 0
  )

  const earnedDiamonds = specialSets.reduce((sum, set) => {
    const complete = set.slots.every((slot) => getOwned(progress, set.id, set.colors[0], slot))
    return sum + (complete ? set.diamondsPerColorSet : 0)
  }, 0)
  const totalDiamonds = specialSets.reduce((sum, set) => sum + set.diamondsPerColorSet, 0)

  return (
    <div className="tsd">
      <div className="tsd__header">
        <div className="tsd__header-row">
          <button className="tsd__back" onClick={() => navigate('/')}>
            <img src="/icons/ui/back.webp" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={imgFallback} />
            Special Eurekas
          </button>
          <span className="tsd__count">{ownedVariants} / {totalVariants} Variants</span>
        </div>
        <div className="tsd__meta">
          <span>
            <img src="/icons/ui/diamond.webp" alt="💎" style={{ height: '14px', verticalAlign: 'middle' }} onError={imgFallback} />
            {' '}{earnedDiamonds} / {totalDiamonds}
          </span>
        </div>
      </div>

      <div className="tsd__list">
        {specialSets.map((set) => (
          <SetBlock
            key={set.id}
            set={set}
            progress={progress}
            toggleOwned={toggleOwned}
            flags={flags}
            toggleFlagged={toggleFlagged}
          />
        ))}
      </div>
    </div>
  )
}
