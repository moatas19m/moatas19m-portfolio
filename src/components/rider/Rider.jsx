import { useGLTF, useAnimations } from '@react-three/drei';
import {useEffect, useRef} from 'react';
import {playIdlePose} from "./animations/idlePoseAnimation.jsx";
import {useFrame} from "@react-three/fiber";

export default function Rider(props) {
    const rider = useGLTF('/src/assets/models/rider.glb');
    const { actions, names } = useAnimations(rider.animations, rider.scene);

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

    const mixerRef = useRef(null);
    const disposeRef = useRef(null);

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

        const idleClipName =
            names.find(n => /(^|\W)idle(\W|$)/i.test(n)) ??
            names.find(n => /rest|breath|stand|pose/i.test(n));

        let idleAction = null;
        if (idleClipName && actions[idleClipName]) {
            idleAction = actions[idleClipName];
            idleAction.reset().fadeIn(0.25).play();
            // If you used an animation, no need for the manual pose mixer
            // Clear any previous pose mixer
            disposeRef.current?.();
            mixerRef.current = null;
            disposeRef.current = null;

            console.log(`Playing idle clip: ${idleClipName}`);
        } else {
            // Ease into manual idle pose
            const { mixer, dispose } = playIdlePose(rider.scene, {
                shoulderDropDeg: -70,
                slightForwardDeg: 8,
                forearmRelaxDeg: 5,
                duration: 0.35
            });
            mixerRef.current = mixer;
            disposeRef.current = dispose;

            // Optional: stop updating once finished
            mixer.addEventListener?.('finished', () => {
                // after clamping, we can drop the mixer to stop per-frame work
                mixerRef.current = null;
            });
        }

        return () => {
            disposeRef.current?.();         // stop actions
            disposeRef.current = null;
            mixerRef.current = null;
            if (idleAction) idleAction.fadeOut(0.2);
        };
    }, [rider.scene, actions, names]);

    // ✅ Advance the pose mixer if we’re using it
    useFrame((_, dt) => {
        if (mixerRef.current) mixerRef.current.update(dt);
    });

    return <primitive object={rider.scene} {...props} />;
}

// Optional preloads
useGLTF.preload('/src/assets/models/rider.glb');