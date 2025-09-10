import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, PointsMaterial, Color, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * WarpStars
 * - A lightweight "streak-like" starfield that accelerates with `speed` (0..1).
 * - When speed ~0, stars barely move; when speed ~1, stars rush by the camera.
 *
 * Props:
 *   count: number of particles
 *   spread: half-extent of spawn cube
 *   baseSize: point size at rest
 *   maxSize: point size at full warp
 *   speed: scalar 0..1 from ScrollAnimation
 *   color: star color
 */
export default function WarpStars({
                                      count = 8000,
                                      spread = 80,
                                      baseSize = 0.02,
                                      maxSize = 0.08,
                                      speed = 0,
                                      color = '#cfe6ff',
                                      opacity = 0.9,
                                  }) {
    const points = useRef();
    const positions = useMemo(() => new Float32Array(count * 3), [count]);
    const velocities = useMemo(() => new Float32Array(count), [count]); // per-star drift

    // Spawn stars randomly in a cube, bias z so most are "ahead"
    useEffect(() => {
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3 + 0] = (Math.random() * 2 - 1) * spread;
            positions[i3 + 1] = (Math.random() * 2 - 1) * spread * 0.6;
            positions[i3 + 2] = -Math.random() * spread * 2 - 4; // mostly in front of camera
            velocities[i] = 2 + Math.random() * 8;               // base drift
        }
    }, [count, positions, velocities, spread]);

    const geometry = useMemo(() => {
        const g = new BufferGeometry();
        g.setAttribute('position', new BufferAttribute(positions, 3));
        return g;
    }, [positions]);

    const material = useMemo(() => {
        const m = new PointsMaterial({
            size: baseSize,
            color,
            transparent: true,
            opacity,
            depthWrite: false,
            blending: AdditiveBlending,
        });
        return m;
    }, [baseSize, color, opacity]);

    // Animate forward rush toward camera (positive z), wrap when behind
    useFrame((_, dt) => {
        if (!points.current) return;
        const pos = geometry.attributes.position.array;
        const warpBoost = 8 * speed * speed + speed * 2; // curved response feels better
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            pos[i3 + 2] += (velocities[i] + warpBoost) * dt; // move toward camera
            // If it goes past camera, respawn far ahead
            if (pos[i3 + 2] > 2) {
                pos[i3 + 0] = (Math.random() * 2 - 1) * spread;
                pos[i3 + 1] = (Math.random() * 2 - 1) * spread * 0.6;
                pos[i3 + 2] = -spread * (1.5 + Math.random() * 1.5);
                velocities[i] = 2 + Math.random() * 8;
            }
        }
        geometry.attributes.position.needsUpdate = true;

        // Size & opacity react to speed
        material.size = baseSize + (maxSize - baseSize) * speed;
        material.opacity = Math.min(1, 0.15 + opacity * (0.2 + speed));
    });

    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    return <points ref={points} geometry={geometry} material={material} />;
}