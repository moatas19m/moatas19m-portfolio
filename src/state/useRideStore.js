import { create } from 'zustand'

/**
 * @typedef {(
 *  'Idle' |
 *  'Starting' |
 *  'Riding' |
 *  'Arriving' |
 *  'ZoomedOut'
 * )} RidePhase
 */

/**
 * @typedef {(
 *  'projects' |
 *  'experience' |
 *  'skills' |
 *  'contact' |
 *  null
 * )} PlanetId
 */

/**
 * Single source of truth for the ride experience.
 *
 * - Holds only primitives/enums per PRD (no Three.js objects)
 * - Progress is always clamped to [0, 1]
 * - prefersReducedMotion read once at init (SSR-safe)
 * - Muted controls WebAudio nodes externally
 *
 * @typedef {Object} RideState
 * @property {RidePhase} phase
 * @property {PlanetId} activePlanet
 * @property {number} progress          // 0..1
 * @property {boolean} prefersReducedMotion
 * @property {boolean} muted
 * @property {number} speedBoost             // 0..1 multiplier applied temporarily
 * @property {number|null} currentTargetIdx  // segment index retargeting
 * @property {(p: RidePhase) => void} setPhase
 * @property {(id: PlanetId) => void} setActivePlanet
 * @property {(t: number) => void} setProgress
 * @property {(m: boolean) => void} setMuted
 * @property {(b: number) => void} setSpeedBoost
 * @property {(idx: number|null) => void} setCurrentTargetIdx
 */

/** SSR-safe prefers-reduced-motion detection */
function getInitialPRM() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  try {
    return !!window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch (_) {
    return false
  }
}

/** Clamp helper to [min, max] */
function clamp01(value) {
  if (Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<RideState>>} */
export const useRideStore = create((set) => ({
  phase: /** @type {RidePhase} */ ('Idle'),
  activePlanet: /** @type {PlanetId} */ (null),
  progress: 0,
  prefersReducedMotion: getInitialPRM(),
  muted: true,
  speedBoost: 0,
  currentTargetIdx: null,

  setPhase: (p) => set({ phase: p }),
  setActivePlanet: (id) => set({ activePlanet: id }),
  setProgress: (t) => set({ progress: clamp01(t) }),
  setMuted: (m) => set({ muted: !!m }),
  setSpeedBoost: (b) => set({ speedBoost: clamp01(b) }),
  setCurrentTargetIdx: (idx) => set({ currentTargetIdx: idx == null ? null : Math.max(0, Math.floor(idx)) }),
}))

// Convenience selectors (avoid rerenders by selecting the minimal slice)
export const selectPhase = (s) => s.phase
export const selectActivePlanet = (s) => s.activePlanet
export const selectProgress = (s) => s.progress
export const selectPrefersReducedMotion = (s) => s.prefersReducedMotion
export const selectMuted = (s) => s.muted
export const selectSpeedBoost = (s) => s.speedBoost
export const selectCurrentTargetIdx = (s) => s.currentTargetIdx


