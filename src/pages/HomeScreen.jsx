import { useNavigate } from 'react-router-dom'
import { fiveStarSets, fourStarSets, threeStarSets, specialSets, achievementDiamonds, allSets } from '../data/eurekaSets'
import { getOwned } from '../data/userProgress'
import './HomeScreen.css'

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

const DiamondIcon = () => (
  <img src="/icons/ui/diamond.png" alt="💎" style={{ height: '16px', verticalAlign: 'middle' }} onError={imgFallback} />
)

function countCompleteSets(sets, progress) {
  let complete = 0
  for (const set of sets) {
    const allOwned = set.colors.every((color) =>
      set.slots.every((slot) => getOwned(progress, set.id, color, slot))
    )
    if (allOwned) complete++
  }
  return complete
}

function HomeTile({ label, total, owned, counter, to, disabled, icon }) {
  const navigate = useNavigate()
  const done = total > 0 && owned === total

  const progressNode = counter != null
    ? <span className="home-tile__progress">{counter}</span>
    : total != null
    ? <span className="home-tile__progress">{owned} / {total} Sets</span>
    : null

  return (
    <button
      className={[
        'home-tile',
        icon     ? 'home-tile--with-icon' : '',
        done     ? 'home-tile--done'      : '',
        disabled ? 'home-tile--disabled'  : '',
      ].filter(Boolean).join(' ')}
      onClick={() => !disabled && to && navigate(to)}
      disabled={disabled && !to}
    >
      {icon && (
        <img
          src={`${icon}.png`}
          alt=""
          className="home-tile__icon"
          onError={imgFallback}
        />
      )}
      {icon ? (
        <div className="home-tile__body">
          <span className="home-tile__label">{label}</span>
          {progressNode}
        </div>
      ) : (
        <>
          <span className="home-tile__label">{label}</span>
          {progressNode}
        </>
      )}
    </button>
  )
}

export default function HomeScreen({ progress, flags, achievementProgress, filterState }) {
  const navigate = useNavigate()
  const five  = { sets: fiveStarSets,  owned: countCompleteSets(fiveStarSets,  progress) }
  const four  = { sets: fourStarSets,  owned: countCompleteSets(fourStarSets,  progress) }
  const three = { sets: threeStarSets, owned: countCompleteSets(threeStarSets, progress) }
  const spec  = { sets: specialSets,   owned: countCompleteSets(specialSets,   progress) }

  const activeFlagCount = Object.keys(flags ?? {}).filter((key) => {
    const [setId, color, slot] = key.split(':')
    return !getOwned(progress, setId, color, slot)
  }).length

  const ap = achievementProgress ?? {}
  const totalAchievementDiamonds  = achievementDiamonds.reduce((sum, a) => sum + a.tiers.reduce((s, t) => s + t.diamonds, 0), 0)
  const earnedAchievementDiamonds = achievementDiamonds.reduce((sum, a) => {
    const tiers = ap[a.id] ?? []
    return sum + a.tiers.reduce((s, t, i) => s + (tiers[i] ? t.diamonds : 0), 0)
  }, 0)

  const earnedSetDiamonds = allSets.reduce((sum, set) =>
    sum + set.colors.reduce((s, color) => {
      const complete = set.slots.every((slot) => getOwned(progress, set.id, color, slot))
      return s + (complete ? set.diamondsPerColorSet : 0)
    }, 0), 0
  )
  const totalSetDiamonds = allSets.reduce((sum, set) => sum + set.colors.length * set.diamondsPerColorSet, 0)

  const earnedDiamonds = earnedSetDiamonds + earnedAchievementDiamonds
  const totalDiamonds  = totalSetDiamonds  + totalAchievementDiamonds

  const fs = filterState ?? { stars: [], style: [], label: [], dungeon: [], status: 'all' }
  const activeFilterCount =
    fs.stars.length + fs.style.length + fs.label.length + fs.dungeon.length +
    (fs.status !== 'all' ? 1 : 0)

  const ownedVariants = allSets.reduce((sum, set) =>
    sum + set.colors.reduce((s, color) =>
      s + set.slots.filter((slot) => getOwned(progress, set.id, color, slot)).length, 0), 0
  )
  const totalVariants = allSets.reduce((sum, set) => sum + set.colors.length * set.slots.length, 0)

  return (
    <div className="home">
      <div className="home__header">
        <button className="home__icon-btn" onClick={() => navigate('/stats')} aria-label="Statistics">
          <img src="/icons/ui/statistic.png" alt="Statistics" style={{ height: '24px' }} onError={imgFallback} />
        </button>
        <h1 className="home__title">
          <img src="/icons/ui/logo.png" alt="Eureka Tracker" style={{ height: '156px' }} onError={imgFallback} />
        </h1>
        <button
          className={`home__icon-btn ${activeFilterCount > 0 ? 'home__icon-btn--active' : ''}`}
          onClick={() => navigate('/filter')}
          aria-label="Filter"
        >
          <img src="/icons/ui/filter.png" alt="Filter" style={{ height: '24px' }} onError={imgFallback} />
          {activeFilterCount > 0 && <span className="home__filter-dot" />}
        </button>
      </div>

      <div className="home__grid">
        <HomeTile label="5★ Eurekas" total={five.sets.length}  owned={five.owned}  to="/sets/5" />
        <HomeTile label="4★ Eurekas" total={four.sets.length}  owned={four.owned}  to="/sets/4" />
        <HomeTile label="3★ Eurekas" total={three.sets.length} owned={three.owned} to="/sets/3" />
        <HomeTile label="Specials"   total={spec.sets.length}  owned={spec.owned}  to="/sets/special" icon="/icons/ui/specials" />
        <HomeTile
          label="Next Up"
          counter={`${activeFlagCount} flagged`}
          to="/nextup"
          icon="/icons/ui/next-up"
        />
        <HomeTile
          label="Courses"
          counter={<><DiamondIcon /> {earnedAchievementDiamonds} / {totalAchievementDiamonds}</>}
          to="/achievements"
          icon="/icons/ui/achievement"
        />
      </div>

      <p className="home__diamonds">
        <DiamondIcon /> {earnedDiamonds} / {totalDiamonds} Diamonds
      </p>
      <p className="home__diamonds">✨ {ownedVariants} / {totalVariants} Variants obtained</p>

      <div className="home__disclaimer">
        <p className="home__disclaimer__text">
          All images and content belong to Infold Games and Papergames and are part of or derived from Infinity Nikki. All rights reserved.
        </p>
        <div className="home__footer-links">
          <a
            href="https://ko-fi.com/miofelia"
            target="_blank"
            rel="noopener noreferrer"
            className="home__footer-btn"
          >
            ☕ Donate
          </a>
          <button className="home__footer-btn" onClick={() => navigate('/legal')}>
            Legal
          </button>
        </div>
      </div>
    </div>
  )
}
