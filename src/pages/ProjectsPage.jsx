import SplitCanvasLayout from './layouts/SplitCanvasLayout.jsx'
import Chromastone from '@app/components/planets/Chromastone.jsx'
import Rider from '@app/components/rider/Rider.jsx'
import { useState } from 'react'

function ProjectCard({ title, onOpen }) {
    return (
        <button
            onClick={onOpen}
            className="w-full text-left p-4 rounded-2xl bg-white/10 hover:bg-white/15 transition mb-3"
        >
            <div className="font-medium">{title}</div>
            <div className="text-sm opacity-80">Click to see details</div>
        </button>
    )
}

export default function ProjectsPage() {
    const [open, setOpen] = useState(null)

    return (
        <SplitCanvasLayout
            title="Projects"
            LeftCanvasChildren={
                <>
                    <group position={[0, 2.4, 0]}>
                        <Chromastone rotation={[0, 0, 0]} />
                    </group>
                    <group position={[0, -1.2, 0]} scale={1.1}>
                        <Rider /* idle animation assumed default */ />
                    </group>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProjectCard title="KhelGah — Sports Venue Booking" onOpen={() => setOpen('khelgah')} />
                <ProjectCard title="PlanetGPU — Procedural Shader" onOpen={() => setOpen('planetgpu')} />
                <ProjectCard title="Mapbox Style Migrator" onOpen={() => setOpen('mapbox')} />
                <ProjectCard title="Grader — TA Automation" onOpen={() => setOpen('grader')} />
            </div>

            {/* super-simple modal stub */}
            {open && (
                <div className="fixed inset-0 bg-black/60 grid place-items-center" onClick={() => setOpen(null)}>
                    <div className="bg-neutral-900 rounded-2xl p-6 w-[min(680px,92vw)]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold">{open} — Details</h2>
                            <button onClick={() => setOpen(null)} className="opacity-80 hover:opacity-100">✕</button>
                        </div>
                        <p className="opacity-90">
                            Replace this with the full write-up, images, links, and tech stack badges.
                        </p>
                    </div>
                </div>
            )}
        </SplitCanvasLayout>
    )
}