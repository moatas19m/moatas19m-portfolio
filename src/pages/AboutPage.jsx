import Rider from "@app/components/rider/Rider";
import { CardSpotlight } from "@app/components/ui/card-spotlight";
import {OrbitControls} from "@react-three/drei";

// DOM-only page
export default function AboutPage() {
    return (
        <CardSpotlight className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-3 text-white">Moatasim bin Hisham Sayyid</h2>
            <p className="text-neutral-300 leading-relaxed">
                Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                I build immersive experiences that merge motion, space, and interface — where
                performance and design meet.
            </p>
        </CardSpotlight>
    );
}

// 3D subtree for the left pane, rendered by App.jsx via <View>
export function AboutLeft3D() {
    return (
        <>
            {/* You can keep lights here or in App-level View block */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
            <group position={[0, -0.7, 5.5]} scale={1.4} rotation={[0, Math.PI/1.4, 0]}>
                <OrbitControls
                    makeDefault={true}
                    target={[0, 0, 0]}
                    enablePan={false}
                    autoRotate={false}
                    enableRotate={false}
                    enableZoom={false}
                    enableDamping
                    dampingFactor={0.08}
                    minDistance={3}
                    maxDistance={24}
                />
                <Rider />
            </group>
        </>
    );
}