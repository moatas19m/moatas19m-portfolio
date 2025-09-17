// src/components/Planet.jsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial, MeshPhysicalMaterial, Color, AdditiveBlending } from 'three';
import { Html } from '@react-three/drei';
import CraterMarsMaterial from "./materials/CraterMarsMaterial.jsx";

/**
 * Planet
 * - name: label / debugging id
 * - type: 'mars' | 'saturn' | 'ice' | 'hot' (decides material presets)
 * - radius: sphere radius
 * - position: [x,y,z]
 * - rotationSpeed: radians/sec (slow)
 * - axialTilt: radians (planet lean)
 * - ringOpts: { innerRadius, outerRadius, color, opacity } (saturn only)
 * - onClick: callback(name)
 * - label: optional short label to show
 */
export default function Planet({
                                   name = 'Planet',
                                   type = 'mars',
                                   radius = 0.8,
                                   position = [0, 0, 0],
                                   rotationSpeed = 0.01,
                                   axialTilt = 0.3,
                                   ringOpts = null,
                                   onClick,
                                   label,
                               }) {
    const meshRef = useRef();
    const matRef = useRef();

    // const { material, color, emissiveBase, roughness, metalness, clearcoat, transmission, envIntensity } =
    const { material } =
        useMemo(() => {
            // baseline
            let cfg = {
                color: new Color('#c1440e'), // marsy red
                emissiveBase: new Color('#000000'),
                roughness: 0.8,
                metalness: 0.05,
                clearcoat: 0.0,
                transmission: 0.0,
                envIntensity: 10,
                materialClass: MeshStandardMaterial,
            };

            if (type === 'mars') {
                cfg.color = new Color('#b5532d');
                cfg.roughness = 0.9;
            } else if (type === 'saturn') {
                cfg.color = new Color('#c9b37e');
                cfg.roughness = 0.7;
                cfg.metalness = 0.05;
            } else if (type === 'ice') {
                cfg.color = new Color('#cfe8ff');
                cfg.roughness = 0.2;
                cfg.metalness = 0.0;
                cfg.clearcoat = 1.0;
                cfg.transmission = 0.25; // subtle translucency
                cfg.envIntensity = 1.0;
                cfg.materialClass = MeshPhysicalMaterial;
            } else if (type === 'hot') {
                cfg.color = new Color('#f5b25e');
                cfg.emissiveBase = new Color('#ff7a00'); // warm glow
                cfg.roughness = 0.6;
                cfg.metalness = 0.15;
            }

            const material =
                cfg.materialClass === MeshPhysicalMaterial
                    ? new MeshPhysicalMaterial({
                        color: cfg.color,
                        roughness: cfg.roughness,
                        metalness: cfg.metalness,
                        clearcoat: cfg.clearcoat,
                        transmission: cfg.transmission,
                        thickness: 0.2,
                        envMapIntensity: cfg.envIntensity,
                    })
                    : new MeshStandardMaterial({
                        color: cfg.color,
                        roughness: cfg.roughness,
                        metalness: cfg.metalness,
                        envMapIntensity: cfg.envIntensity,
                        emissive: cfg.emissiveBase,
                        emissiveIntensity: type === 'hot' ? 0.6 : 0.0,
                    });

            return { material, color: cfg.color, emissiveBase: cfg.emissiveBase, ...cfg };
        }, [type]);

    // gentle self-rotation + optional “hot” flicker
    useFrame((state, dt) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed * dt;
        }
        if (type === 'hot' && matRef.current?.emissive) {
            const t = state.clock.getElapsedTime();
            // mild random-ish flicker
            const pulse = 0.5 + 0.5 * Math.sin(t * 7.7) + 0.25 * Math.sin(t * 3.1);
            matRef.current.emissiveIntensity = 0.4 + 0.35 * pulse;
        }
    });

    // cursor affordance
    const setCursor = (hover) => {
        document.body.style.cursor = hover ? 'pointer' : 'auto';
    };

    return (
        <group position={position} rotation={[0, 0, axialTilt]}>
            {/* planet body */}
            <mesh
                ref={meshRef}
                onClick={() => onClick?.(name)}
                onPointerOver={() => setCursor(true)}
                onPointerOut={() => setCursor(false)}
                castShadow
                receiveShadow
            >
                {/* (optional) bump segments to 96 for cleaner rims */}
                <sphereGeometry args={[radius, 96, 96]} />

                {/* Use crater shader only for Mars, otherwise keep your existing material */}
                {type === 'mars' ? (
                    <CraterMarsMaterial
                        baseColor={'#c1440e'}
                        craterCount={72}
                        craterMin={0.055}
                        craterMax={0.13}
                        craterDepth={0.04}
                        rimHeight={0.018}
                        roughBoost={1.28}
                        seed={2.0}
                    />
                ) : (
                    <primitive object={material} ref={matRef} attach="material" />
                )}
            </mesh>

            {/* optional rings (Saturn-like) */}
            {type === 'saturn' && ringOpts && (
                <SaturnRings
                    innerRadius={ringOpts.innerRadius ?? radius * 1.4}
                    outerRadius={ringOpts.outerRadius ?? radius * 2.4}
                    color={ringOpts.color ?? '#d9caa3'}
                    opacity={ringOpts.opacity ?? 0.6}
                />
            )}

            {/* optional floating label */}
            {label && (
                <Html position={[0, radius * 1.4, 0]} center distanceFactor={8}>
                    <div
                        style={{
                            padding: '6px 10px',
                            borderRadius: 999,
                            backdropFilter: 'blur(4px)',
                            background: 'rgba(20,20,30,0.35)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            fontSize: 12,
                            color: 'white',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label}
                    </div>
                </Html>
            )}
        </group>
    );
}

/** Thin, semi-transparent ring using RingGeometry */
function SaturnRings({ innerRadius, outerRadius, color = '#d9caa3', opacity = 0.6 }) {
    const mat = useMemo(
        () =>
            new MeshStandardMaterial({
                color,
                transparent: true,
                opacity,
                depthWrite: false,
                blending: AdditiveBlending,
                roughness: 0.8,
                metalness: 0.0,
            }),
        [color, opacity]
    );

    return (
        <mesh rotation={[Math.PI / 2.2, 0, 0]} renderOrder={2}>
            <ringGeometry args={[innerRadius, outerRadius, 128]} />
            <primitive object={mat} attach="material" />
        </mesh>
    );
}