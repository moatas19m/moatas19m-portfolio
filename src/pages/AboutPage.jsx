import SplitCanvasLayout from './layouts/SplitCanvasLayout.jsx'
import Rider from '@app/components/rider/Rider.jsx'

export default function AboutPage() {
    return (
        <SplitCanvasLayout
            title="About Me"
            LeftCanvasChildren={
                <group position={[0, -0.3, 0]} scale={1.4}>
                    <Rider />
                </group>
            }
        >
            <div className="max-w-2xl p-5 rounded-2xl bg-white/10">
                <h2 className="text-lg font-semibold mb-2">Moatasim bin Hisham Sayyid</h2>
                <p className="opacity-90">
                    Software Engineer focused on interactive 3D, performant web stacks, and delightful UX.
                    Add your personal summary here…
                </p>
            </div>
        </SplitCanvasLayout>
    )
}