import { useMemo, useRef, useEffect } from 'react'
import {
    BufferGeometry, BufferAttribute, PointsMaterial,
    Mesh, MeshBasicMaterial, Vector3
} from 'three'
import { useLoader } from '@react-three/fiber'
import { FontLoader } from 'three-stdlib'
import { ShapeGeometry } from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

/**
 * Minimal “star text” for R3F.
 * - No triggers, no renderer/camera/controls, no tweening.
 * - Just: load font → build text shapes → sample points → render as <points>.
 *
 * Props mirror your legacy constants:
 * - text: string (can include '\n')
 * - fontUrl: '/fonts/helvetiker_regular.typeface.json' (place in /public/fonts)
 * - particleCount: number of points (like particleCount)
 * - particleSize: PointsMaterial.size (like particleSize)
 * - color: hex string
 * - size: text size (world units)
 * - lineHeight: spacing between lines (in “size” units)
 * - curveSegments: path fidelity
 * - jitter: small random offset per point (optional; default 0)
 * - position, rotation: forwarded to the group (pass from HeroScene)
 */
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
                                        }) {
    const font = useLoader(FontLoader, fontUrl)
    const pointsRef = useRef()

    const { geometry, material } = useMemo(() => {
        // 1) Make a single flat ShapeGeometry from (possibly multi-line) text
        const lines = String(text).split('\n')
        const lineGeoms = []
        let y = 0

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            if (!line) { y -= size * lineHeight; continue }

            // Note: Three’s generateShapes signature is (text, size)
            const shapes = font.generateShapes(line, size)
            const g = new ShapeGeometry(shapes, curveSegments)

            // center each line horizontally, stack vertically
            g.computeBoundingBox()
            const w = g.boundingBox.max.x - g.boundingBox.min.x
            g.translate(-w / 2, y, 0)
            y -= size * lineHeight

            lineGeoms.push(g)
        }

        // 2) Merge line geometries (positions + indices) into one BufferGeometry
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

        // 3) Sample 'particleCount' points over faces (flat surface like your text silhouette)
        const tmpMesh = new Mesh(merged, new MeshBasicMaterial())
        const sampler = new MeshSurfaceSampler(tmpMesh).build()

        const pts = new Float32Array(particleCount * 3)
        const p = new Vector3()
        const n = new Vector3()

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

    // Dispose on unmount
    useEffect(() => () => {
        geometry?.dispose()
        material?.dispose()
    }, [geometry, material])

    return (
        <group position={position} rotation={rotation}>
            {/* intrinsic three element, not the class */}
            <points ref={pointsRef} geometry={geometry} material={material} />
        </group>
    )
}