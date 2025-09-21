import { Provider } from 'jotai'
import {Vector3, Vector4} from 'three'

import PlanetGPU from '@shader/components/planet-gpu/planet-gpu'

import {
    meshResolutionAtom,
    planetRadiusAtom,
    isWireframeAtom,
    rendersGlobeAtom,
    isBlendAtom,
    elevationGradientAtom,
    depthGradientAtom,
    noiseFiltersAtom
} from '@shader/atoms/settings'

import GradientStop from '@shader/lib/gradient'
import { SimpleNoiseFilter, RidgidNoiseFilter } from '@shader/lib/noise'
import { VECTOR_ZERO } from '@shader/lib/vector'
import { useMemo } from 'react'


export default function Mars(props) {
    const initialValues = useMemo(
        () =>
            new Map([
                // geometry / toggles
                [meshResolutionAtom, 144],
                [planetRadiusAtom,   1.8],
                [isWireframeAtom,    false],
                [rendersGlobeAtom,   true],
                [isBlendAtom,        true],

                // ELEVATION color gradient (icy teal → soft white highlight → cyan)
                [elevationGradientAtom, [
                    new GradientStop({ anchor: 0.00, color: new Vector4(0.05, 0.35, 0.38, 1) }), // deep teal
                    new GradientStop({ anchor: 0.12, color: new Vector4(0.00, 0.88, 0.85, 1) }), // bright aqua
                    new GradientStop({ anchor: 0.35, color: new Vector4(0.00, 0.78, 0.80, 1) }), // cyan
                    new GradientStop({ anchor: 0.82, color: new Vector4(1.00, 1.00, 1.00, 1) }), // icy highlight
                    new GradientStop({ anchor: 1.00, color: new Vector4(0.70, 1.00, 1.00, 1) })  // pale cyan
                ]],

                // DEPTH color gradient (dark teal → cyan)
                [depthGradientAtom, [
                    new GradientStop({ anchor: 0.00, color: new Vector4(0.02, 0.25, 0.28, 1) }),
                    new GradientStop({ anchor: 1.00, color: new Vector4(0.70, 1.00, 1.00, 1) })
                ]],

                // NOISE (all Simple) — values copied from your panels
                [noiseFiltersAtom, [
                    // Noise Setting 1
                    new SimpleNoiseFilter({
                        enabled: true,
                        strength: 1.2,
                        roughness: 2.9,
                        baseRoughness: 1.15,
                        center: new Vector3(0, 0, 0),
                        persistence: 0.5,
                        minValue: 1.10,      // "Base Elevation"
                        layerCount: 10,
                        useFirstLayerAsMask: false
                    }),
                    // Noise Setting 2
                    new SimpleNoiseFilter({
                        enabled: true,
                        strength: 0.3,
                        roughness: 2.5,
                        baseRoughness: 1.2,
                        center: new Vector3(920, 509, 229),
                        persistence: 0.5,
                        minValue: 1.10,      // "Base Elevation"
                        layerCount: 10,
                        useFirstLayerAsMask: false
                    }),
                    // Noise Setting 3
                    new SimpleNoiseFilter({
                        enabled: true,
                        strength: 0.2,
                        roughness: 2.5,
                        baseRoughness: 1.2,
                        center: new Vector3(132, 379, 295),
                        persistence: 0.5,
                        minValue: 1.10,      // "Base Elevation"
                        layerCount: 10,
                        useFirstLayerAsMask: false
                    })
                ]]
            ]),
        []
    )

    return (
        <group {...props}>
            <Provider initialValues={initialValues}>
                <PlanetGPU showcase={false} />
                {/* Add glow if your scene is a bit dark: */}
                {/* <Atmosphere /> */}
            </Provider>
        </group>
    )
}