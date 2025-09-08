import { useGLTF, useAnimations } from '@react-three/drei';
import {useEffect, useRef} from 'react';
import { playIdleAnimation } from './animations/idlePoseAnimation.jsx';
import {BONES} from "../../constants/limbs.js";
import {useFrame} from "@react-three/fiber";

export default function Rider(props) {
    const group = useRef();
    const rider = useGLTF('/src/assets/models/rider.glb');
    const {actions, names} = useAnimations(rider.animations, rider.scene);

    const ctrlRef = useRef(null);

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
        if (!actions || !group.current) return;
        const {dispose, tick} = playIdleAnimation(actions, {
            delaySec: 2,
            fade: 0.4,
            targetObject: group.current,
            hipsName: 'mixamorigHips',
            fallToY: 0,
            floorY: 0,
            fallScale: 0.55,  // try 0.55; lower = less drop per frame
        });
        ctrlRef.current = {tick, dispose};
        return () => ctrlRef.current?.dispose?.();
    }, [actions]);

    useFrame((_, dt) => {
        ctrlRef.current?.tick?.(dt);
    });

    return (
        <group ref={group} {...props}>
            <primitive object={rider.scene}/>
        </group>
    );
}
useGLTF.preload('/src/assets/models/rider.glb');