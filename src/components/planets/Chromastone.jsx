import {createStore, Provider} from 'jotai'
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
import { useMemo } from 'react'


export default function Chromastone(props) {
    const initialValues = useMemo(
        () =>
            new Map([
                // geometry / toggles
                [meshResolutionAtom, 144],
                [planetRadiusAtom,   1.6],
                [isWireframeAtom,    false],
                [rendersGlobeAtom,   true],
                [isBlendAtom,        true],

                // ELEVATION color gradient (icy teal → soft white highlight → cyan)
                [elevationGradientAtom, [
                        new GradientStop({ anchor: 0.05,   color: new Vector4(0.2706, 0.0000, 0.1922, 1) }), // rgb(69, 0, 49)
                        new GradientStop({ anchor: 0.1634, color: new Vector4(0.1882, 0.0588, 0.2824, 1) }), // rgb(48, 15, 72)
                        new GradientStop({ anchor: 0.3210, color: new Vector4(0.3059, 0.0000, 0.4118, 1) }), // rgb(78, 0, 105)
                        new GradientStop({ anchor: 0.563,  color: new Vector4(0.3765, 0.0000, 0.2510, 1) }), // rgb(96, 0, 64)
                        new GradientStop({ anchor: 0.86,   color: new Vector4(1.0000, 0.6863, 0.7686, 1) }), // rgb(255, 175, 196)
                        new GradientStop({ anchor: 0.95,   color: new Vector4(1.0000, 1.0000, 1.0000, 1) })  // rgb(255, 255, 255)
                    ]],

                // DEPTH color gradient (dark teal → cyan)
                [depthGradientAtom, [
                    new GradientStop({ anchor: 0.45,      color: new Vector4(0.4667, 0.0000, 0.1255, 1) }),
                    new GradientStop({ anchor: 0.95,      color: new Vector4(1.0000, 0.1490, 0.4392, 1) })  // rgb(255, 30, 168)
                ]],

                // NOISE (all Simple) — values copied from your panels
                [noiseFiltersAtom, [
                    // Noise Setting 1
                    new SimpleNoiseFilter({
                        enabled: true,
                        strength: 0.4,
                        roughness: 2.5,
                        baseRoughness: 1.2,
                        center: new Vector3(0, 0, 0),
                        persistence: 0.5,
                        minValue: 1.10,      // "Base Elevation"
                        layerCount: 10,
                        useFirstLayerAsMask: false
                    }),
                    // Noise Setting 2
                    new RidgidNoiseFilter({
                        enabled: true,
                        strength: 0.2,
                        roughness: 2.5,
                        baseRoughness: 0.95,
                        center: new Vector3(0, 0, 0),
                        persistence: 0.5,
                        minValue: 1.10,      // "Base Elevation"
                        layerCount: 5,
                        useFirstLayerAsMask: true
                    }),
                    // Noise Setting 3
                    new RidgidNoiseFilter({
                        enabled: true,
                        strength: 0.1,
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

    // console.log(initialValues)

    const marsStore = useMemo(() => {
        const s = createStore()
        initialValues.forEach((val, atom) => s.set(atom, val))
        return s
    }, [initialValues])


    return (
        <group {...props}>
            <Provider store={marsStore}>
                <PlanetGPU showcase={true}/>
                {/* Add glow if your scene is a bit dark: */}
                {/* <Atmosphere /> */}
            </Provider>
        </group>
    )
}