import { useNavigate } from 'react-router-dom'
import { allSets, fiveStarSets } from '../data/eurekaSets'
import { getOwned } from '../data/userProgress'
import './StatsView.css'

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

const C = 2 * Math.PI * 40   // Kreisumfang r=40 ≈ 251.33

// ── Varianten zählen ───────────────────────────────────────────────────────────

function countVariantsForSets(sets, progress) {
  let owned = 0, total = 0
  for (const set of sets) {
    for (const color of set.colors) {
      for (const slot of set.slots) {
        total++
        if (getOwned(progress, set.id, color, slot)) owned++
      }
    }
  }
  return { owned, total }
}

// ── Donut-Chart ────────────────────────────────────────────────────────────────

function DonutChart({ title, segments, globalOwned, globalTotal }) {
  const pct = globalTotal > 0 ? Math.round(globalOwned / globalTotal * 100) : 0

  // Cumulative rotation computed before JSX (can't mutate inside map return)
  const arcs = []
  let cumAngle = -90
  for (const seg of segments) {
    const arcLen = globalTotal > 0 ? (seg.owned / globalTotal) * C : 0
    arcs.push({ ...seg, arcLen, rotation: cumAngle })
    cumAngle += globalTotal > 0 ? (seg.owned / globalTotal) * 360 : 0
  }

  return (
    <div className="sv-donut">
      <p className="sv-donut__title">{title}</p>
      <svg viewBox="0 0 100 100" className="sv-donut__svg">
        {/* Hintergrundring */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="#374151"
          strokeWidth="12"
        />
        {/* Segmente */}
        {arcs.map((arc, i) =>
          arc.arcLen > 0 ? (
            <circle
              key={i}
              cx="50" cy="50" r="40"
              fill="none"
              stroke={arc.color}
              strokeWidth="12"
              strokeDasharray={`${arc.arcLen} ${C - arc.arcLen}`}
              style={{
                transform: `rotate(${arc.rotation}deg)`,
                transformOrigin: '50px 50px',
              }}
            />
          ) : null
        )}
        {/* Prozent-Label */}
        <text
          x="50" y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize="13"
          fontWeight="700"
        >
          {pct}%
        </text>
      </svg>

      <div className="sv-donut__legend">
        {segments.map((seg, i) => (
          <div key={i} className="sv-donut__leg-row">
            <span className="sv-donut__leg-dot" style={{ background: seg.color }} />
            <span className="sv-donut__leg-name">{seg.label}</span>
            <span className="sv-donut__leg-val">{seg.owned}/{seg.total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Label-Zeile ────────────────────────────────────────────────────────────────

function LabelRow({ label, owned, total }) {
  const pct = total > 0 ? Math.round(owned / total * 100) : 0
  return (
    <div className="sv-label-row">
      <span className="sv-label-row__name">{label}</span>
      <div className="sv-label-row__bar">
        <div className="sv-label-row__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="sv-label-row__val">{owned}/{total}</span>
    </div>
  )
}

// ── Hauptkomponente ────────────────────────────────────────────────────────────

export default function StatsView({ progress }) {
  const navigate = useNavigate()

  // ── Iridescent (nur 5★-Sets haben Iridescent) ──────────────────────────────
  let iriOwned = 0, iriTotal = 0, iriSetsOwned = 0
  for (const set of fiveStarSets) {
    let allSlotsOwned = true
    for (const slot of set.slots) {
      iriTotal++
      if (getOwned(progress, set.id, 'Iridescent', slot)) {
        iriOwned++
      } else {
        allSlotsOwned = false
      }
    }
    if (allSlotsOwned) iriSetsOwned++
  }
  const iriPct = iriTotal > 0 ? (iriOwned / iriTotal) * 100 : 0

  // ── Globale Summe für alle Donuts ──────────────────────────────────────────
  const { owned: globalOwned, total: globalTotal } = countVariantsForSets(allSets, progress)

  // ── By Stars ────────────────────────────────────────────────────────────────
  const starSegments = [
    { label: '5★',     color: '#facc15', sets: allSets.filter(s => s.stars === 5) },
    { label: '4★',     color: '#a78bfa', sets: allSets.filter(s => s.stars === 4) },
    { label: '3★',     color: '#4ade80', sets: allSets.filter(s => s.stars === 3 && !s.special) },
    { label: 'Special',color: '#f472b6', sets: allSets.filter(s => s.special) },
  ].map(g => {
    const { owned, total } = countVariantsForSets(g.sets, progress)
    return { label: g.label, color: g.color, owned, total }
  })

  // ── By Style ────────────────────────────────────────────────────────────────
  const STYLE_COLORS = {
    Elegant: '#818cf8',
    Sweet:   '#f472b6',
    Cool:    '#60a5fa',
    Fresh:   '#4ade80',
    Sexy:    '#f87171',
  }
  const styleSegments = Object.entries(STYLE_COLORS).map(([style, color]) => {
    const { owned, total } = countVariantsForSets(
      allSets.filter(s => s.style.includes(style)),
      progress
    )
    return { label: style, color, owned, total }
  })

  // ── By Color ────────────────────────────────────────────────────────────────
  const COLOR_HEX = {
    Yellow:     '#facc15',
    Green:      '#4ade80',
    Red:        '#f87171',
    Pink:       '#f472b6',
    Blue:       '#60a5fa',
    Purple:     '#c084fc',
    White:      '#e2e8f0',
    Iridescent: '#e879f9',
  }
  const colorSegments = Object.entries(COLOR_HEX).map(([color, hex]) => {
    let owned = 0, total = 0
    for (const set of allSets) {
      if (!set.colors.includes(color)) continue
      for (const slot of set.slots) {
        total++
        if (getOwned(progress, set.id, color, slot)) owned++
      }
    }
    return { label: color, color: hex, owned, total }
  })

  // ── By Label (nach total absteigend sortiert) ──────────────────────────────
  const allLabels = [...new Set(allSets.map(s => s.label))]
  const labelRows = allLabels
    .map(label => {
      const { owned, total } = countVariantsForSets(
        allSets.filter(s => s.label === label),
        progress
      )
      return { label, owned, total }
    })
    .sort((a, b) => b.total - a.total)

  return (
    <div className="statsview">

      {/* ── Header ── */}
      <div className="statsview__header">
        <button className="statsview__back" onClick={() => navigate('/')}>
          <img src="/icons/ui/back.webp" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={imgFallback} />
          Statistics
        </button>
      </div>

      {/* ── Iridescent-Sektion ── */}
      <section className="sv-iri">
        <p className="sv-iri__label">✨ Iridescent</p>
        <div className="sv-iri__bar-wrap">
          <div className="sv-iri__bar-fill" style={{ width: `${iriPct}%` }} />
        </div>
        <p className="sv-iri__counter">
          {iriOwned} / {iriTotal} Variants
          <span className="sv-iri__sep"> · </span>
          {iriSetsOwned} / {fiveStarSets.length} Sets
        </p>
      </section>

      {/* ── Donut-Charts ── */}
      <section className="sv-donuts-card">
        <div className="sv-donuts">
          <DonutChart
            title="By Stars"
            segments={starSegments}
            globalOwned={globalOwned}
            globalTotal={globalTotal}
          />
          <DonutChart
            title="By Style"
            segments={styleSegments}
            globalOwned={globalOwned}
            globalTotal={globalTotal}
          />
          <DonutChart
            title="By Color"
            segments={colorSegments}
            globalOwned={globalOwned}
            globalTotal={globalTotal}
          />
        </div>
      </section>

      {/* ── By Label ── */}
      <section className="sv-labels">
        <h3 className="sv-labels__title">By Label</h3>
        <div className="sv-labels__list">
          {labelRows.map(row => (
            <LabelRow
              key={row.label}
              label={row.label}
              owned={row.owned}
              total={row.total}
            />
          ))}
        </div>
      </section>

    </div>
  )
}
