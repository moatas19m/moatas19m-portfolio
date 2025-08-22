import { useGLTF } from '@react-three/drei';
import {useEffect, useMemo} from 'react';
import * as THREE from "three";

/**
 * Expects: /src/assets/models/motorcycle.glb
 * Adjust `scale` if your model appears too large/small.
 */
export default function Motorcycle(props) {
    const gltf = useGLTF('/src/assets/models/motorcycle.glb');
    const targetSize = 4;

    const size = useMemo(() => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const v = new THREE.Vector3();
        box.getSize(v);

        return v;
    }, [gltf.scene])


    useEffect(() => {
        if (!size) return;

        // Largest dimension
        const maxDim = Math.max(size.x, size.y, size.z);
        if (!isFinite(maxDim) || maxDim <= 0) return;

        // Scale so largest dimension = targetSize
        const scale = targetSize / maxDim;
        gltf.scene.scale.setScalar(scale);

        gltf.scene.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
    }, [size, targetSize, gltf.scene]);

    return <primitive object={gltf.scene} {...props} />;
}

// Optional preloading
useGLTF.preload('/src/assets/models/motorcycle.glb');
