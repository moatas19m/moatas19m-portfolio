import { useMemo, useRef } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// GLSL: stylized tunnel lanes (fast). uSpeed drives intensity & scroll.
const WarpTunnelMaterial = shaderMaterial(
    {
        uTime: 0,
        uSpeed: 0,         // 0..1
        uIntensity: 1.0,   // overall brightness
        uColor1: new THREE.Color('#9ecbff'),
        uColor2: new THREE.Color('#6aa8ff'),
        uNoiseAmp: 0.2,
    },
    // vertex (pass world pos and uv-ish coords)
    /* glsl */`
  varying vec3 vWorldPos;
  varying vec2 vUv2;

  void main() {
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    // take built-in uv (cylindrical) and pass a second coord for variety
    vUv2 = uv;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPos, 1.0);
  }
  `,
    // fragment
    /* glsl */`
  uniform float uTime;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform float uNoiseAmp;

  varying vec3 vWorldPos;
  varying vec2 vUv2;

  // hash & noise helpers (tiny & fast)
  float hash(vec2 p) {
    p = fract(p*vec2(123.34, 345.45));
    p += dot(p, p+34.345);
    return fract(p.x*p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i+vec2(1.0,0.0));
    float c = hash(i+vec2(0.0,1.0));
    float d = hash(i+vec2(1.0,1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
  }

  void main() {
    // Convert world xz to polar around tunnel axis (y)
    vec2 xz = vWorldPos.xz;
    float r = length(xz);
    float ang = atan(xz.y, xz.x); // -pi..pi

    // Repeat angular lanes
    float lanes = 24.0; // number of light lanes around
    float lane = sin(ang * lanes);

    // Scroll lanes along +y (toward the camera) with speed
    float speed = smoothstep(0.0, 1.0, uSpeed);
    float scroll = (vWorldPos.y * 0.25) + (uTime * (2.0 + 14.0*speed));

    // Lane mask: sharp when fast
    float laneSharp = mix(0.35, 0.9, speed);
    float laneMask = pow(abs(lane), 6.0*laneSharp);

    // Add moving bands on y for a sense of forward speed
    float bandFreq = mix(2.0, 8.0, speed);
    float bands = 0.5 + 0.5 * sin(scroll * bandFreq);

    // Light falloff from center
    float rFall = smoothstep(22.0, 4.0, r);

    // Subtle noise flicker
    float n = noise(vec2(ang*3.0, scroll*0.5)) * uNoiseAmp * (0.5 + speed);

    // Base color blend and final intensity
    vec3 col = mix(uColor1, uColor2, 0.5 + 0.5 * sin(ang*lanes*0.5 + scroll*0.2));
    float glow = (1.0 - laneMask) * bands * rFall + n;

    // Speed-based boost & gentle desaturation at top end
    float boost = mix(0.6, 1.8, speed);
    float lum = dot(col, vec3(0.299,0.587,0.114));
    col = mix(col, vec3(lum), 0.15*speed);

    vec3 finalCol = col * glow * uIntensity * boost;

    // Fade tunnel at very low speed
    float alpha = smoothstep(0.02, 0.08, speed);

    gl_FragColor = vec4(finalCol, alpha);
  }
  `
);
extend({ WarpTunnelMaterial });

export default function WarpTunnel({
                                       radius = 30,
                                       height = 200,
                                       radialSegments = 64,
                                       heightSegments = 64,
                                       intensity = 1.0,
                                       color1 = '#9ecbff',
                                       color2 = '#6aa8ff',
                                       noiseAmp = 0.2,
                                       speed = 0,          // 0..1
                                   }) {
    const matRef = useRef();
    const meshRef = useRef();
    const { camera, clock } = useThree();

    const geo = useMemo(
        () => new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments, true),
        [radius, height, radialSegments, heightSegments]
    );

    useFrame(() => {
        if (!matRef.current || !meshRef.current) return;
        // Keep tunnel centered on camera so we always "sit inside"
        meshRef.current.position.copy(camera.position);

        matRef.current.uTime = clock.getElapsedTime();
        matRef.current.uSpeed = speed;      // drive by parent state (warpSpeed)
        matRef.current.uIntensity = intensity;
    });

    return (
        <mesh ref={meshRef} geometry={geo}>
            {/* Render inside of the cylinder (BackSide) */}
            <warpTunnelMaterial
                ref={matRef}
                side={THREE.BackSide}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                uColor1={new THREE.Color(color1)}
                uColor2={new THREE.Color(color2)}
                uNoiseAmp={noiseAmp}
            />
        </mesh>
    );
}