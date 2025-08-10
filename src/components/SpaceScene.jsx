import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';

export default function SpaceScene() {
    return (
        <Canvas className="fixed inset-0 z-0">
            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
                <OrbitControls enableZoom={false} />
                {/* Add your 3D models here later */}
            </Suspense>
        </Canvas>
    );
}