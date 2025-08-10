import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Bounds } from '@react-three/drei';
import { Suspense } from 'react';
import Motorcycle from './Motorcycle.jsx';
import Rider from './Rider.jsx';

/**
 * Full-screen scene:
 * - Camera is framed for a side view of the motorcycle.
 * - Group is rotated so the motorcycle shows its side to the camera.
 * - Rider is rotated to face the camera.
 */
export default function HeroScene() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                shadows
                camera={{ position: [0, 1.5, 7], fov: 45, near: 0.1, far: 100 }}
            >
                <Suspense fallback={null}>
                    {/* Lighting */}
                    <hemisphereLight intensity={0.35} />
                    <directionalLight
                        position={[3, 5, 5]}
                        intensity={1.2}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    {/* Subtle reflections/ambient from an HDRI */}
                    <Environment preset="city" />

                    {/* Layout:
              - Rotate entire display so bike is side-on to camera.
              - Place rider ~left of bike, then rotate him to face camera.
           */}
                    <group rotation={[0, -Math.PI / 2, 0]}>
                        <Bounds fit clip observe margin={1.1}>
                            <Motorcycle position={[0, 0, 0]} />
                            <Rider position={[-1.6, 0, 0]} faceCamera />
                        </Bounds>
                    </group>

                    <ContactShadows
                        opacity={0.45}
                        scale={12}
                        blur={2.7}
                        far={6}
                        resolution={1024}
                        position={[0, -0.01, 0]}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
