import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Subtle mouse parallax:
 * - Requires <OrbitControls makeDefault />
 * - Reads mouse from renderer.domElement to avoid overlay/event issues
 */
export default function SubtleCameraParallax({ strength = 0.12, rebaseEps = 0.001 }) {
    const { camera, gl } = useThree();
    const controls = useThree((s) => s.controls); // set by <OrbitControls makeDefault />
    const baseTarget = useRef(new THREE.Vector3(0, 1, 0));
    const baseOffset = useRef(new THREE.Vector3());
    const initialized = useRef(false);

    // Manual normalized pointer ([-1,1] range)
    const nx = useRef(0);
    const ny = useRef(0);

    // Attach a precise listener to the canvas element
    useEffect(() => {
        const el = gl.domElement;
        if (!el) return;

        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            // normalize to [-1, 1] with (0,0) = center of canvas
            nx.current = ((e.clientX - r.left) / r.width) * 2 - 1;
            ny.current = -(((e.clientY - r.top) / r.height) * 2 - 1);
        };

        el.addEventListener('pointermove', onMove, { passive: true });
        return () => el.removeEventListener('pointermove', onMove);
    }, [gl]);

    // Initialize after controls exist
    useEffect(() => {
        if (controls && !initialized.current) {
            baseTarget.current.copy(controls.target);
            baseOffset.current.copy(camera.position).sub(controls.target);
            initialized.current = true;
        }
    }, [controls, camera]);

    useFrame((_, delta) => {
        if (!initialized.current || !controls) return;

        const t = controls.target;

        // Rebase if external changes (e.g., Bounds) moved camera/target
        const expectedCam = new THREE.Vector3().copy(t).add(baseOffset.current);
        if (expectedCam.distanceTo(camera.position) > rebaseEps * Math.max(1, camera.position.length())) {
            baseTarget.current.copy(t);
            baseOffset.current.copy(camera.position).sub(t);
        }

        // Subtle offsets from our manual pointer
        const offX = nx.current * strength * 0.5;
        const offY = ny.current * strength * 0.3;

        // Damp target first
        const desiredTargetX = baseTarget.current.x + offX;
        const desiredTargetY = baseTarget.current.y + offY;
        t.x = THREE.MathUtils.damp(t.x, desiredTargetX, 6, delta);
        t.y = THREE.MathUtils.damp(t.y, desiredTargetY, 6, delta);

        // Keep camera at the same offset relative to target
        const desiredCamX = t.x + baseOffset.current.x;
        const desiredCamY = t.y + baseOffset.current.y;
        const desiredCamZ = t.z + baseOffset.current.z;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredCamX, 6, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredCamY, 6, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredCamZ, 6, delta);

        controls.update(); // apply damping
    });

    return null;
}