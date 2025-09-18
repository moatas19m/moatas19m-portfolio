import { Provider } from 'jotai'
import { Vector4 } from 'three'

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


export default function Mars(...props) {
    const initialValues = useMemo(
        () =>
            new Map([
                [meshResolutionAtom, 144],
                [planetRadiusAtom,   1.8],
                [isWireframeAtom,    false],
                [rendersGlobeAtom,   true],
                [isBlendAtom,        true],

                [elevationGradientAtom, [
                    new GradientStop({ anchor: 0.00, color: new Vector4(0.35, 0.16, 0.10, 1) }),
                    new GradientStop({ anchor: 0.25, color: new Vector4(0.55, 0.24, 0.12, 1) }),
                    new GradientStop({ anchor: 0.55, color: new Vector4(0.64, 0.42, 0.20, 1) }),
                    new GradientStop({ anchor: 0.82, color: new Vector4(0.78, 0.62, 0.43, 1) }),
                    new GradientStop({ anchor: 1.00, color: new Vector4(0.92, 0.86, 0.80, 1) })
                ]],

                [depthGradientAtom, [
                    new GradientStop({ anchor: 0.00, color: new Vector4(0.10, 0.06, 0.05, 1) }),
                    new GradientStop({ anchor: 1.00, color: new Vector4(0.25, 0.16, 0.12, 1) })
                ]],

                [noiseFiltersAtom, [
                    new SimpleNoiseFilter({
                        enabled: true,
                        strength: 0.35,
                        roughness: 2.2,
                        baseRoughness: 1.3,
                        center: VECTOR_ZERO,
                        persistence: 0.5,
                        minValue: 1.08,
                        layerCount: 6,
                        useFirstLayerAsMask: true
                    }),
                    new RidgidNoiseFilter({
                        enabled: true,
                        strength: 0.18,
                        roughness: 2.4,
                        baseRoughness: 1.1,
                        center: VECTOR_ZERO,
                        persistence: 0.5,
                        minValue: 1.8,
                        layerCount: 4
                    }),
                    new SimpleNoiseFilter({
                        enabled: true,
                        strength: 0.08,
                        roughness: 2.0,
                        baseRoughness: 0.8,
                        center: VECTOR_ZERO,
                        persistence: 0.5,
                        minValue: 1.0,
                        layerCount: 3,
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