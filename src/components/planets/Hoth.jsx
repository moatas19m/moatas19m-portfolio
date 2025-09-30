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


export default function Hoth(props) {
    const initialValues = useMemo(
        () =>
            new Map([
                // geometry / toggles
                [meshResolutionAtom, 144],
                [planetRadiusAtom,   1.5],
                [isWireframeAtom,    false],
                [rendersGlobeAtom,   true],
                [isBlendAtom,        true],

                // ELEVATION color gradient (icy teal → soft white highlight → cyan)
                [elevationGradientAtom, [
                    new GradientStop({ anchor: 0.00, color: new Vector4(0.0235, 0.4353, 0.3882, 1) }), // deep teal
                    new GradientStop({ anchor: 0.12, color: new Vector4(0.1137, 0.6039, 0.5647, 1) }), // bright aqua
                    new GradientStop({ anchor: 0.35, color: new Vector4(0.3490, 0.9098, 0.8745, 1) }), // cyan
                    new GradientStop({ anchor: 0.90, color: new Vector4(0.91, 0.91, 0.91, 1) }), // icy highlight
                ]],

                // DEPTH color gradient (dark teal → cyan)
                [depthGradientAtom, [
                    new GradientStop({ anchor: 0.00, color: new Vector4(0.0000, 0.3294, 0.2980, 1) }),
                    new GradientStop({ anchor: 1.00, color: new Vector4(0.1451, 0.8706, 0.8471, 1) })
                ]],

                // NOISE (all Simple) — values copied from your panels
                [noiseFiltersAtom, [
                    // Noise Setting 1
                    new RidgidNoiseFilter({
                        enabled: true,
                        strength: 0.1,
                        roughness: 2.5,
                        baseRoughness: 1.2,
                        center: new Vector3(0, 0, 0),
                        persistence: 0.5,
                        minValue: 1.10,      // "Base Elevation"
                        layerCount: 10,
                        useFirstLayerAsMask: false
                    }),
                    // Noise Setting 2
                    new SimpleNoiseFilter({
                        enabled: true,
                        strength: 0.1,
                        roughness: 2.5,
                        baseRoughness: 0.95,
                        center: new Vector3(0, 0, 0),
                        persistence: 0.5,
                        minValue: 1.10,      // "Base Elevation"
                        layerCount: 5,
                        useFirstLayerAsMask: true
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

    // console.log(initialValues)

    const hothStore = useMemo(() => {
        const s = createStore()
        initialValues.forEach((val, atom) => s.set(atom, val))
        return s
    }, [initialValues])


    return (
        <group {...props}>
            <Provider store={hothStore}>
                <PlanetGPU showcase={true}/>
                {/* Add glow if your scene is a bit dark: */}
                {/* <Atmosphere /> */}
            </Provider>
        </group>
    )
}