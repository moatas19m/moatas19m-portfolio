import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Expects: /src/assets/models/rider.glb
 * Optional helmet: /src/assets/models/helmet.glb (attached to right hand if found)
 * Props:
 *  - faceCamera: boolean => rotates rider to face the camera (useful with side-view bike)
 */
export default function Rider({ position = [0, 0, 0], faceCamera = false }) {
    const rider = useGLTF('/src/assets/models/rider.glb');
    const { actions, names } = useAnimations(rider.animations, rider.scene);

    // Try to locate the right hand bone (common Mixamo bone naming)
    const rightHand = useMemo(() => {
        let bone = null;
        rider.scene.traverse((obj) => {
            if (obj.isBone && /RightHand|mixamorigRightHand/i.test(obj.name)) {
                bone = obj;
            }
        });
        return bone;
    }, [rider.scene]);

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

    // Optional: attach a helmet if present
    // If you have /src/assets/models/helmet.glb, uncomment below:
    /*
    const helmet = useGLTF('/src/assets/models/helmet.glb');
    useEffect(() => {
      if (helmet?.scene && rightHand) {
        const h = helmet.scene.clone(true);
        h.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; }});
        h.scale.setScalar(0.9);
        h.position.set(0, -0.05, 0.06);
        h.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
        rightHand.add(h);
      }
    }, [helmet, rightHand]);
    */

    return (
        <group position={position}>
            <group rotation={[0, faceCamera ? Math.PI / 2 : 0, 0]}>
                <primitive object={rider.scene} />
            </group>
        </group>
    );
}

// Optional preloads
// useGLTF.preload('/src/assets/models/rider.glb');
// useGLTF.preload('/src/assets/models/helmet.glb');
