import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allSets } from '../data/eurekaSets'
import { getOwned } from '../data/userProgress'
import './NextUp.css'

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

function parseKey(key) {
  const parts = key.split(':')
  return { setId: parts[0], color: parts[1], slot: parts[2] }
}

function FlagCard({ flagKey, progress, toggleFlagged, toggleOwned, setFlagCategory, isSelected, onSelect, anySelected }) {
  const { setId, color, slot } = parseKey(flagKey)
  const set = allSets.find((s) => s.id === setId)
  if (!set) return null

  const source = formatSource(set.source)

  function pickCategory(catId, e) {
    e.stopPropagation()
    setFlagCategory(setId, color, slot, catId)
    onSelect(null)
  }

  return (
    <div className={`nu-card-wrap${anySelected && !isSelected ? ' nu-card-wrap--dimmed' : ''}`}>
      <div
        className={`nu-card${isSelected ? ' nu-card--selected' : ''}`}
        onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : flagKey) }}
      >
        <div className="nu-card__left">
          <span
            className="nu-card__dot"
            style={{ backgroundColor: COLOR_HEX[color] ?? '#888' }}
          />
          <div className="nu-card__info">
            <span className="nu-card__name">{set.name}</span>
            <span className="nu-card__detail">{color} · {slot}</span>
            {source && <span className="nu-card__source">{source}</span>}
          </div>
        </div>
        <div className="nu-card__actions">
          <button
            className="nu-card__check"
            onClick={(e) => { e.stopPropagation(); toggleOwned(setId, color, slot) }}
            aria-label={`Mark ${set.name} ${color} ${slot} as owned`}
          >
            ✓
          </button>
          <button
            className="nu-card__remove"
            onClick={(e) => { e.stopPropagation(); toggleFlagged(setId, color, slot) }}
            aria-label={`Remove ${set.name} ${color} ${slot} from Next Up`}
          >
            <img src="/icons/ui/flag.png" alt="remove" style={{ height: '16px', opacity: 0.6 }} onError={e => { e.currentTarget.style.display = 'none' }} />
          </button>
        </div>
      </div>

      {isSelected && (
        <div className="nu-picker" onClick={(e) => e.stopPropagation()}>
          {SECTIONS.map((s) => (
            <button
              key={String(s.id)}
              className="nu-picker__btn"
              onClick={(e) => pickCategory(s.id, e)}
            >
              <img
                src={`${s.icon}.png`}
                alt=""
                style={{ height: '14px' }}
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({ section, items, progress, toggleFlagged, toggleOwned, setFlagCategory, selectedKey, setSelectedKey }) {
  return (
    <div className="nu-section">
      <h3 className="nu-section__title">
        <img
          src={`${section.icon}.png`}
          alt={section.label}
          style={{ height: '20px', verticalAlign: 'middle' }}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
        {' '}{section.label}
        <span className="nu-section__count">{items.length}</span>
      </h3>

      {items.length === 0 && (
        <p className="nu-section__empty">No items</p>
      )}

      <div className="nu-section__items">
        {items.map((key) => (
          <FlagCard
            key={key}
            flagKey={key}
            progress={progress}
            toggleFlagged={toggleFlagged}
            toggleOwned={toggleOwned}
            setFlagCategory={setFlagCategory}
            isSelected={selectedKey === key}
            onSelect={setSelectedKey}
            anySelected={selectedKey !== null}
          />
        ))}
      </div>
    </div>
  )
}

export default function NextUp({ progress, flags, toggleFlagged, toggleOwned, setFlagCategory }) {
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState(null)

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

  return (
    <div className="nextup" onClick={() => setSelectedKey(null)}>
      <div className="nextup__header">
        <button className="nextup__back" onClick={() => navigate('/')}>
          <img src="/icons/ui/back.png" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
          Next Up
        </button>
        <span className="nextup__count">{totalFlagged} flagged</span>
      </div>

      {totalFlagged === 0 && (
        <p className="nextup__empty-state">
          Tap{' '}
          <img src="/icons/ui/flag.png" alt="flag" style={{ height: '14px', verticalAlign: 'middle' }} onError={e => { e.currentTarget.style.display = 'none' }} />
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
            toggleFlagged={toggleFlagged}
            toggleOwned={toggleOwned}
            setFlagCategory={setFlagCategory}
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
          />
        ))}
      </div>
    </div>
  )
}
