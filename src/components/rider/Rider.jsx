import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect } from 'react';
import { playIdleAnimation } from './animations/idlePoseAnimation.jsx';

export default function Rider(props) {
    const rider = useGLTF('/src/assets/models/rider.glb');
    const { actions, names } = useAnimations(rider.animations, rider.scene);

    // Log all animations once rider is loaded
    //
    // useEffect(() => {
    //     if (names && names.length > 0) {
    //         console.log("Available animations in rider.glb:");
    //         names.forEach((n, i) => console.log(`${i + 1}. ${n}`));
    //     } else {
    //         console.log("No animations found in rider.glb");
    //     }
    // }, [names]);

    // See opening comment in /src/constants/limbs.js
    //
    // useEffect(() => {
    //     if (!rider.scene) return;
    //
    //     rider.scene.traverse((obj) => {
    //         if (obj.isBone) {
    //             console.log(obj.name);
    //         }
    //     });
    // }, [rider.scene]);

    useEffect(() => {
        rider.scene.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
    }, [rider.scene]);

    // single call into animation module
    useEffect(() => {
        if (!actions || !names?.length) return;
        const dispose = playIdleAnimation(actions, { fade: 0.5 });
        return () => dispose?.();
    }, [actions, names]);

    return <primitive object={rider.scene} {...props} />;
}

useGLTF.preload('/src/assets/models/rider.glb');