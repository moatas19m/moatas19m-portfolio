import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Planets() {
  const rootRef = useRef()
  useFrame((_, delta) => {
    if (rootRef.current) {
      rootRef.current.rotation.y += delta * 0.005
    }
  })

  return (
    <group ref={rootRef} name="PlanetsRoot">
      {/* Placeholder spheres; to be styled per PRD */}
      <mesh position={[8, 1.2, -8]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#7dd3fc" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[10, 0.8, -12]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#a3a3a3" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[12, 1.6, -16]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#c084fc" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[14, 0.6, -20]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#fca5a5" emissiveIntensity={0.1} />
      </mesh>
    </group>
  )
}


