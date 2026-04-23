import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allSets } from '../data/eurekaSets'
import { getOwned } from '../data/userProgress'
import './NextUp.css'

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

const COLOR_HEX = {
  Yellow: '#facc15', Green: '#4ade80', Red: '#f87171', Pink: '#f472b6',
  Blue: '#60a5fa', Purple: '#c084fc', White: '#f1f5f9', Iridescent: '#c084fc',
}

const SECTIONS = [
  { id: null,    label: 'Unsorted', icon: '/icons/ui/unsorted' },
  { id: 'farm',  label: 'Farm',     icon: '/icons/ui/farm'     },
  { id: 'level', label: 'Level',    icon: '/icons/ui/level'    },
]

function formatSource(source) {
  if (!source) return null
  const dng = <img src="/icons/ui/dungeon.webp" alt="" style={{ height: '14px', verticalAlign: 'middle' }} onError={imgFallback} />
  switch (source.type) {
    case 'dungeon': return <>{dng} {source.name}</>
    case 'all':     return <>{dng} All Dungeons</>
    case 'quest':   return `📜 ${source.name}`
    case 'event':   return `⭐ Limited Event (Patch ${source.patch})`
    default:        return null
  }
}

function parseKey(key) {
  const parts = key.split(':')
  return { setId: parts[0], color: parts[1], slot: parts[2] }
}

function FlagCard({ flagKey, progress, toggleFlagged, toggleOwned, onDragStart }) {
  const { setId, color, slot } = parseKey(flagKey)
  const set = allSets.find((s) => s.id === setId)
  if (!set) return null

  const source = formatSource(set.source)

  return (
    <div
      className="nu-card"
      draggable
      onDragStart={onDragStart}
    >
      <div className="nu-card__left">
        <span
          className="nu-card__dot"
          style={{ backgroundColor: COLOR_HEX[color] ?? '#888' }}
        />
        <div className="nu-card__info">
          <span className="nu-card__name">{set.name}</span>
          <span className="nu-card__detail">
            {color} · {slot}
          </span>
          {source && (
            <span className="nu-card__source">{source}</span>
          )}
        </div>
      </div>
      <div className="nu-card__actions">
        <button
          className="nu-card__check"
          onClick={() => toggleOwned(setId, color, slot)}
          aria-label={`Mark ${set.name} ${color} ${slot} as owned`}
        >
          ✓
        </button>
        <button
          className="nu-card__remove"
          onClick={() => toggleFlagged(setId, color, slot)}
          aria-label={`Remove ${set.name} ${color} ${slot} from Next Up`}
        >
          <img src="/icons/ui/flag.webp" alt="remove" style={{ height: '16px', opacity: 0.6 }} onError={imgFallback} />
        </button>
      </div>
    </div>
  )
}

function Section({ section, items, progress, flags, toggleFlagged, toggleOwned, setFlagCategory, dragOver, onDragOver, onDragLeave, onDrop }) {
  return (
    <div
      className={`nu-section ${dragOver ? 'nu-section--drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <h3 className="nu-section__title">
        <img
          src={`${section.icon}.webp`}
          alt={section.label}
          style={{ height: '20px', verticalAlign: 'middle' }}
          onError={imgFallback}
        />
        {' '}{section.label}
        <span className="nu-section__count">{items.length}</span>
      </h3>

      {items.length === 0 && (
        <p className="nu-section__empty">Drop items here</p>
      )}

      <div className="nu-section__items">
        {items.map((key) => (
          <FlagCard
            key={key}
            flagKey={key}
            progress={progress}
            toggleFlagged={toggleFlagged}
            toggleOwned={toggleOwned}
            onDragStart={(e) => e.dataTransfer.setData('text/plain', key)}
          />
        ))}
      </div>
    </div>
  )
}

export default function NextUp({ progress, flags, toggleFlagged, toggleOwned, setFlagCategory }) {
  const navigate = useNavigate()
  const [dragOver, setDragOver] = useState(null)

  const activeFlagKeys = Object.keys(flags ?? {}).filter((key) => {
    const { setId, color, slot } = parseKey(key)
    return !getOwned(progress, setId, color, slot)
  })

  const totalFlagged = activeFlagKeys.length

  function itemsForSection(sectionId) {
    return activeFlagKeys.filter((key) => {
      const entry = flags[key]
      return (entry?.category ?? null) === sectionId
    })
  }

  function handleDrop(e, sectionId) {
    e.preventDefault()
    setDragOver(null)
    const key = e.dataTransfer.getData('text/plain')
    if (!key) return
    const { setId, color, slot } = parseKey(key)
    setFlagCategory(setId, color, slot, sectionId)
  }

  return (
    <div className="nextup">
      <div className="nextup__header">
        <button className="nextup__back" onClick={() => navigate('/')}>
          <img src="/icons/ui/back.webp" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={imgFallback} />
          Next Up
        </button>
        <span className="nextup__count">{totalFlagged} flagged</span>
      </div>

      {totalFlagged === 0 && (
        <p className="nextup__empty-state">
          Tap{' '}
          <img src="/icons/ui/flag.webp" alt="flag" style={{ height: '14px', verticalAlign: 'middle' }} onError={imgFallback} />
          {' '}on any Eureka in SetDetail to add it here.
        </p>
      )}

      <div className="nextup__sections">
        {SECTIONS.map((section) => (
          <Section
            key={String(section.id)}
            section={section}
            items={itemsForSection(section.id)}
            progress={progress}
            flags={flags}
            toggleFlagged={toggleFlagged}
            toggleOwned={toggleOwned}
            setFlagCategory={setFlagCategory}
            dragOver={dragOver === String(section.id)}
            onDragOver={(e) => { e.preventDefault(); setDragOver(String(section.id)) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => handleDrop(e, section.id)}
          />
        ))}
      </div>
    </div>
  )
}
