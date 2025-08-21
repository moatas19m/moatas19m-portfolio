import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

/**
 * Expects: /src/assets/models/rider.glb
 * Optional helmet: /src/assets/models/helmet.glb (attached to right hand if found)
 * Props:
 *  - faceCamera: boolean => rotates rider to face the camera (useful with side-view bike)
 */
export default function Rider(props) {
    const rider = useGLTF('/src/assets/models/rider.glb');
    const { actions, names } = useAnimations(rider.animations, rider.scene);

    useEffect(() => {
        // Play idle or first clip
        const idleName = names.find((n) => /idle/i.test(n)) ?? names[0];
        if (idleName && actions[idleName]) {
            actions[idleName].reset().fadeIn(0.3).play();
        }

        // Shadow flags
        rider.scene.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });

        return () => {
            if (idleName && actions[idleName]) actions[idleName].fadeOut(0.2);
        };
    }, [actions, names, rider.scene]);

    return (
        <primitive object={rider.scene} {...props}/>
    );
}

// Optional preloads
useGLTF.preload('/src/assets/models/rider.glb');