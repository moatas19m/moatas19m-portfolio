import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useRideStore } from './useRideStore'

describe('useRideStore', () => {
  beforeEach(() => {
    const { getState, setState } = useRideStore
    const s = getState()
    // Reset state WITHOUT replacing the store (preserve setter functions)
    setState({
      phase: 'Idle',
      activePlanet: null,
      progress: 0,
      prefersReducedMotion: s.prefersReducedMotion,
      muted: true,
    })
  })

  it('initializes with sane defaults', () => {
    const s = useRideStore.getState()
    expect(s.phase).toBe('Idle')
    expect(s.activePlanet).toBe(null)
    expect(s.progress).toBe(0)
    expect(typeof s.prefersReducedMotion).toBe('boolean')
    expect(s.muted).toBe(true)
  })

  it('clamps progress to [0,1]', () => {
    act(() => useRideStore.getState().setProgress(-1))
    expect(useRideStore.getState().progress).toBe(0)
    act(() => useRideStore.getState().setProgress(2))
    expect(useRideStore.getState().progress).toBe(1)
    act(() => useRideStore.getState().setProgress(0.5))
    expect(useRideStore.getState().progress).toBe(0.5)
  })

  it('sets phase and activePlanet', () => {
    act(() => useRideStore.getState().setPhase('Starting'))
    expect(useRideStore.getState().phase).toBe('Starting')
    act(() => useRideStore.getState().setActivePlanet('projects'))
    expect(useRideStore.getState().activePlanet).toBe('projects')
  })

  it('toggles muted state', () => {
    act(() => useRideStore.getState().setMuted(false))
    expect(useRideStore.getState().muted).toBe(false)
  })
})


