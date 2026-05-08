import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOwned } from '../data/userProgress'
import { DUNGEON_ORDER } from '../data/eurekaSets'
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
  const [sortMode, setSortMode] = useState('ingame')
  const [azDir, setAzDir]       = useState('asc')

  const hasDungeon = sets.some(s => s.source?.dungeonId)

  function handleAzClick() {
    if (sortMode === 'az') {
      setAzDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortMode('az')
      setAzDir('asc')
    }
  }

  function getSortedSets() {
    if (sortMode === 'ingame') return sets
    if (sortMode === 'az') {
      const sorted = [...sets].sort((a, b) => a.name.localeCompare(b.name))
      return azDir === 'asc' ? sorted : sorted.reverse()
    }
    if (sortMode === 'dungeon') {
      return [...sets].sort((a, b) => {
        const idA = a.source?.dungeonId ?? ''
        const idB = b.source?.dungeonId ?? ''
        const lastA = idA.lastIndexOf('-')
        const lastB = idB.lastIndexOf('-')
        const prefixA = idA.slice(0, lastA)
        const prefixB = idB.slice(0, lastB)
        const orderA = DUNGEON_ORDER.indexOf(prefixA)
        const orderB = DUNGEON_ORDER.indexOf(prefixB)
        if (orderA !== orderB) return orderA - orderB
        return parseInt(idA.slice(lastA + 1)) - parseInt(idB.slice(lastB + 1))
      })
    }
    return sets
  }

  const sortedSets = getSortedSets()

  return (
    <div className="setgrid">
      <div className="setgrid__header">
        <button className="setgrid__back" onClick={() => navigate('/')}>
          <img src="/icons/ui/back.png" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/icons/ui/diamond.png' }} />
          {title}
        </button>
        <div className="sg-sort">
          <button
            className={`sg-chip ${sortMode === 'ingame' ? 'sg-chip--active' : ''}`}
            onClick={() => setSortMode('ingame')}
          >Ingame</button>
          <button
            className={`sg-chip ${sortMode === 'az' ? 'sg-chip--active' : ''}`}
            onClick={handleAzClick}
          >A–Z{sortMode === 'az' ? (azDir === 'asc' ? ' ↑' : ' ↓') : ''}</button>
          {hasDungeon && (
            <button
              className={`sg-chip ${sortMode === 'dungeon' ? 'sg-chip--active' : ''}`}
              onClick={() => setSortMode('dungeon')}
            >By Dungeon</button>
          )}
        </div>
      </div>
      <div className="setgrid__grid">
        {sortedSets.map((set) => (
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

