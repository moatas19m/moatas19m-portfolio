export const controlsConfig = {
    home: {
        target: [-0.7, 3.6, 0],
        enablePan: false,
        enableRotate: false,
        enableZoom: false,
        autoRotate: false,
        minDistance: 3,
        maxDistance: 8,
    },
    other: {
        target: [0, 0, 0],
        enablePan: false,
        enableRotate: false,
        enableZoom: false,
        autoRotate: false,
        minDistance: 2,
        maxDistance: 24,
        maxPolarAngle: Math.PI * 0.58,
    },
};