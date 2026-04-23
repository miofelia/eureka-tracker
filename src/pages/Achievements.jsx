import { useNavigate } from 'react-router-dom'
import { achievementDiamonds } from '../data/eurekaSets'
import './Achievements.css'

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

const DiamondIcon = ({ size = 14 }) => (
  <img src="/icons/ui/diamond.webp" alt="💎" style={{ height: `${size}px`, verticalAlign: 'middle' }} onError={imgFallback} />
)

function tierText(description, goal) {
  const idx = description.indexOf(' ')
  if (idx === -1) return `${description} ${goal}`
  return `${description.slice(0, idx)} ${goal} ${description.slice(idx + 1)}`
}

function AchievementBlock({ achievement, claimedTiers, onToggle }) {
  const earnedDiamonds = achievement.tiers.reduce(
    (sum, tier, i) => sum + (claimedTiers[i] ? tier.diamonds : 0), 0
  )
  const totalDiamonds = achievement.tiers.reduce((sum, tier) => sum + tier.diamonds, 0)
  const allClaimed = earnedDiamonds === totalDiamonds

  return (
    <div className={`ach-block ${allClaimed ? 'ach-block--complete' : ''}`}>
      <div className="ach-block__header">
        <h3 className="ach-block__name">{achievement.name}</h3>
        <span className="ach-block__total">
          <DiamondIcon /> {earnedDiamonds} / {totalDiamonds}
        </span>
      </div>

      <div className="ach-block__tiers">
        {achievement.tiers.map((tier, i) => {
          const claimed = !!claimedTiers[i]
          return (
            <button
              key={i}
              className={`ach-tier ${claimed ? 'ach-tier--claimed' : ''}`}
              onClick={() => onToggle(i)}
              aria-pressed={claimed}
            >
              <span className="ach-tier__text">
                {tierText(achievement.description, tier.goal)}
              </span>
              <span className="ach-tier__right">
                <span className="ach-tier__diamonds">
                  <DiamondIcon /> {tier.diamonds}
                </span>
                <span className="ach-tier__check" aria-hidden="true">
                  {claimed ? '✓' : ''}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Achievements({ achievementProgress, toggleAchievementTier }) {
  const navigate = useNavigate()

  const totalDiamonds = achievementDiamonds.reduce(
    (sum, a) => sum + a.tiers.reduce((s, t) => s + t.diamonds, 0), 0
  )
  const earnedDiamonds = achievementDiamonds.reduce((sum, a) => {
    const tiers = achievementProgress[a.id] ?? []
    return sum + a.tiers.reduce((s, t, i) => s + (tiers[i] ? t.diamonds : 0), 0)
  }, 0)

  return (
    <div className="achievements">
      <div className="achievements__header">
        <button className="achievements__back" onClick={() => navigate('/')}>
          <img src="/icons/ui/back.webp" alt="←" style={{ height: '20px', verticalAlign: 'middle', marginRight: '6px' }} onError={imgFallback} />
          Achievements
        </button>
        <span className="achievements__diamonds">
          <DiamondIcon size={16} /> {earnedDiamonds} / {totalDiamonds}
        </span>
      </div>

      <div className="ach-list">
        {achievementDiamonds.map((achievement) => (
          <AchievementBlock
            key={achievement.id}
            achievement={achievement}
            claimedTiers={achievementProgress[achievement.id] ?? []}
            onToggle={(tierIndex) => toggleAchievementTier(achievement.id, tierIndex)}
          />
        ))}
      </div>
    </div>
  )
}
