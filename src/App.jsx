import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import localforage from 'localforage'
import { useProgress } from './hooks/useProgress'
import { fiveStarSets, fourStarSets } from './data/eurekaSets'
import HomeScreen from './pages/HomeScreen'
import SetGrid from './pages/SetGrid'
import SetDetail from './pages/SetDetail'
import ThreeStarDetail from './pages/ThreeStarDetail'
import SpecialDetail from './pages/SpecialDetail'
import NextUp from './pages/NextUp'
import Achievements from './pages/Achievements'
import FilterView from './pages/FilterView'
import StatsView from './pages/StatsView'
import LegalNotice from './pages/LegalNotice'

function App() {
  const {
    progress, toggleOwned, isLoading,
    flags, toggleFlagged, setFlagCategory,
    achievementProgress, toggleAchievementTier,
  } = useProgress()

  // Filter-State bleibt bei Navigation erhalten (kein localforage, nur Session)
  const [filterState, setFilterState] = useState({
    stars: [], style: [], label: [], dungeon: [], status: 'all',
  })

  // Onboarding-Overlay (einmalig beim ersten Start)
  const [showOnboarding, setShowOnboarding] = useState(false)
  useEffect(() => {
    localforage.getItem('onboardingDone').then((val) => {
      if (!val) setShowOnboarding(true)
    })
  }, [])
  function dismissOnboarding() {
    localforage.setItem('onboardingDone', true)
    setShowOnboarding(false)
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#a78bfa' }}>Laden…</p>
      </div>
    )
  }

  return (
    <>
    <Routes>
      <Route path="/" element={
        <HomeScreen
          progress={progress}
          flags={flags}
          achievementProgress={achievementProgress}
          filterState={filterState}
        />
      } />

      <Route path="/sets/5"       element={<SetGrid sets={fiveStarSets} title="5★ Eurekas" basePath="/sets/5" progress={progress} />} />
      <Route path="/sets/4"       element={<SetGrid sets={fourStarSets} title="4★ Eurekas" basePath="/sets/4" progress={progress} />} />
      <Route path="/sets/3"       element={<ThreeStarDetail progress={progress} toggleOwned={toggleOwned} flags={flags} toggleFlagged={toggleFlagged} />} />
      <Route path="/sets/special" element={<SpecialDetail   progress={progress} toggleOwned={toggleOwned} flags={flags} toggleFlagged={toggleFlagged} />} />

      <Route path="/sets/5/:setId" element={<SetDetail progress={progress} toggleOwned={toggleOwned} flags={flags} toggleFlagged={toggleFlagged} />} />
      <Route path="/sets/4/:setId" element={<SetDetail progress={progress} toggleOwned={toggleOwned} flags={flags} toggleFlagged={toggleFlagged} />} />

      <Route path="/nextup" element={
        <NextUp
          progress={progress} flags={flags}
          toggleFlagged={toggleFlagged} toggleOwned={toggleOwned}
          setFlagCategory={setFlagCategory}
        />
      } />

      <Route path="/achievements" element={
        <Achievements
          achievementProgress={achievementProgress}
          toggleAchievementTier={toggleAchievementTier}
        />
      } />

      <Route path="/stats"  element={<StatsView progress={progress} />} />
      <Route path="/legal" element={<LegalNotice />} />

      <Route path="/filter" element={
        <FilterView
          filterState={filterState}
          setFilterState={setFilterState}
          progress={progress}
          toggleOwned={toggleOwned}
          flags={flags}
          toggleFlagged={toggleFlagged}
        />
      } />
    </Routes>

    {showOnboarding && (
      <div className="onboarding-overlay">
        <div className="onboarding-card">
          <img
            src="/icons/ui/onboarding.webp"
            alt=""
            style={{ height: '120px', display: 'block', margin: '0 auto 16px' }}
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/icons/ui/onboarding.png' }}
          />
          <p className="onboarding-card__title">Welcome to Eureka Tracker!</p>
          <p className="onboarding-card__text">
            Tap Share → Add to Home Screen to install this app on your device.
          </p>
          <button className="onboarding-card__btn" onClick={dismissOnboarding}>
            Got it
          </button>
        </div>
      </div>
    )}
    </>
  )
}

export default App
