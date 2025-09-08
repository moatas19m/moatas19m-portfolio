import { useMemo, useRef, useEffect } from 'react';
// Placeholder for future custom shader usage
// import vert from '../../shaders/warpPoints.vert?raw'
// import frag from '../../shaders/warpPoints.frag?raw'
import { Color, BufferAttribute, AdditiveBlending, PointsMaterial, BufferGeometry } from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * GalaxyBackground
 *
 * Props (sane defaults):
 * - count: number of stars
 * - size: star size (world units)
 * - radius: overall galaxy radius
 * - branches: spiral arms
 * - spin: spiral tightness (r * spin)
 * - randomness: jitter factor
 * - randomnessPower: how noise falls off (1 = linear, 2 = more centralized)
 * - insideColor, outsideColor: hex strings or three Color-compatible
 * - fadeIn: seconds to gently ramp size from 0 -> size
 * - rotationSpeed: radians/sec to auto-rotate whole galaxy
 *
 * Tip: For background, keep count moderate (e.g., 15k–60k). 300k looks gorgeous but is heavy.
 */
export default function GalaxyBackground({
                                             count = 60000,
                                             size = 0.05,
                                             radius = 12,
                                             branches = 4,
                                             spin = 1.2,
                                             randomness = 0.9,
                                             randomnessPower = 1.4,
                                             insideColor = '#ff6030',
                                             outsideColor = '#1b3984',
                                             fadeIn = 0.8,
                                             rotationSpeed = 0.08, // radians/sec
                                             position = [0, 0, 0],
                                             ...props
                                         }) {
    const pointsRef = useRef();
    const groupRef = useRef();

    // Build geometry attributes (positions + colors)
    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const cIn = new Color(insideColor);
        const cOut = new Color(outsideColor);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // distance from center
            const r = Math.random() * radius;

            // branch & spin
            const branchIndex = i % branches;
            const branchAngle = (branchIndex / branches) * Math.PI * 2;
            const spinAngle = r * spin;

            // randomness with bias
            const rand = () =>
                Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? -1 : 1) * randomness * r;

            const randomX = rand();
            const randomY = rand();
            const randomZ = rand();

            positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

            // color gradient center → edge
            const mixed = cIn.clone().lerp(cOut, r / radius);
            colors[i3] = mixed.r;
            colors[i3 + 1] = mixed.g;
            colors[i3 + 2] = mixed.b;
        }
        return { positions, colors };
    }, [count, radius, branches, spin, randomness, randomnessPower, insideColor, outsideColor]);

    // Create material + geometry; dispose on unmount
    const { material, geometry } = useMemo(() => {
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(positions, 3));
        geometry.setAttribute('color', new BufferAttribute(colors, 3));

        const material = new PointsMaterial({
            color: "#9359ee",
            size,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            blending: AdditiveBlending,
            vertexColors: true,
        });

        return { material, geometry };
        // material depends on size only (other props baked into attributes)
    }, [positions, colors, size]);

    // Fade-in (size ramp) for a little polish
    useFrame((state, dt) => {
        if (!material) return;
        if (fadeIn > 0 && material.size < size) {
            material.size = Math.min(size, material.size + (size / fadeIn) * dt);
        }
    });

    // Auto-rotate the whole galaxy
    useFrame((_, dt) => {
        if (groupRef.current && rotationSpeed !== 0) {
            groupRef.current.rotation.y += rotationSpeed * dt;
        }
    });

    // Clean-up
    useEffect(() => {
        return () => {
            geometry?.dispose();
            material?.dispose();
        };
    }, [geometry, material]);

    return (
        <group ref={groupRef} position={position} {...props}>
            <points ref={pointsRef} geometry={geometry} material={material} />
        </group>
    );
}