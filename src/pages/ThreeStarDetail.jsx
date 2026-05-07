// import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { threeStarSets } from '../data/eurekaSets'
import { getOwned, isFlagged } from '../data/userProgress'
import './SetDetail.css'
import './ThreeStarDetail.css'


const COLOR_HEX = {
  Yellow: '#facc15', Green: '#4ade80', Red: '#f87171', Pink: '#f472b6',
  Blue: '#60a5fa', Purple: '#c084fc', White: '#f1f5f9',
}

/* ── Long-press helper ────────────────────────────────────────────────────────
function makeLongPress(callback, ms = 350) {
  let timer = null
  let fired = false
  return {
    onMouseDown:  () => { fired = false; timer = setTimeout(() => { fired = true; callback() }, ms) },
    onTouchStart: () => { fired = false; timer = setTimeout(() => { fired = true; callback() }, ms) },
    onTouchMove:  () => clearTimeout(timer),
    onMouseUp:    () => clearTimeout(timer),
    onMouseLeave: () => clearTimeout(timer),
    onTouchEnd:   () => clearTimeout(timer),
    onClick:      (e) => { if (fired) { fired = false; e.stopPropagation() } },
  }
}
*/

function SlotTile({ setId, slot, color, owned, flagged, onToggle, onFlag }) {
  const src = `/icons/sets/${setId}-${color.toLowerCase()}-${slot.toLowerCase()}.png`

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
          draggable={false}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/icons/ui/diamond.png' }}
          onContextMenu={e => e.preventDefault()}
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
        <img src="/icons/ui/flag.png" alt="flag" style={{ height: '26px' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/icons/ui/diamond.png' }} />
      </button>
    </div>
  )
}

function SetBlock({ set, progress, toggleOwned, flags, toggleFlagged }) {
  const color = set.colors[0]
  const ownedCount = set.slots.filter((slot) => getOwned(progress, set.id, color, slot)).length
  const done = ownedCount === set.slots.length

  /* function handleBlockLongPress() {
    const allOwned = set.slots.every(slot => getOwned(progress, set.id, color, slot))
    const target = !allOwned
    set.slots.forEach(slot => {
      if (getOwned(progress, set.id, color, slot) !== target) {
        toggleOwned(set.id, color, slot)
      }
    })
  } */

  return (
    <div className={`tsd-block ${done ? 'tsd-block--done' : ''}`}>
      <h3
        className="tsd-block__name"
        // {...makeLongPress(handleBlockLongPress)}
        // onContextMenu={e => e.preventDefault()}
      >{set.name}</h3>
      <p className="tsd-block__style">{set.style.join(' · ')} · {set.label}</p>
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

export default function ThreeStarDetail({ progress, toggleOwned, flags, toggleFlagged }) {
  const navigate = useNavigate()
  // const [showHelp, setShowHelp] = useState(false)

  const totalVariants = threeStarSets.reduce((sum, set) => sum + set.colors.length * set.slots.length, 0)
  const ownedVariants = threeStarSets.reduce((sum, set) =>
    sum + set.colors.flatMap(color => set.slots.filter(slot => getOwned(progress, set.id, color, slot))).length, 0
  )

  const earnedDiamonds = threeStarSets.reduce((sum, set) => {
    const complete = set.slots.every((slot) => getOwned(progress, set.id, set.colors[0], slot))
    return sum + (complete ? set.diamondsPerColorSet : 0)
  }, 0)
  const totalDiamonds = threeStarSets.reduce((sum, set) => sum + set.diamondsPerColorSet, 0)

  return (
    <div className="tsd">
      <div className="tsd__header">
        <div className="tsd__header-row">
          <button className="tsd__back" onClick={() => navigate('/')}>
            <img src="/icons/ui/back.png" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/icons/ui/diamond.png' }} />
            3★ Eurekas
          </button>
          <span className="tsd__count">{ownedVariants} / {totalVariants} Variants</span>
          {/* <button className="tsd__help" onClick={() => setShowHelp(true)} aria-label="Help">
            <img src="/icons/ui/help.png" alt="?" style={{ height: '20px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
          </button> */}
        </div>
        <div className="tsd__meta">
          <span>
            <img src="/icons/ui/dungeon.png" alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/icons/ui/diamond.png' }} />
            {' '}All Dungeons
          </span>
          <span>
            <img src="/icons/ui/diamond.png" alt="💎" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/icons/ui/diamond.png' }} />
            {' '}{earnedDiamonds} / {totalDiamonds}
          </span>
        </div>
      </div>

      <div className="tsd__list">
        {threeStarSets.map((set) => (
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

      {/* ── Help overlay ── (commented out)
      {showHelp && (
        <div className="sd-help-overlay" onClick={() => setShowHelp(false)}>
          <div className="sd-help-card" onClick={e => e.stopPropagation()}>
            <div className="sd-help-header">
              <span className="sd-help-title">Tips</span>
              <button className="sd-help-close" onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <ul className="sd-help-list">
              <li><strong>Long press</strong> a set name → mark all pieces of that set complete</li>
              <li><strong>Tap</strong> any tile → toggle single item</li>
              <li>Tap the <strong>flag icon</strong> → add to Next Up</li>
              <li style={{ color: '#9ca3af', fontStyle: 'italic' }}>Long press to mark all is an experimental feature and may behave inconsistently on some devices.</li>
            </ul>
          </div>
        </div>
      )}
      */}
    </div>
  )
}
