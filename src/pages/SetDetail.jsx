import { useState } from 'react'
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

// ── Long-press helper ─────────────────────────────────────────────────────────
// Returns event handlers that call callback after ms of uninterrupted hold.
// Tracks whether it fired so the subsequent click can be swallowed.
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

function GridTile({ set, slot, color, owned, flagged, onToggle, onFlag, onColorLongPress }) {
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
          draggable={false}
          onError={e => { e.currentTarget.style.display = 'none' }}
          onContextMenu={e => e.preventDefault()}
        />
        <span
          className="sd-tile__color"
          style={{ color: owned ? '#6b7280' : color === 'Iridescent' ? '#f1f5f9' : (COLOR_HEX[color] ?? '#888') }}
          {...makeLongPress(onColorLongPress)}
          onContextMenu={e => e.preventDefault()}
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
  const [showHelp, setShowHelp] = useState(false)

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

  // ── Batch-toggle handlers ─────────────────────────────────────────────────
  function handleSlotLongPress(slot) {
    const allOwned = set.colors.every(color => getOwned(progress, set.id, color, slot))
    const target = !allOwned
    set.colors.forEach(color => {
      if (getOwned(progress, set.id, color, slot) !== target) {
        toggleOwned(set.id, color, slot)
      }
    })
  }

  function handleColorLongPress(color) {
    const allOwned = set.slots.every(slot => getOwned(progress, set.id, color, slot))
    const target = !allOwned
    set.slots.forEach(slot => {
      if (getOwned(progress, set.id, color, slot) !== target) {
        toggleOwned(set.id, color, slot)
      }
    })
  }

  return (
    <div className="setdetail">
      <div className="setdetail__header">
        <div className="setdetail__header-row">
          <button className="setdetail__back" onClick={() => navigate(-1)}>
            <img src="/icons/ui/back.png" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
            {set.name}
          </button>
          <button className="setdetail__help" onClick={() => setShowHelp(true)} aria-label="Help">
            <img src="/icons/ui/help.png" alt="?" style={{ height: '20px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
          </button>
        </div>
        <p className="setdetail__meta">
          {set.style.join(' · ')} · {set.label} · {formatSource(set.source)}
        </p>
        <div className="setdetail__stats">
          <span>
            <img src="/icons/ui/variants.png" alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.style.display = 'none' }} />
            {' '}{ownedVariants} / {totalVariants} Variants
          </span>
          <span>
            <img src="/icons/ui/diamond.png" alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.style.display = 'none' }} />
            {' '}{earnedDiamonds} / {totalDiamonds}
          </span>
        </div>
      </div>

      {/* ── Slot header: long-press to batch-toggle a column ── */}
      <div className="sd-grid sd-grid--header">
        {set.slots.map((slot) => (
          <button
            key={slot}
            className="sd-col-label"
            {...makeLongPress(() => handleSlotLongPress(slot))}
            onContextMenu={e => e.preventDefault()}
            aria-label={`Long press to toggle all ${slot}`}
          >
            <img
              src={`/icons/ui/${SLOT_ICON[slot]}.png`}
              alt={slot}
              style={{ height: '20px' }}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          </button>
        ))}
      </div>

      {/* ── Tile grid ── */}
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
              onColorLongPress={() => handleColorLongPress(color)}
            />
          ))
        )}
      </div>

      {/* ── Help overlay ── */}
      {showHelp && (
        <div className="sd-help-overlay" onClick={() => setShowHelp(false)}>
          <div className="sd-help-card" onClick={e => e.stopPropagation()}>
            <div className="sd-help-header">
              <span className="sd-help-title">Tips</span>
              <button className="sd-help-close" onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <ul className="sd-help-list">
              <li><strong>Long press</strong> a slot icon (top) → mark all of that slot complete</li>
              <li><strong>Long press</strong> a color row → mark all of that color complete</li>
              <li><strong>Tap</strong> any tile → toggle single item</li>
              <li>Tap the <strong>flag icon</strong> → add to Next Up</li>
              <li style={{ color: '#9ca3af', fontStyle: 'italic' }}>Long press to mark all is an experimental feature and may behave inconsistently on some devices.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
