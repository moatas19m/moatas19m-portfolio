import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {Environment, ContactShadows, OrbitControls, Bounds, Html} from '@react-three/drei';
import { Suspense, useEffect, useRef, useCallback, useState } from 'react';
import { Vector3 } from 'three';
import Motorcycle from './motorcycle/Motorcycle.jsx';
import Rider from './rider/Rider.jsx';
import GalaxyBackground from "./background/GalaxyBackground.jsx";
import Planets from './Planets.jsx';
import { logShaderLengths } from '../debug/shaderCheck.js';
import { useRideStore, selectPhase, selectProgress, selectSpeedBoost, selectCurrentTargetIdx, selectPrefersReducedMotion } from '../state/useRideStore.js';

export default function HeroScene() {
    const phase = useRideStore(selectPhase);
    const progress = useRideStore(selectProgress);
    const setPhase = useRideStore((s) => s.setPhase);
    const setProgress = useRideStore((s) => s.setProgress);
    const speedBoost = useRideStore(selectSpeedBoost);
    const currentTargetIdx = useRideStore(selectCurrentTargetIdx);
    const setSpeedBoost = useRideStore((s) => s.setSpeedBoost);
    const setCurrentTargetIdx = useRideStore((s) => s.setCurrentTargetIdx);
    const prefersReducedMotion = useRideStore(selectPrefersReducedMotion);

    const startedRef = useRef(false);
    const wheelAccumRef = useRef(0);
    const touchStartYRef = useRef(null);
    const bikeRigRef = useRef();
    const tRef = useRef(0);
    const zTargets = useRef([0, -25, -48, -70, -92]);
    
    // Debug overlay state
    const [debugInfo, setDebugInfo] = useState({
        phase: 'Idle',
        progress: 0,
        segment: 0,
        localU: 0,
        bikeZ: 0,
        currentTargetIdx: null,
        speedBoost: 0
    });

    // Camera controller component
    function CameraController({ bikeRigRef }) {
        const { camera } = useThree();
        const isLockedRef = useRef(false);
        const tmpVec3 = useRef(new Vector3());
        
        // Reset lock when leaving ZoomedOut
        useEffect(() => {
            if (phase !== 'ZoomedOut') {
                isLockedRef.current = false;
            }
        }, [phase]);

        useFrame((state, delta) => {
            if (!bikeRigRef.current) return;
            
            const bike = bikeRigRef.current;
            const bikeWorldPos = bike.getWorldPosition(tmpVec3.current);
            
            // Follow during Riding/Arriving phases
            if ((phase === 'Riding' || phase === 'Arriving') && !isLockedRef.current) {
                const desired = bikeWorldPos.clone().add(new Vector3(0, 1.8, 5.5));
                const followSpeed = prefersReducedMotion ? 1 : 6; // instant snap if reduced motion
                const alpha = prefersReducedMotion ? 1 : (1 - Math.exp(-followSpeed * delta));
                camera.position.lerp(desired, alpha);
                camera.lookAt(bikeWorldPos.x, 1.4, bikeWorldPos.z - 2);
            }
            
            // ZoomedOut transition
            if (phase === 'ZoomedOut') {
                const targetPos = bikeWorldPos.clone().add(new Vector3(0, 6, 14));
                const zoomSpeed = prefersReducedMotion ? 1 : 4;
                const alphaZoom = prefersReducedMotion ? 1 : (1 - Math.exp(-zoomSpeed * delta));
                
                camera.position.lerp(targetPos, alphaZoom);
                
                // Animate FOV to 50
                const targetFov = 50;
                const currentFov = camera.fov;
                const deltaFov = targetFov - currentFov;
                if (Math.abs(deltaFov) > 0.01) {
                    camera.fov += deltaFov * alphaZoom;
                    camera.updateProjectionMatrix();
                }
                
                camera.lookAt(0, 1.4, bikeWorldPos.z - 2);
                
                // Lock when settled
                const distance = camera.position.distanceTo(targetPos);
                if (distance < 0.05 && Math.abs(deltaFov) < 0.1) {
                    isLockedRef.current = true;
                }
            }
        });

        return null;
    }

    // cubic ease-in-out for smooth mapping
    const easeInOutCubic = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

    // Map normalized progress [0..1] → segment idx and local u, then to Z
    const mapProgressToZ = useCallback((t) => {
        const targets = zTargets.current;
        const segments = targets.length - 1;
        if (segments <= 0) return targets[0] || 0;
        // if retargeted, bias progress towards that segment boundary
        const segFloatBase = t * segments;
        let segFloat = segFloatBase;
        if (Number.isInteger(currentTargetIdx)) {
            const idx = Math.max(0, Math.min(segments - 1, currentTargetIdx));
            // gently pull segFloat towards idx boundary
            const pull = 0.15; // small bias
            segFloat = segFloatBase * (1 - pull) + idx * pull;
        }
        const i = Math.max(0, Math.min(segments - 1, Math.floor(segFloat)));
        const uLocal = segFloat - i; // 0..1 within segment
        const uSmooth = easeInOutCubic(uLocal);
        const z0 = targets[i];
        const z1 = targets[i + 1];
        return z0 + (z1 - z0) * uSmooth;
    }, [currentTargetIdx]);

    const ensureStart = useCallback(() => {
        if (!startedRef.current && phase === 'Idle') {
            startedRef.current = true;
            setPhase('Starting');
        }
    }, [phase, setPhase]);

    // Normalize wheel delta to a small progress step
    const onWheel = useCallback((e) => {
        const delta = e.deltaY;
        if (delta === 0) return;
        ensureStart();
        // empirically chosen divisor to slow progress, with boost multiplier
        const base = Math.max(-0.05, Math.min(0.05, delta / 1200));
        const step = base * (1 + speedBoost);
        wheelAccumRef.current = Math.max(0, Math.min(1, progress + step));
        setProgress(wheelAccumRef.current);
    }, [ensureStart, progress, setProgress, speedBoost]);

    const onTouchStart = useCallback((e) => {
        if (e.touches && e.touches.length > 0) {
            touchStartYRef.current = e.touches[0].clientY;
        }
    }, []);

    const onTouchMove = useCallback((e) => {
        if (!e.touches || e.touches.length === 0) return;
        const y = e.touches[0].clientY;
        if (touchStartYRef.current == null) {
            touchStartYRef.current = y;
            return;
        }
        const dy = touchStartYRef.current - y; // swipe up -> positive
        if (dy !== 0) ensureStart();
        const base = Math.max(-0.05, Math.min(0.05, dy / 600));
        const step = base * (1 + speedBoost);
        wheelAccumRef.current = Math.max(0, Math.min(1, progress + step));
        setProgress(wheelAccumRef.current);
    }, [ensureStart, progress, setProgress, speedBoost]);

    useEffect(() => {
        // Attach once with stable handlers
        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        if (import.meta.env.DEV) {
            try { logShaderLengths(); } catch (_) {}
        }
        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, [onWheel, onTouchStart, onTouchMove]);

    // Per-frame motion: update BikeRig along -Z with subtle bobbing
    useFrame((state, delta) => {
        tRef.current += delta;
        const rig = bikeRigRef.current;
        if (!rig) return;

        // Position Z from progress mapping
        const z = mapProgressToZ(progress);
        rig.position.z = z;
        
        // Update debug info
        const targets = zTargets.current;
        const segments = targets.length - 1;
        const segFloat = progress * segments;
        const segment = Math.max(0, Math.min(segments - 1, Math.floor(segFloat)));
        const localU = segFloat - segment;
        
        setDebugInfo({
            phase,
            progress: Math.round(progress * 1000) / 1000,
            segment,
            localU: Math.round(localU * 1000) / 1000,
            bikeZ: Math.round(z * 100) / 100,
            currentTargetIdx,
            speedBoost: Math.round(speedBoost * 100) / 100
        });
        
        // Console warnings for bounds checking
        if (import.meta.env.DEV) {
            if (progress < 0 || progress > 1) {
                console.warn(`Progress out of bounds: ${progress}`);
            }
            if (segment < 0 || segment >= segments) {
                console.warn(`Segment out of bounds: ${segment} (max: ${segments - 1})`);
            }
        }

        // Subtle bobbing on x/y while riding
        if (phase === 'Riding' || phase === 'Starting') {
            const bob = 0.015;
            rig.position.x = Math.sin(tRef.current * 1.3) * bob;
            rig.position.y = Math.sin(tRef.current * 0.9 + 1) * bob * 0.6;
        } else {
            rig.position.x = 0;
            rig.position.y = 0;
        }

        // Simple phase transitions: Starting → Riding on first movement
        if (phase === 'Starting' && progress > 0.01) {
            setPhase('Riding');
        }

        // Arrival heuristic at any target (including final)
        const targets = zTargets.current;
        for (let idx = 0; idx < targets.length; idx++) {
            if (Math.abs(z - targets[idx]) < 0.25 && (phase === 'Riding' || phase === 'Starting')) {
                setPhase('Arriving');
                setSpeedBoost(0);
                setCurrentTargetIdx(null);
                // After a brief arrival, transition to ZoomedOut
                setTimeout(() => {
                    setPhase('ZoomedOut');
                }, 500);
                break;
            }
        }
    });

    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                shadows
                camera={{ position: [0, 2.2, 8], fov: 45, near: 0.1, far: 200 }}
            >
                <Suspense fallback={null}>
                    {/* Background & fog */}
                    <color attach="background" args={["#05060a"]} />
                    <fog attach="fog" args={["#05060a", 15, 120]} />
                    {/* Camera controller */}
                    <CameraController bikeRigRef={bikeRigRef} />
                    
                    {/* Debug overlay */}
                    {import.meta.env.DEV && (
                        <Html position={[0, 0, 0]} center>
                            <div style={{
                                position: 'fixed',
                                top: '10px',
                                left: '10px',
                                background: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                zIndex: 1000,
                                minWidth: '200px'
                            }}>
                                <div><strong>Debug Info</strong></div>
                                <div>Phase: {debugInfo.phase}</div>
                                <div>Progress: {debugInfo.progress}</div>
                                <div>Segment: {debugInfo.segment}</div>
                                <div>Local U: {debugInfo.localU}</div>
                                <div>Bike Z: {debugInfo.bikeZ}</div>
                                <div>Target Idx: {debugInfo.currentTargetIdx ?? 'null'}</div>
                                <div>Speed Boost: {debugInfo.speedBoost}</div>
                            </div>
                        </Html>
                    )}
                    
                    {/* Debug controls */}
                    <OrbitControls
                        target={[0, 1, 0]}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.05}
                        enableZoom={false}
                        minPolarAngle={0.9}
                        maxPolarAngle={1.4}
                        minAzimuthAngle={-0.6}
                        maxAzimuthAngle={0.6}
                        enabled={phase === 'Idle' || phase === 'ZoomedOut'}
                    />

                    {/* Lights (per PRD) */}
                    <ambientLight intensity={0.35} />
                    <directionalLight position={[6, 8, 5]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />

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
                            <Planets />
                            {/* BikeRig translates forward along -Z based on progress */}
                            <group ref={bikeRigRef} position={[0, 0, 0]}>
                                <Motorcycle position={[-1.2, 0, 1.2]} rotation={[0, Math.PI / 9, 0]}/>
                                <Rider position={[0.7, 0, -0.8]} rotation={[0, Math.PI / 2, 0]} scale={1}/>
                            </group>
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