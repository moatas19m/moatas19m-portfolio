import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ScrollAnimation
 * - Smoothly moves camera behind+above the motorcycle as the user scrolls
 * - Moves the motorcycle forward
 * - Exposes a "speed" value via onSpeedChange for warp effects
 *
 * Usage:
 *   <ScrollAnimation
 *     motorcycleRef={motorcycleRef}
 *     followDistance={6}
 *     followHeight={2}
 *     maxSpeed={10}
 *     onSpeedChange={(s)=>setSpeed(s)}
 *   />
 *
 * Works in two modes:
 *  A) With Drei ScrollControls (recommended): pass `scrollOffset` (0..1)
 *  B) Plain page scroll: it reads window scroll and normalizes internally
 */
export default function ScrollAnimation({
                                            motorcycleRef,
                                            followDistance = 6,
                                            followHeight = 2,
                                            maxSpeed = 8,              // world units / sec at full scroll/velocity
                                            accel = 12,                // how quickly speed ramps toward target
                                            damping = 8,               // how quickly camera/target lerp
                                            scrollOffset,              // optional (0..1), if you use <ScrollControls>
                                            onSpeedChange,             // (speedScalar 0..1) => void
                                        }) {
    const { camera } = useThree();
    const target = useRef(new THREE.Vector3());   // lookAt target
    const camGoal = useRef(new THREE.Vector3());  // camera desired position
    const speedRef = useRef(0);                   // current speed (0..1)
    const tmpWorld = useRef(new THREE.Vector3());
    const tmpForward = useRef(new THREE.Vector3());
    const tmpUp = useRef(new THREE.Vector3(0,1,0));

    // Fallback: compute a normalized scroll fraction without Drei
    const pageProgressRef = useRef(0);
    useEffect(() => {
        if (typeof scrollOffset === 'number') return; // using controlled mode
        const onScroll = () => {
            const h = document.documentElement;
            const max = Math.max(1, h.scrollHeight - h.clientHeight);
            pageProgressRef.current = Math.min(1, Math.max(0, h.scrollTop / max));
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [scrollOffset]);

    useFrame((_, dt) => {
        const moto = motorcycleRef?.current;
        if (!moto) return;

        // 1) Determine desired "throttle" from scroll (0..1)
        const progress = typeof scrollOffset === 'number'
            ? THREE.MathUtils.clamp(scrollOffset, 0, 1)
            : pageProgressRef.current;

        // Smoothly ramp speed toward progress
        const targetSpeed = progress; // 0..1
        speedRef.current = THREE.MathUtils.damp(speedRef.current, targetSpeed, accel, dt);

        // 2) Move motorcycle forward along its local -Z (typical forward in glTF)
        //    If your bike faces +Z in your model, just flip the sign below.
        const move = maxSpeed * speedRef.current * dt;
        moto.translateZ(-move);

        // 3) Work out follow camera
        //    - Get motorcycle world position
        moto.getWorldPosition(tmpWorld.current);

        //    - Get motorcycle forward vector (its local -Z in world)
        tmpForward.current.set(0, 0, -1).applyQuaternion(moto.getWorldQuaternion(new THREE.Quaternion()));
        tmpForward.current.normalize();

        // Desired camera spot: behind the bike by followDistance, and raised by followHeight
        camGoal.current.copy(tmpWorld.current)
            .addScaledVector(tmpForward.current, -followDistance)
            .addScaledVector(tmpUp.current, followHeight);

        // Desired look target: a little in front of the bike
        target.current.copy(tmpWorld.current).addScaledVector(tmpForward.current, 2);

        // 4) Smooth camera lerp
        camera.position.lerp(camGoal.current, 1 - Math.exp(-damping * dt));
        camera.lookAt(target.current);

        // 5) Emit speed (0..1) for warp FX
        onSpeedChange?.(speedRef.current);
    });

    return null;
}