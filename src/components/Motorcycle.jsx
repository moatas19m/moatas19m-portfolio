import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

/**
 * Expects: /src/assets/models/motorcycle.glb
 * Adjust `scale` if your model appears too large/small.
 */
export default function Motorcycle(props) {
    const gltf = useGLTF('/src/assets/models/motorcycle.glb');

    useEffect(() => {
        gltf.scene.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
    }, [gltf.scene]);

    return <primitive object={gltf.scene} scale={1} {...props} />;
}

// Optional preloading
// useGLTF.preload('/src/assets/models/motorcycle.glb');
