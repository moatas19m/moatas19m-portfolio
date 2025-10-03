import { useMemo, useRef, useEffect } from 'react'
import {
    BufferGeometry, BufferAttribute, PointsMaterial,
    Mesh, MeshBasicMaterial, Vector3
} from 'three'
import { useLoader, useFrame } from '@react-three/fiber'
import { FontLoader } from 'three-stdlib'
import { ShapeGeometry } from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

export default function StarText({
                                     text = "Moatasim bin Hisham Sayyid,\nSoftware Engineer",
                                     fontUrl = "/fonts/helvetiker_regular.typeface.json",
                                     particleCount = 6000,
                                     particleSize = 0.3,
                                     color = "#FFFFFF",
                                     size = 1.2,
                                     lineHeight = 1.2,
                                     curveSegments = 10,
                                     jitter = 0.0,
                                     position = [0, 0, 0],
                                     rotation = [0, 0, 0],

                                     // ✨ Scatter params
                                     hoverRadius = 0.2,     // world-space radius of influence
                                     burst = 0.15,          // initial “push” strength
                                     damping = 0.7,         // velocity decay per frame (0.9 = mild friction)
                                     returnSpeed = 0.06,    // spring back toward base pos
                                 }) {
    const font = useLoader(FontLoader, fontUrl)
    const pointsRef = useRef()
    const groupRef = useRef()

    // runtime state for interaction
    const mouseLocal = useRef(new Vector3())
    const hoverActive = useRef(false)
    const basePositionsRef = useRef(null)   // Float32Array (immutable baseline)
    const velocitiesRef   = useRef(null)    // Float32Array per-axis velocities
    const hitPlaneRef     = useRef()        // invisible plane for pointer events
    const bboxWH = useRef([1, 1])           // width/height for hit area

    const { geometry, material } = useMemo(() => {
        // 1) Shapes → lines → merged
        const lines = String(text).split('\n')
        const lineGeoms = []
        let y = 0

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            if (!line) { y -= size * lineHeight; continue }

            const shapes = font.generateShapes(line, size)
            const g = new ShapeGeometry(shapes, curveSegments)

            g.computeBoundingBox()
            const w = g.boundingBox.max.x - g.boundingBox.min.x
            g.translate(-w / 2, y, 0)
            y -= size * lineHeight

            lineGeoms.push(g)
        }

        // 2) Merge to one geometry
        const merged = new BufferGeometry()
        const posAll = []
        const idxAll = []
        let offset = 0
        for (const g of lineGeoms) {
            const pos = g.attributes.position.array
            const idx = g.index ? g.index.array : null
            if (idx) for (let k = 0; k < idx.length; k++) idxAll.push(idx[k] + offset)
            for (let k = 0; k < pos.length; k++) posAll.push(pos[k])
            offset += g.attributes.position.count
        }
        merged.setAttribute('position', new BufferAttribute(new Float32Array(posAll), 3))
        if (idxAll.length) merged.setIndex(idxAll)

        // 3) Sample points on surface
        const tmpMesh = new Mesh(merged, new MeshBasicMaterial())
        const sampler = new MeshSurfaceSampler(tmpMesh).build()

        const pts = new Float32Array(particleCount * 3)
        const p = new Vector3(), n = new Vector3()
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            sampler.sample(p, n)
            if (jitter) {
                p.x += (Math.random() - 0.5) * jitter
                p.y += (Math.random() - 0.5) * jitter
                p.z += (Math.random() - 0.5) * jitter
            }
            pts[i3] = p.x
            pts[i3 + 1] = p.y
            pts[i3 + 2] = p.z
        }

        const starGeo = new BufferGeometry()
        starGeo.setAttribute('position', new BufferAttribute(pts, 3))
        starGeo.computeBoundingBox()
        const bb = starGeo.boundingBox
        const width  = (bb.max.x - bb.min.x) || 1
        const height = (bb.max.y - bb.min.y) || 1
        bboxWH.current = [width, height]

        // keep a frozen copy as the “home” positions
        basePositionsRef.current = new Float32Array(pts) // clone
        velocitiesRef.current = new Float32Array(pts.length) // zeroed

        const starMat = new PointsMaterial({
            color,
            size: particleSize,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
        })

        // cleanup temps
        tmpMesh.geometry.dispose()
        tmpMesh.material.dispose()
        lineGeoms.forEach(g => g.dispose())
        merged.dispose()

        return { geometry: starGeo, material: starMat }
    }, [text, font, particleCount, particleSize, color, size, lineHeight, curveSegments, jitter])

    // physics tick
    useFrame(() => {
        const geo = geometry
        if (!geo) return

        const pos = geo.attributes.position.array
        const base = basePositionsRef.current
        const vel  = velocitiesRef.current
        if (!base || !vel) return

        // 1) apply hover impulse (repulsion) once per frame
        if (hoverActive.current) {
            const r = hoverRadius
            const r2 = r * r
            const mx = mouseLocal.current.x
            const my = mouseLocal.current.y

            for (let i = 0; i < pos.length; i += 3) {
                const x = pos[i], y = pos[i + 1]
                const dx = x - mx
                const dy = y - my
                const d2 = dx * dx + dy * dy
                if (d2 < r2 && d2 > 1e-6) {
                    const d = Math.sqrt(d2)
                    // strength fades with distance (smoothstep-ish)
                    const s = (1.0 - d / r) * burst
                    const nx = dx / d, ny = dy / d
                    vel[i]     += nx * s
                    vel[i + 1] += ny * s
                    // z stays put; you can jiggle it a bit if you want:
                    // vel[i + 2] += 0.02 * (Math.random() - 0.5)
                }
            }
        }

        // 2) integrate velocities + spring back + damping
        for (let i = 0; i < pos.length; i += 3) {
            // spring toward base
            const ax = (base[i]     - pos[i])     * returnSpeed
            const ay = (base[i + 1] - pos[i + 1]) * returnSpeed
            const az = (base[i + 2] - pos[i + 2]) * returnSpeed

            vel[i]     = (vel[i]     + ax) * damping
            vel[i + 1] = (vel[i + 1] + ay) * damping
            vel[i + 2] = (vel[i + 2] + az) * damping

            pos[i]     += vel[i]
            pos[i + 1] += vel[i + 1]
            pos[i + 2] += vel[i + 2]
        }

        geo.attributes.position.needsUpdate = true
    })

    // Dispose on unmount
    useEffect(() => () => {
        geometry?.dispose()
        material?.dispose()
    }, [geometry, material])

    // pointer handlers on invisible plane sized to text bbox
    const onPointerMove = (e) => {
        if (!groupRef.current) return
        // e.point is in world space (plane hit); convert to our group local
        mouseLocal.current.copy(e.point)
        groupRef.current.worldToLocal(mouseLocal.current)
        hoverActive.current = true
    }
    const onPointerOver = () => { hoverActive.current = true }
    const onPointerOut  = () => { hoverActive.current = false }

    const [planeW, planeH] = bboxWH.current

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            {/* Points */}
            <points ref={pointsRef} geometry={geometry} material={material} />

            {/* Invisible hit area to get a stable e.point over the text block */}
            <mesh
                ref={hitPlaneRef}
                onPointerMove={onPointerMove}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                position={[0, 0, 0.001]} // just in front so it always catches pointer
            >
                <planeGeometry args={[planeW * 1.1, planeH * 1.2]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    )
}