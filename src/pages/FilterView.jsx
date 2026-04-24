import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allSets } from '../data/eurekaSets'
import { getOwned, isFlagged } from '../data/userProgress'
import './SetDetail.css'
import './FilterView.css'


// ── Konstanten ────────────────────────────────────────────────────────────────

const COLOR_HEX = {
  Yellow: '#facc15', Green: '#4ade80', Red: '#f87171', Pink: '#f472b6',
  Blue: '#60a5fa', Purple: '#c084fc', White: '#f1f5f9', Iridescent: null,
}

function firstColorStyle(set) {
  const c = set.colors[0]
  if (c === 'Iridescent')
    return { background: 'conic-gradient(#f472b6, #60a5fa, #4ade80, #facc15, #f472b6)' }
  return { backgroundColor: COLOR_HEX[c] ?? '#888' }
}

function starLabel(set) {
  return set.special ? 'Special' : `${set.stars}★`
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
function setPath(set) {
  if (set.special)     return '/sets/special'
  if (set.stars === 3) return '/sets/3'
  return `/sets/${set.stars}/${set.id}`
}

// ── Filter-Logik ──────────────────────────────────────────────────────────────

function matchesSetFilter(set, fs) {
  if (fs.stars.length > 0) {
    const key = set.special ? 'special' : String(set.stars)
    if (!fs.stars.includes(key)) return false
  }
  if (fs.style.length > 0  && !set.style.some(s => fs.style.includes(s)))   return false
  if (fs.label.length > 0  && !fs.label.includes(set.label))   return false
  if (fs.dungeon.length > 0) {
    const name = set.source?.type === 'dungeon' ? set.source.name : null
    if (!name || !fs.dungeon.includes(name)) return false
  }
  return true
}

function colorMissing(set, color, progress) {
  return set.slots.filter(slot => !getOwned(progress, set.id, color, slot)).length
}

// ── Overlay-Bausteine ─────────────────────────────────────────────────────────

function Chip({ label, active, onToggle }) {
  return (
    <button className={`fv-chip ${active ? 'fv-chip--active' : ''}`} onClick={onToggle}>
      {label}
    </button>
  )
}

function RadioOption({ label, value, current, onSelect }) {
  return (
    <button
      className={`fv-radio ${current === value ? 'fv-radio--active' : ''}`}
      onClick={() => onSelect(value)}
    >
      {label}
    </button>
  )
}

// ── Modus A: Set-Kachel ───────────────────────────────────────────────────────

function SetTileA({ set, progress, onClick }) {
  const total = set.colors.length * set.slots.length
  const owned = set.colors.reduce((sum, color) =>
    sum + set.slots.filter(slot => getOwned(progress, set.id, color, slot)).length, 0
  )
  const done = owned === total
  const firstColor = set.colors[0]

  return (
    <button className={`fv-set-tile ${done ? 'fv-set-tile--done' : ''}`} onClick={onClick}>
      <div className="fv-set-tile__top">
        <div className="fv-set-tile__icons">
          {set.slots.map(slot => (
            <img
              key={slot}
              src={`/icons/sets/${set.id}-${firstColor.toLowerCase()}-${slot.toLowerCase()}.png`}
              alt={slot}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          ))}
        </div>
        <span className="fv-set-tile__star">{starLabel(set)}</span>
      </div>
      <span className="fv-set-tile__name">{set.name}</span>
      <span className="fv-set-tile__progress">{owned} / {total}</span>
    </button>
  )
}

// ── Modus B: Slot-Kachel ─────────────────────────────────────────────────────

function SlotTileB({ set, color, slot, progress, toggleOwned, flags, toggleFlagged }) {
  const owned   = getOwned(progress, set.id, color, slot)
  const flagged = isFlagged(flags ?? {}, set.id, color, slot)
  const src = `/icons/sets/${set.id}-${color.toLowerCase()}-${slot.toLowerCase()}.png`

  return (
    <div className="sd-tile-wrap">
      <button
        className={[
          'sd-tile',
          owned                            ? 'sd-tile--owned'      : '',
          color === 'Iridescent' && !owned ? 'sd-tile--iridescent' : '',
        ].filter(Boolean).join(' ')}
        style={owned || color === 'Iridescent' ? {} : { borderColor: COLOR_HEX[color] ?? '#888' }}
        onClick={() => toggleOwned(set.id, color, slot)}
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
        >{slot}</span>
      </button>
      <button
        className={`sd-tile__flag ${flagged ? 'sd-tile__flag--active' : ''}`}
        onClick={() => toggleFlagged(set.id, color, slot)}
        aria-pressed={flagged}
        aria-label={flagged ? `Unflag ${slot}` : `Flag ${slot}`}
      >
        <img src="/icons/ui/flag.png" alt="flag" style={{ height: '26px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
      </button>
    </div>
  )
}

// ── Modus B: Farb-Reihe ───────────────────────────────────────────────────────

function ColorRow({ set, color, progress, toggleOwned, flags, toggleFlagged }) {
  return (
    <div className="fv-color-row">
      <div className="fv-color-row__label">
        <span
          className="fv-color-dot"
          style={{ backgroundColor: COLOR_HEX[color] ?? '#c084fc' }}
        />
        <span className="fv-color-name">{color}</span>
      </div>
      <div className="sd-grid">
        {set.slots.map(slot => (
          <SlotTileB
            key={slot}
            set={set} color={color} slot={slot}
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

// ── Modus B: Set-Block ────────────────────────────────────────────────────────

function SetBlockB({ set, colors, progress, toggleOwned, flags, toggleFlagged }) {
  const source = formatSource(set.source)
  return (
    <div className="fv-block">
      <div className="fv-block__header">
        <div className="fv-block__info">
          <span className="fv-block__name">{set.name}</span>
          {source && <span className="fv-block__source">{source}</span>}
        </div>
        <span className="fv-block__star">{starLabel(set)}</span>
      </div>
      {colors.map(color => (
        <ColorRow
          key={color}
          set={set} color={color}
          progress={progress}
          toggleOwned={toggleOwned}
          flags={flags}
          toggleFlagged={toggleFlagged}
        />
      ))}
    </div>
  )
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────

export default function FilterView({
  filterState, setFilterState,
  progress, toggleOwned, flags, toggleFlagged,
}) {
  const navigate = useNavigate()
  const [overlayOpen, setOverlayOpen] = useState(false)

  const allStyles   = [...new Set(allSets.flatMap(s => s.style))].sort()
  const allLabels   = [...new Set(allSets.map(s => s.label))].sort()
  const allDungeons = [...new Set(
    allSets.filter(s => s.source?.type === 'dungeon').map(s => s.source.name)
  )].sort()

  const hasActiveFilter =
    filterState.stars.length > 0 || filterState.style.length > 0 ||
    filterState.label.length > 0 || filterState.dungeon.length > 0 ||
    filterState.status !== 'all'

  const activeFilterCount =
    filterState.stars.length + filterState.style.length +
    filterState.label.length + filterState.dungeon.length +
    (filterState.status !== 'all' ? 1 : 0)

  function toggleChip(key, value) {
    setFilterState(prev => {
      const arr = prev[key]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  function setStatus(value) {
    setFilterState(prev => ({ ...prev, status: value }))
  }

  function resetFilters() {
    setFilterState({ stars: [], style: [], label: [], dungeon: [], status: 'all' })
  }

  const filteredSets = allSets.filter(set => matchesSetFilter(set, filterState))
  const isItemMode = filterState.status !== 'all'

  const colorRows = isItemMode
    ? filteredSets.flatMap(set =>
        set.colors.map(color => ({ set, color }))
      ).filter(({ set, color }) => {
        const missing = colorMissing(set, color, progress)
        if (filterState.status === 'missing'  && missing === 0) return false
        if (filterState.status === 'complete' && missing > 0)   return false
        if (filterState.status === 'almost'   && missing !== 1) return false
        return true
      })
    : []

  const groupedB = colorRows.reduce((groups, { set, color }) => {
    const last = groups[groups.length - 1]
    if (last && last.set.id === set.id) {
      last.colors.push(color)
    } else {
      groups.push({ set, colors: [color] })
    }
    return groups
  }, [])

  const resultCount = isItemMode ? colorRows.length : filteredSets.length
  const resultLabel = isItemMode
    ? `${resultCount} Color Set${resultCount !== 1 ? 's' : ''}`
    : `${resultCount} Set${resultCount !== 1 ? 's' : ''}`

  return (
    <div className="filterview">

      {/* ── Header ── */}
      <div className="filterview__header">
        <button className="filterview__back" onClick={() => navigate('/')}>
          <img src="/icons/ui/back.png" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
          Filter
        </button>
        <div className="filterview__header-right">
          <span className="filterview__count">{resultLabel}</span>
          <button
            className={`fv-filter-btn ${hasActiveFilter ? 'fv-filter-btn--active' : ''}`}
            onClick={() => setOverlayOpen(true)}
            aria-label="open filter"
          >
            <img src="/icons/ui/filter.png" alt="Filter" style={{ height: '24px' }} onError={e => { e.currentTarget.style.display = 'none' }} />
            {hasActiveFilter && <span className="fv-filter-btn__dot" />}
          </button>
        </div>
      </div>

      {/* ── Ergebnisse ── */}
      {!isItemMode && (
        filteredSets.length === 0
          ? <p className="fv-empty">No set found.</p>
          : <div className="fv-set-grid">
              {filteredSets.map(set => (
                <SetTileA
                  key={set.id} set={set} progress={progress}
                  onClick={() => navigate(setPath(set))}
                />
              ))}
            </div>
      )}

      {isItemMode && (
        groupedB.length === 0
          ? <p className="fv-empty">No entry found.</p>
          : <div className="fv-block-list">
              {groupedB.map(({ set, colors }) => (
                <SetBlockB
                  key={set.id} set={set} colors={colors}
                  progress={progress}
                  toggleOwned={toggleOwned}
                  flags={flags}
                  toggleFlagged={toggleFlagged}
                />
              ))}
            </div>
      )}

      {/* ── Backdrop ── */}
      <div
        className={`fv-backdrop ${overlayOpen ? 'fv-backdrop--open' : ''}`}
        onClick={() => setOverlayOpen(false)}
      />

      {/* ── Bottom Sheet ── */}
      <div className={`fv-sheet ${overlayOpen ? 'fv-sheet--open' : ''}`} aria-hidden={!overlayOpen}>
        <div className="fv-sheet__handle" />

        <div className="fv-sheet__titlerow">
          <span className="fv-sheet__title">
            Filter{activeFilterCount > 0 ? ` · ${activeFilterCount} active` : ''}
          </span>
          <button className="fv-sheet__close" onClick={() => setOverlayOpen(false)} aria-label="close">✕</button>
        </div>

        <div className="fv-section">
          <p className="fv-section__label">Stars</p>
          <div className="fv-chips">
            {[['5','5★'],['4','4★'],['3','3★'],['special','Special']].map(([val, lbl]) => (
              <Chip key={val} label={lbl}
                active={filterState.stars.includes(val)}
                onToggle={() => toggleChip('stars', val)}
              />
            ))}
          </div>
        </div>

        <div className="fv-section">
          <p className="fv-section__label">Style</p>
          <div className="fv-chips">
            {allStyles.map(s => (
              <Chip key={s} label={s}
                active={filterState.style.includes(s)}
                onToggle={() => toggleChip('style', s)}
              />
            ))}
          </div>
        </div>

        <div className="fv-section">
          <p className="fv-section__label">Label</p>
          <div className="fv-chips">
            {allLabels.map(l => (
              <Chip key={l} label={l}
                active={filterState.label.includes(l)}
                onToggle={() => toggleChip('label', l)}
              />
            ))}
          </div>
        </div>

        {allDungeons.length > 0 && (
          <div className="fv-section">
            <p className="fv-section__label">Dungeon</p>
            <div className="fv-chips">
              {allDungeons.map(d => (
                <Chip key={d} label={d}
                  active={filterState.dungeon.includes(d)}
                  onToggle={() => toggleChip('dungeon', d)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="fv-section">
          <p className="fv-section__label">Status</p>
          <div className="fv-radios">
            <RadioOption label="All"       value="all"      current={filterState.status} onSelect={setStatus} />
            <RadioOption label="Missing"    value="missing"  current={filterState.status} onSelect={setStatus} />
            <RadioOption label="Complete" value="complete" current={filterState.status} onSelect={setStatus} />
            <RadioOption label="Almost complete" value="almost"  current={filterState.status} onSelect={setStatus} />
          </div>
        </div>

        <button className="fv-reset" onClick={resetFilters} disabled={!hasActiveFilter}>
          Reset Filter
        </button>
      </div>

    </div>
  )
}
