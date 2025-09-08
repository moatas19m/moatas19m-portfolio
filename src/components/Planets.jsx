import { useMemo, useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshStandardMaterial, Color, TorusGeometry, SphereGeometry } from 'three'
import { useRideStore } from '../state/useRideStore.js'

export default function Planets() {
  const rootRef = useRef()
  const [hovered, setHovered] = useState(null)
  const phase = useRideStore((s) => s.phase)
  const setPhase = useRideStore((s) => s.setPhase)
  const setActivePlanet = useRideStore((s) => s.setActivePlanet)
  const setCurrentTargetIdx = useRideStore((s) => s.setCurrentTargetIdx)
  const setSpeedBoost = useRideStore((s) => s.setSpeedBoost)
  const lastRetargetAt = useRideStore((s) => s.lastRetargetAt)
  const setLastRetargetAt = useRideStore((s) => s.setLastRetargetAt)
  const boostToken = useRideStore((s) => s.boostToken)
  const setBoostToken = useRideStore((s) => s.setBoostToken)

  // Planet materials (memoized)
  const materials = useMemo(() => {
    return {
      projects: new MeshStandardMaterial({ color: new Color('#89c2ff'), emissive: new Color('#2dd4bf'), emissiveIntensity: 0.08, metalness: 0.7, roughness: 0.25 }),
      experience: new MeshStandardMaterial({ color: new Color('#9ca3af'), emissive: new Color('#111827'), emissiveIntensity: 0.06, metalness: 0.4, roughness: 0.9 }),
      skills: new MeshStandardMaterial({ color: new Color('#c084fc'), emissive: new Color('#7c3aed'), emissiveIntensity: 0.1, metalness: 0.85, roughness: 0.2 }),
      contact: new MeshStandardMaterial({ color: new Color('#fca5a5'), emissive: new Color('#ef4444'), emissiveIntensity: 0.08, metalness: 0.3, roughness: 0.6 }),
    }
  }, [])

  // Shared geometries for spheres and rings
  const geoms = useMemo(() => {
    return {
      sphereSm: new SphereGeometry(0.6, 32, 32),
      sphereMd: new SphereGeometry(0.7, 32, 32),
      sphereLg: new SphereGeometry(0.8, 32, 32),
      sphereXL: new SphereGeometry(0.9, 32, 32),
      ringOuter: new TorusGeometry(0.69, 0.03, 16, 48),
      ringInner: new TorusGeometry(0.86, 0.035, 16, 48),
      cloud: new SphereGeometry(0.92, 24, 24),
    }
  }, [])

  const ringMaterial = useMemo(() => new MeshStandardMaterial({ color: new Color('#93c5fd'), emissive: new Color('#22d3ee'), emissiveIntensity: 0.12, metalness: 0.65, roughness: 0.35, toneMapped: true }), [])
  useFrame((_, delta) => {
    if (rootRef.current) {
      rootRef.current.rotation.y += delta * 0.005
    }
    // subtle emissive pulse on hover
    const pulse = 0.02 * Math.sin(performance.now() * 0.004)
    if (hovered && materials[hovered]) {
      materials[hovered].emissiveIntensity = Math.max(0, (materials[hovered].emissiveIntensity || 0.08) + pulse)
    }
  })

  const RETARGET_DEBOUNCE_MS = 300
  // Speed boost is applied as (1 + speedBoost) in input handlers; so 0.6 => 1.6x
  const BOOST_MULT = 0.6
  const BOOST_MS = 800

  const handleClick = useCallback((id, targetIdx) => {
    setActivePlanet(id)
    if (phase === 'Idle') {
      setPhase('Starting')
      return
    }
    if (phase !== 'Riding') return
    if (typeof targetIdx !== 'number') return

    const now = performance.now()
    if (now - lastRetargetAt < RETARGET_DEBOUNCE_MS) return

    setCurrentTargetIdx(targetIdx)
    setLastRetargetAt(now)

    // Token to ensure only the latest boost timeout wins
    const newToken = boostToken + 1
    setBoostToken(newToken)
    setSpeedBoost(BOOST_MULT)
    setTimeout(() => {
      // Only reset if token matches (prevents older timeouts from overriding newer boosts)
      const { boostToken: latestToken, setSpeedBoost: _setSpeedBoost } = useRideStore.getState()
      if (latestToken === newToken) _setSpeedBoost(0)
    }, BOOST_MS)
  }, [phase, lastRetargetAt, boostToken, setActivePlanet, setPhase, setCurrentTargetIdx, setLastRetargetAt, setBoostToken, setSpeedBoost])

  return (
    <group ref={rootRef} name="PlanetsRoot">
      {/* Projects (idx 1) */}
      <mesh
        position={[8, 1.2, -8]}
        material={materials.projects}
        onPointerOver={() => setHovered('projects')}
        onPointerOut={() => setHovered(null)}
        onPointerDown={(e) => { e.stopPropagation(); handleClick('projects', 1) }}
      >
        <primitive object={geoms.sphereSm} attach="geometry" />
      </mesh>
      {/* Neon rings */}
      <mesh position={[8, 1.2, -8]} rotation={[Math.PI / 3, 0, 0]} material={ringMaterial} frustumCulled>
        <primitive object={geoms.ringOuter} attach="geometry" />
      </mesh>
      <mesh position={[8, 1.2, -8]} rotation={[-Math.PI / 4, Math.PI / 7, 0]} material={ringMaterial} frustumCulled>
        <primitive object={geoms.ringInner} attach="geometry" />
      </mesh>

      {/* Work Experience (idx 2) */}
      <mesh
        position={[10, 0.8, -12]}
        material={materials.experience}
        onPointerOver={() => setHovered('experience')}
        onPointerOut={() => setHovered(null)}
        onPointerDown={(e) => { e.stopPropagation(); handleClick('experience', 2) }}
      >
        <primitive object={geoms.sphereLg} attach="geometry" />
      </mesh>

      {/* Skills (idx 3) */}
      <mesh
        position={[12, 1.6, -16]}
        material={materials.skills}
        onPointerOver={() => setHovered('skills')}
        onPointerOut={() => setHovered(null)}
        onPointerDown={(e) => { e.stopPropagation(); handleClick('skills', 3) }}
      >
        <primitive object={geoms.sphereMd} attach="geometry" />
      </mesh>

      {/* Contact (idx 4) */}
      <mesh
        position={[14, 0.6, -20]}
        material={materials.contact}
        onPointerOver={() => setHovered('contact')}
        onPointerOut={() => setHovered(null)}
        onPointerDown={(e) => { e.stopPropagation(); handleClick('contact', 4) }}
      >
        <primitive object={geoms.sphereXL} attach="geometry" />
      </mesh>
      {/* Cloud shell */}
      <mesh position={[14, 0.6, -20]} frustumCulled>
        <primitive object={geoms.cloud} attach="geometry" />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}


