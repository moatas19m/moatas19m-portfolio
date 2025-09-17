import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Simple hash & sample-on-sphere utilities
const vert = /* glsl */`
  varying vec3 vPos;     // object-space position
  varying vec3 vNrm;     // object-space normal
  void main() {
    vPos = position;
    vNrm = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Place N pseudo-random crater centers on the unit sphere, then
// build a height profile (parabolic bowl + raised rim), and
// fake a normal perturbation using screen-space derivatives.
const frag = /* glsl */`
  precision highp float;

  varying vec3 vPos;
  varying vec3 vNrm;

  uniform vec3 baseColor;
  uniform float craterCount;   // e.g. 40–120
  uniform float craterMin;     // base angular radius in radians (e.g. 0.06)
  uniform float craterMax;     // max angular radius in radians (e.g. 0.14)
  uniform float craterDepth;   // strength of indentation (0.0–0.08)
  uniform float rimHeight;     // rim height factor (0.0–0.08)
  uniform float roughBoost;    // roughness boost inside crater
  uniform float seed;          // random seed

  // Hash helpers
  float hash11(float p){
    p = fract(p*0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }
  vec3 hash3(float n){
    return fract(vec3(
      sin(n*12.9898+78.233),
      sin(n*26.651+37.141),
      sin(n*63.7264+10.873)
    )*43758.5453)*2.0-1.0;
  }

  // Build an orthonormal basis given a normal
  mat3 basisFromNormal(vec3 n){
    vec3 up = abs(n.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0);
    vec3 t = normalize(cross(up, n));
    vec3 b = cross(n, t);
    return mat3(t, b, n);
  }

  // Angular distance between two directions on the unit sphere
  float angDist(vec3 a, vec3 b){
    return acos(clamp(dot(normalize(a), normalize(b)), -1.0, 1.0));
  }

  // Smooth, bowl-like crater profile with a raised rim.
  // d = angular distance, r = crater radius
  float craterProfile(float d, float r){
    // inner bowl
    float x = clamp(d / r, 0.0, 1.0);
    float bowl = (1.0 - x*x);              // parabola
    // raised rim near edge
    float rim = smoothstep(0.75, 1.0, x);  // rim region
    return bowl - 0.4 * rim;               // net height (positive = raised)
  }

  void main() {
    vec3 n = normalize(vNrm);
    vec3 p = normalize(vPos); // direction from center
    mat3 tbn = basisFromNormal(n);

    // Accumulate height + roughness deltas from many craters
    float h = 0.0;
    float roughDelta = 0.0;

    // Deterministic loop count (keep it modest)
    int N = int(craterCount);
    for(int i=0;i<256;i++){
      if(i >= N) break;

      // Pseudo-random crater center & radius
      float f = float(i) + seed*113.0;
      vec3 rnd = normalize(hash3(f));
      float rad = mix(craterMin, craterMax, hash11(f+0.37));

      // Angular distance between current surface dir and crater center
      float d = angDist(p, rnd);

      // Influence falls to zero after ~rad
      if(d < rad){
        float prof = craterProfile(d, rad);
        // Depth: inside the bowl goes negative, rim slightly positive
        float dent = -prof * craterDepth;
        float rim = smoothstep(rad*0.72, rad*0.98, d) * rimHeight;
        h += dent + rim;

        // Make insides a bit rougher, rims slightly rough too
        roughDelta += (1.0 - d/rad) * roughBoost * 0.7 + rim * 0.6;
      }
    }

    // Screen-space gradient of height to fake a bump-normal
    float hx = dFdx(h);
    float hy = dFdy(h);
    vec3 bumpN = normalize(tbn * normalize(vec3(-hx, -hy, 1.0)));

    // Mix the perturbed normal with original to keep it subtle
    float Nmix = 0.8;
    vec3 finalN = normalize(mix(bumpN, n, Nmix));

    // Simple lighting (Lambert) to keep the shader standalone
    // (It will still look fine in your scene lights)
    vec3 lightDir = normalize(vec3(0.5, 0.9, 0.3));
    float ndl = max(dot(finalN, lightDir), 0.05);

    // Albedo: add slight darkening inside craters; warm up rims
    vec3 albedo = baseColor;
    albedo *= (1.0 - clamp(h*8.0, -0.15, 0.15)); // bowls darker, rims brighter a touch
    albedo = mix(albedo, albedo*1.05, smoothstep(0.0, 0.05, h)); // warm rims

    // Fake roughness into diffuse term: darker where rougher
    float roughFac = clamp(1.0 - roughDelta*0.8, 0.75, 1.0);

    vec3 color = albedo * ndl * roughFac;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const CraterMarsMaterialImpl = shaderMaterial(
    {
        baseColor: new THREE.Color('#b5532d'),
        craterCount: 64,
        craterMin: 0.06,
        craterMax: 0.14,
        craterDepth: 0.035,
        rimHeight: 0.015,
        roughBoost: 0.25,
        seed: 3.0,
    },
    vert,
    frag
);

extend({ CraterMarsMaterialImpl });

export default function CraterMarsMaterial(props) {
    return <craterMarsMaterialImpl attach="material" {...props} />;
}