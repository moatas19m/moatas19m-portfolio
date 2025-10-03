import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import { Link } from 'react-router-dom'

export default function SplitCanvasLayout({ LeftCanvasChildren, children, title }) {
    return (
        <div className="fixed inset-0 flex">
            {/* Left: 15–20% */}
            <div className="h-full" style={{ width: '18%' }}>
                <Canvas camera={{ position: [0, 2.5, 6], fov: 50 }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[3,5,3]} intensity={0.8} />
                        <Environment preset="city" environmentIntensity={0.2} />
                        <OrbitControls enablePan={false} enableZoom={false} />
                        {LeftCanvasChildren}
                    </Suspense>
                </Canvas>
            </div>

            {/* Right: content */}
            <div className="flex-1 overflow-y-auto bg-white/5 backdrop-blur p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <Link to="/" className="text-sm opacity-80 hover:opacity-100 underline">Back to Home</Link>
                </div>
                {children}
            </div>
        </div>
    )
}