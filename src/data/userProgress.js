import localforage from "localforage"

// Datenbank-Konfiguration
const store = localforage.createInstance({
  name: "heureka-tracker",
  storeName: "progress",
})

const PROGRESS_KEY = "userProgress"
const FLAGS_KEY    = "userFlags"

// ─── PROGRESS DATENSTRUKTUR ───────────────────────────────────────────────────
//
// {
//   "afterglow": {
//     "Yellow": { "Head": true, "Hands": false, "Feet": false },
//     ...
//   }, ...
// }

// ─── FLAGS DATENSTRUKTUR ──────────────────────────────────────────────────────
//
// {
//   "afterglow:Yellow:Head": { category: "farm" | "level" | null },
//   "rainbell:Green:Hands":  { category: null },
//   ...
// }
// Ein Key existiert = Item ist geflaggt. category null = unsortiert.

function flagKey(setId, color, slot) {
  return `${setId}:${color}:${slot}`
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

export async function loadProgress() {
  const saved = await store.getItem(PROGRESS_KEY)
  return saved ?? {}
}

async function saveProgress(progress) {
  await store.setItem(PROGRESS_KEY, progress)
}

export async function setOwned(setId, color, slot, owned) {
  const progress = await loadProgress()
  if (!progress[setId]) progress[setId] = {}
  if (!progress[setId][color]) progress[setId][color] = {}
  progress[setId][color][slot] = owned
  await saveProgress(progress)
  return progress
}

export function getOwned(progress, setId, color, slot) {
  return progress?.[setId]?.[color]?.[slot] ?? false
}

export function countOwnedSlots(progress, setId, color, slots) {
  return slots.filter((slot) => getOwned(progress, setId, color, slot)).length
}

export function isColorSetComplete(progress, setId, color, slots) {
  return slots.every((slot) => getOwned(progress, setId, color, slot))
}

// ─── FLAGS ────────────────────────────────────────────────────────────────────

export async function loadFlags() {
  const saved = await store.getItem(FLAGS_KEY)
  return saved ?? {}
}

async function saveFlags(flags) {
  await store.setItem(FLAGS_KEY, flags)
}

/**
 * Setzt/entfernt ein Flag für ein einzelnes Item.
 * Bereits geflaggt → Flag entfernen.
 * Nicht geflaggt   → Flag hinzufügen mit category: null (unsortiert).
 */
export async function toggleFlagged(setId, color, slot) {
  const flags = await loadFlags()
  const key = flagKey(setId, color, slot)
  if (key in flags) {
    delete flags[key]
  } else {
    flags[key] = { category: null }
  }
  await saveFlags(flags)
  return flags
}

/**
 * Setzt die Kategorie eines geflaggten Items.
 * Erstellt den Flag-Eintrag falls noch nicht vorhanden.
 * @param {string} category — "farm" | "level" | null
 */
export async function setFlagCategory(setId, color, slot, category) {
  const flags = await loadFlags()
  const key = flagKey(setId, color, slot)
  flags[key] = { category }
  await saveFlags(flags)
  return flags
}

/** Gibt true zurück wenn das Item geflaggt ist. */
export function isFlagged(flags, setId, color, slot) {
  return flagKey(setId, color, slot) in (flags ?? {})
}

/** Gibt den Flag-Eintrag zurück (z.B. { category: "farm" }) oder null. */
export function getFlag(flags, setId, color, slot) {
  return flags?.[flagKey(setId, color, slot)] ?? null
}

// ─── ACHIEVEMENT PROGRESS ─────────────────────────────────────────────────────
//
// {
//   "ultimate-eureka-master": [true, false, false],
//   "that-flash-of-hope":     [true, true],
//   ...
// }
// Index i = Tier i geclaimt.

const ACHIEVEMENT_KEY = "achievementProgress"

export async function loadAchievementProgress() {
  const saved = await store.getItem(ACHIEVEMENT_KEY)
  return saved ?? {}
}

async function saveAchievementProgress(progress) {
  await store.setItem(ACHIEVEMENT_KEY, progress)
}

/**
 * Toggled den claimed-Status von Tier tierIndex im Achievement achievementId.
 */
export async function toggleAchievementTier(achievementId, tierIndex) {
  const progress = await loadAchievementProgress()
  const tiers = [...(progress[achievementId] ?? [])]
  tiers[tierIndex] = !tiers[tierIndex]
  progress[achievementId] = tiers
  await saveAchievementProgress(progress)
  return progress
}
