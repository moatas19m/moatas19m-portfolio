import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Subtle mouse parallax (target stays fixed):
 * - Requires <OrbitControls makeDefault />
 * - Only camera moves; target remains baseTarget
 * - Movement is angularly clamped so content never drifts off-screen
 */
export default function SubtleCameraParallax({
                                                 strength = 1,          // global multiplier for sensitivity
                                                 maxYaw = THREE.MathUtils.degToRad(9),   // horizontal cap (≈ 9°)
                                                 maxPitch = THREE.MathUtils.degToRad(6), // vertical cap (≈ 6°)
                                                 damping = 6,           // camera damping
                                                 lockTarget = true      // keep controls.target fixed to baseTarget
                                             }) {
    const { camera, gl } = useThree();
    const controls = useThree((s) => s.controls);

    const baseTarget = useRef(new THREE.Vector3(0, 1, 0));
    const baseOffsetDir = useRef(new THREE.Vector3()); // unit direction from target to camera
    const initialized = useRef(false);

    // Normalized pointer in [-1, 1]
    const nx = useRef(0);
    const ny = useRef(0);

    useEffect(() => {
        const el = gl.domElement;
        if (!el) return;

        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            // clamp to [-1, 1] so it "stops" at borders
            nx.current = Math.min(1, Math.max(-1, ((e.clientX - r.left) / r.width) * 2 - 1));
            ny.current = Math.min(1, Math.max(-1, -(((e.clientY - r.top) / r.height) * 2 - 1)));
        };

        el.addEventListener('pointermove', onMove, { passive: true });
        return () => el.removeEventListener('pointermove', onMove);
    }, [gl]);

    // Initialize once controls exist
    useEffect(() => {
        if (!controls || initialized.current) return;
        baseTarget.current.copy(controls.target);
        // initial direction from target to camera
        baseOffsetDir.current.copy(camera.position).sub(controls.target).normalize();
        initialized.current = true;
    }, [controls, camera]);

    useFrame((_, delta) => {
        if (!initialized.current || !controls) return;

        // Keep the target hard-locked if requested (prevents any drift)
        if (lockTarget) controls.target.copy(baseTarget.current);

        // Current distance (respects user zoom/dolly)
        const dist = camera.position.distanceTo(baseTarget.current);

        // Convert mouse to small yaw/pitch deltas, clamped
        const yaw = (nx.current * maxYaw) * strength;     // left/right
        const pitch = (ny.current * maxPitch) * strength; // up/down

        // Build a rotation around the base direction
        // Start from the original base direction each frame so it never accumulates
        const desiredDir = new THREE.Vector3().copy(baseOffsetDir.current);
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
        desiredDir.applyQuaternion(q).normalize();

        // Desired camera position = target + rotated direction * current distance
        const desiredPos = new THREE.Vector3()
            .copy(baseTarget.current)
            .addScaledVector(desiredDir, dist);

        // Damp camera towards desired position
        camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPos.x, damping, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPos.y, damping, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPos.z, damping, delta);

        // Ensure the camera keeps looking at the (fixed) target
        controls.update();
    });

    return null;
}