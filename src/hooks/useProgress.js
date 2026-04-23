import { useState, useEffect, useCallback } from "react"
import {
  loadProgress, setOwned, getOwned,
  loadFlags, toggleFlagged as storageToggleFlagged,
  setFlagCategory as storageSetFlagCategory,
  loadAchievementProgress,
  toggleAchievementTier as storageToggleAchievementTier,
} from "../data/userProgress"

export function useProgress() {
  const [progress,            setProgress]            = useState({})
  const [flags,               setFlags]               = useState({})
  const [achievementProgress, setAchievementProgress] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Beim ersten Laden: alle drei Stores parallel holen
  useEffect(() => {
    Promise.all([loadProgress(), loadFlags(), loadAchievementProgress()])
      .then(([savedProgress, savedFlags, savedAchievements]) => {
        setProgress(savedProgress)
        setFlags(savedFlags)
        setAchievementProgress(savedAchievements)
        setIsLoading(false)
      })
  }, [])

  // Dreht owned-Status um.
  // Wird ein Item auf owned: true gesetzt, wird ein eventuell vorhandener Flag entfernt.
  const toggleOwned = useCallback((setId, color, slot) => {
    setProgress((current) => {
      const newValue = !getOwned(current, setId, color, slot)
      setOwned(setId, color, slot, newValue)
      if (newValue) {
        // Flag entfernen falls vorhanden (fire-and-forget)
        setFlags((currentFlags) => {
          const key = `${setId}:${color}:${slot}`
          if (!(key in currentFlags)) return currentFlags
          const next = { ...currentFlags }
          delete next[key]
          storageToggleFlagged(setId, color, slot) // entfernt aus Storage
          return next
        })
      }
      return {
        ...current,
        [setId]: {
          ...current[setId],
          [color]: { ...current[setId]?.[color], [slot]: newValue },
        },
      }
    })
  }, [])

  // Setzt/entfernt Flag (category: null = unsortiert)
  const toggleFlagged = useCallback((setId, color, slot) => {
    setFlags((current) => {
      const key = `${setId}:${color}:${slot}`
      const next = { ...current }
      if (key in next) {
        delete next[key]
      } else {
        next[key] = { category: null }
      }
      storageToggleFlagged(setId, color, slot)   // fire-and-forget sync mit Storage
      return next
    })
  }, [])

  // Ändert Kategorie eines geflaggten Items ("farm" | "level" | null)
  const setFlagCategory = useCallback((setId, color, slot, category) => {
    const key = `${setId}:${color}:${slot}`
    setFlags((current) => {
      const next = { ...current, [key]: { category } }
      storageSetFlagCategory(setId, color, slot, category)
      return next
    })
  }, [])

  // Toggled claimed-Status eines Achievement-Tiers
  const toggleAchievementTier = useCallback((achievementId, tierIndex) => {
    setAchievementProgress((current) => {
      const tiers = [...(current[achievementId] ?? [])]
      tiers[tierIndex] = !tiers[tierIndex]
      storageToggleAchievementTier(achievementId, tierIndex) // fire-and-forget
      return { ...current, [achievementId]: tiers }
    })
  }, [])

  return {
    progress, toggleOwned, isLoading,
    flags, toggleFlagged, setFlagCategory,
    achievementProgress, toggleAchievementTier,
  }
}
