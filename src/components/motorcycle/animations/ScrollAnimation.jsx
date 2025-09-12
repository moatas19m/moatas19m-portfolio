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
                                            onSpeedChange,             // (speedScalar 0..1) => void
                                        }) {
    const { camera, gl } = useThree();
    const controls = useThree((s) => s.controls); // <-- OrbitControls (makeDefault) handle
    const target = useRef(new THREE.Vector3());   // lookAt target
    const camGoal = useRef(new THREE.Vector3());  // camera desired position
    const speedRef = useRef(0);                   // current speed (0..1)
    const tmpWorld = useRef(new THREE.Vector3());
    const tmpForward = useRef(new THREE.Vector3());
    const tmpUp = useRef(new THREE.Vector3(0,1,0));

    // Wheel-driven throttle (0..1), with inertia/decay
    const throttle = useRef(0);       // public-facing throttle used by the system
    const throttleTarget = useRef(0); // where we want to go
    const DECAY = 0.35;               // per-second decay toward 0 when idle
    const STEP = 0.12;                // wheel step size per notch (tweak to taste)
    const INVERT = -1;                // flip to +1 if you want wheel-up = faster

    useEffect(() => {
          // Canvas-specific wheel listener so the page never scrolls
              const onWheel = (e) => {
                // NOTE: passive:true means we won’t call preventDefault — fine because we disabled zoom on OrbitControls
                const delta = Math.sign(e.deltaY);        // -1, 0, +1
                throttleTarget.current += INVERT * delta * STEP;
                throttleTarget.current = Math.min(1, Math.max(0, throttleTarget.current));
              };
          const el = gl.domElement;
          el.addEventListener('wheel', onWheel, { passive: true });
          return () => el.removeEventListener('wheel', onWheel);
        }, [INVERT, gl.domElement]);

    useFrame((_, dt) => {
        const moto = motorcycleRef?.current;
        if (!moto) return;

          // Ease throttle toward target and apply idle decay
              // 1) decay target toward 0 if no wheel input
                  if (throttleTarget.current > 0) {
                throttleTarget.current = Math.max(0, throttleTarget.current - DECAY * dt * 0.5);
              }
          // 2) ease actual throttle toward target (smooth)
              throttle.current = THREE.MathUtils.damp(throttle.current, throttleTarget.current, accel, dt);
          const progress = throttle.current; // 0..1


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

        // 4) Smooth camera + controls target (OrbitControls is the single boss)
        camera.position.lerp(camGoal.current, 1 - Math.exp(-damping * dt));
        controls.target.lerp(target.current, 1 - Math.exp(-damping * dt));
        controls.update();

        // 5) Emit speed (0..1) for warp FX
        onSpeedChange?.(speedRef.current);
    });

    return null;
}