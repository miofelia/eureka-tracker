import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOwned } from '../data/userProgress'
import './SetGrid.css'


const COLOR_MAP = {
  Yellow: '#facc15', Green: '#4ade80', Red: '#f87171', Pink: '#f472b6',
  Blue: '#60a5fa', Purple: '#c084fc', White: '#f1f5f9', Iridescent: '#e879f9',
}

function SlotIcon({ setId, color, slot }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div style={{
        width: '32px', height: '32px',
        borderRadius: '50%',
        background: COLOR_MAP[color] ?? '#888',
        flexShrink: 0,
      }} />
    )
  }
  return (
    <img
      src={`/icons/sets/${setId}-${color.toLowerCase()}-${slot.toLowerCase()}.png`}
      alt={slot}
      onError={() => setFailed(true)}
    />
  )
}

function countOwnedVariants(set, progress) {
  let owned = 0
  const total = set.colors.length * set.slots.length
  for (const color of set.colors) {
    for (const slot of set.slots) {
      if (getOwned(progress, set.id, color, slot)) owned++
    }
  }
  return { owned, total }
}

function SetTile({ set, progress, onClick }) {
  const { owned, total } = countOwnedVariants(set, progress)
  const done = owned === total
  const firstColor = set.colors[0]

  return (
    <button className={`set-tile ${done ? 'set-tile--done' : ''}`} onClick={onClick}>
      <div className="set-tile__icons">
        {set.slots.map((slot) => (
          <SlotIcon key={slot} setId={set.id} color={firstColor} slot={slot} />
        ))}
      </div>
      <span className="set-tile__name">{set.name}</span>
      <span className="set-tile__progress">{owned} / {total}</span>
      {set.obtainable === false && (
        <span className="set-tile__locked">🔒 Not obtainable</span>
      )}
    </button>
  )
}

export default function SetGrid({ sets, title, basePath, progress }) {
  const navigate = useNavigate()

  return (
    <div className="setgrid">
      <div className="setgrid__header">
        <button className="setgrid__back" onClick={() => navigate('/')}>
          <img src="/icons/ui/back.png" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/icons/ui/diamond.png' }} />
          {title}
        </button>
      </div>
      <div className="setgrid__grid">
        {sets.map((set) => (
          <SetTile
            key={set.id}
            set={set}
            progress={progress}
            onClick={() => navigate(`${basePath}/${set.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

