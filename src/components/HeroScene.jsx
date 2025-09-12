import {Canvas} from '@react-three/fiber';
import {Environment, ContactShadows, OrbitControls, Bounds} from '@react-three/drei';
import {Suspense, useRef, useState} from 'react';
import Motorcycle from './motorcycle/Motorcycle.jsx';
import Rider from './rider/Rider.jsx';
import GalaxyBackground from "./background/GalaxyBackground.jsx";
import SubtleCameraParallax from "../utils/SubtleCameraParallax.jsx";
import WarpTunnel from "./background/animations/WarpTunnel.jsx";
import ScrollAnimation from "./motorcycle/animations/ScrollAnimation.jsx";

// function CameraLogger({ controlsRef }) {
//     const { camera, gl } = useThree(); // safe: inside <Canvas/>
//     useEffect(() => {
//         const onDown = (e) => {
//             if (e.button !== 0) return; // left click only
//             if (!controlsRef.current) return;
//             console.log('📷 Camera position:', camera.position.toArray());
//             console.log('🎯 Camera target:', controlsRef.current.target.toArray());
//         };
//         gl.domElement.addEventListener('pointerdown', onDown);
//         return () => gl.domElement.removeEventListener('pointerdown', onDown);
//     }, [camera, gl, controlsRef]);
//     return null;
// }

export default function HeroScene() {

    const controlsRef = useRef();
    const motorcycleRef = useRef();
    const [warpSpeed, setWarpSpeed] = useState(0);

    return (
        <div className="fixed inset-0 z-50" style={{ pointerEvents: 'auto' }}>
            <Canvas
                shadows
                camera={{ position: [0, 3, 10], fov: 55, near: 0.5, far: 100 }}
            >
                <Suspense fallback={null}>
                    {/* Debug controls */}
                    <OrbitControls
                        ref={controlsRef}
                        makeDefault={true}
                        target={[-0.7, 3.6, 0]}
                        enablePan={false}
                        enableRotate={false}
                        enableZoom={false}   // <- important so wheel doesn’t zoom the camera
                        enableDamping
                        dampingFactor={0.1}
                        minDistance={3}
                        maxDistance={8}
                    />

                    {/*<CameraLogger controlsRef={controlsRef} />*/}

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
                    <group>
                        <Bounds>
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
                                warp={warpSpeed}
                            />

                            <WarpTunnel speed={warpSpeed} intensity={0.6} color1="#a7d3ff" color2="#6aa8ff" noiseAmp={0.9} />

                            <group ref={motorcycleRef}>
                                <Motorcycle position={[-1.2, 0.8, 1.2]} rotation={[0, Math.PI / 9, 0]}/>
                                <Rider position={[-0.5, 0, -0.8]} rotation={[0, Math.PI / 2, 0]} scale={1.2}/>
                            </group>
                        </Bounds>
                    </group>

                    {/* Scroll-driven motion + camera follow; emits warpSpeed 0..1 */}
                    <ScrollAnimation
                    motorcycleRef={motorcycleRef}
                    followDistance={7}
                    followHeight={2.2}
                    maxSpeed={4}
                    onSpeedChange={setWarpSpeed}
                    />

                    <SubtleCameraParallax
                        strength={0.12}            // try 0.08 – 0.18
                        maxScreenDeflection={0.1}
                        rebase={10}
                        damping={10}
                    />

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