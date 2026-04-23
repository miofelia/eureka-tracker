import { useNavigate } from 'react-router-dom'
import { getOwned } from '../data/userProgress'
import './SetGrid.css'

const imgFallback = e => {
  const el = e.currentTarget
  el.onerror = null
  if (el.src.includes('.webp')) {
    el.src = el.src.replace('.webp', '.png')
    el.onerror = e2 => { e2.currentTarget.onerror = null; e2.currentTarget.src = '/icons/ui/diamond.png' }
  } else {
    el.src = '/icons/ui/diamond.png'
  }
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
          <img
            key={slot}
            src={`/icons/sets/${set.id}-${firstColor.toLowerCase()}-${slot.toLowerCase()}.webp`}
            alt={slot}
            onError={imgFallback}
          />
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
          <img src="/icons/ui/back.webp" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={imgFallback} />
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

