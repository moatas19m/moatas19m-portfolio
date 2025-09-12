import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * SubtleCameraParallax (target nudge only)
 *
 * - Requires <OrbitControls makeDefault />
 * - DOES NOT move the camera.
 * - Reads current OrbitControls.target (set by ScrollAnimation) and gently nudges it
 *   based on mouse position, then rebases toward that moving target each frame.
 *
 * Mount this component AFTER <ScrollAnimation /> so it runs later in the frame.
 */
export default function SubtleCameraParallax({
                                                 strength = 0.12,                 // overall nudge amount (multiplier)
                                                 maxScreenDeflection = 1.0,        // clamp normalized mouse in [-1..1] per axis, scaled by this
                                                 rebase = 10,                      // how quickly baseTarget follows the live controls.target
                                                 damping = 10,                     // how quickly the nudge lerps onto controls.target
                                             }) {
    const { camera, gl } = useThree();
    const controls = useThree((s) => s.controls);

    const baseTarget = useRef(new THREE.Vector3());  // where we orbit around (follows live target)
    const initialized = useRef(false);

    // Normalized pointer in [-1, 1]
    const nx = useRef(0);
    const ny = useRef(0);

    useEffect(() => {
        const el = gl.domElement;
        if (!el) return;

        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            // normalized in [-1,1]
            const x = ((e.clientX - r.left) / r.width) * 2 - 1;
            const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
            // clamp and allow optional extra deflection range
            nx.current = THREE.MathUtils.clamp(x * maxScreenDeflection, -1, 1);
            ny.current = THREE.MathUtils.clamp(y * maxScreenDeflection, -1, 1);
        };

        el.addEventListener('pointermove', onMove, { passive: true });
        return () => el.removeEventListener('pointermove', onMove);
    }, [gl, maxScreenDeflection]);

    useEffect(() => {
        if (!controls || initialized.current) return;
        // Start from whatever ScrollAnimation last set
        baseTarget.current.copy(controls.target);
        initialized.current = true;
    }, [controls]);

    useFrame((_, dt) => {
        if (!initialized.current || !controls) return;

        // 1) Rebase: follow the live target set by ScrollAnimation (no hard lock)
        baseTarget.current.lerp(controls.target, 1 - Math.exp(-rebase * dt));

        // 2) Build a small offset in screen space (camera-right & camera-up)
        //    Scale by distance to keep effect consistent as user zooms.
        const dist = camera.position.distanceTo(baseTarget.current);
        const offsetUnits = dist * strength;

        // camera basis vectors
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
        const up    = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize();

        const offset = new THREE.Vector3()
            .addScaledVector(right, nx.current * offsetUnits)
            .addScaledVector(up,    ny.current * offsetUnits);

        // 3) Target to aim for = re-based target + tiny mouse offset
        const nudged = new THREE.Vector3().copy(baseTarget.current).add(offset);

        // 4) Apply only to controls.target (OrbitControls remains the sole camera boss)
        controls.target.lerp(nudged, 1 - Math.exp(-damping * dt));
        controls.update();
    });

    return null;
}