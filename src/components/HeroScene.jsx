import { Canvas } from '@react-three/fiber';
import {Environment, ContactShadows, OrbitControls, Bounds} from '@react-three/drei';
import { Suspense } from 'react';
import Motorcycle from './motorcycle/Motorcycle.jsx';
import Rider from './rider/Rider.jsx';
import GalaxyBackground from "./background/GalaxyBackground.jsx";
import SubtleCameraParallax from "../utils/SubtleCameraParallax.jsx";

export default function HeroScene() {
    return (
        <div className="fixed inset-0 z-50" style={{ pointerEvents: 'auto' }}>
            <Canvas
                shadows
                camera={{ position: [0, 2.2, 4.8], fov: 60, near: 0.5, far: 100 }}
            >
                <Suspense fallback={null}>
                    {/* Debug controls */}
                    <OrbitControls
                        makeDefault={true}
                        target={[0, 1, 0]}
                        enablePan={true}
                        panSpeed={0.1}
                        enableDamping
                        dampingFactor={0.1}
                        minDistance={3}
                        maxDistance={8}
                    />

                    <SubtleCameraParallax strength={0.2}/>

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

                    {/* Debug helpers */}
                    {/*<gridHelper args={[100, 100]} />*/}
                    {/*<axesHelper args={[5]} />*/}

                    {/* Models */}
                    <group rotation={[0, -Math.PI / 2, 0]}>
                        <Bounds fit observe margin={1.1}>
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
                            <Motorcycle position={[-1.2, 0.8, 1.2]} rotation={[0, Math.PI / 9, 0]}/>
                            <Rider position={[0.7, 0, -0.8]} rotation={[0, Math.PI / 2, 0]} scale={1}/>
                        </Bounds>
                    </group>

                    {/* Ground contact shadows */}
                    <ContactShadows
                        opacity={0.05}
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