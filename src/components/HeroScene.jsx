import { Canvas } from '@react-three/fiber';
import {Environment, ContactShadows, OrbitControls, Bounds, Stars} from '@react-three/drei';
import { Suspense } from 'react';
import BikeWithRiderBones from "./BikeWithRiderBones.jsx";
import GalaxyBackground from "./background/GalaxyBackground.jsx";

export default function HeroScene() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                shadows
                camera={{ position: [0, 2.2, 4.8], fov: 30, near: 0.5, far: 100 }}
            >
                <Suspense fallback={null}>
                    {/* Debug controls */}
                    <OrbitControls
                        target={[0, 1, 0]}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.1}
                        minDistance={3}
                        maxDistance={8}
                    />

                    {/* Lights */}
                    <hemisphereLight intensity={0.35} />
                    <directionalLight
                        position={[3, 5, 5]}
                        intensity={5.2}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    {/* Environment reflections */}
                    <Environment preset="city" />
                    <Stars radius={100} depth={50} count={8000} factor={2} saturation={1} fade />

                    {/* Debug helpers */}
                    {/*<gridHelper args={[100, 100]} />*/}
                    {/*<axesHelper args={[5]} />*/}

                    {/* Background galaxy */}
                    <GalaxyBackground
                        count={200000}
                        size={0.01}
                        radius={16}
                        branches={3}
                        spin={1.1}
                        randomness={1}
                        randomnessPower={3}
                        insideColor="#ffd28a"
                        outsideColor="#4563ff"
                        fadeIn={0.6}
                        rotationSpeed={0.04}
                    />

                    {/* Bike + Rider (bones posing, no clips) */}
                    <BikeWithRiderBones
                        mountDelay={0.35}
                        poseDuration={0.8}
                        driveDelay={0.95}
                        driveDuration={3.0}
                    />


                    {/* Ground contact shadows */}
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