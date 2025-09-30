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


export default function Coruscant(props) {
    const initialValues = useMemo(
        () =>
            new Map([
                // geometry / toggles
                [meshResolutionAtom, 144],
                [planetRadiusAtom,   0.8],
                [isWireframeAtom,    false],
                [rendersGlobeAtom,   true],
                [isBlendAtom,        true],

                [elevationGradientAtom, [
                    new GradientStop({ anchor: 0.0565659, color: new Vector4(0.0039, 0.0039, 0.2745, 1) }),
                    new GradientStop({ anchor: 0.126,     color: new Vector4(0.0784, 0.0000, 0.4706, 1) }),
                    new GradientStop({ anchor: 0.57,      color: new Vector4(0.2941, 0.1216, 0.3961, 1) }),
                    new GradientStop({ anchor: 0.890732,  color: new Vector4(0.2549, 0.1765, 0.6471, 1) }),
                    new GradientStop({ anchor: 1.0,       color: new Vector4(1.0000, 1.0000, 1.0000, 1) }),
                ]],

                [depthGradientAtom, [
                    new GradientStop({
                        anchor: 0.31374,
                        color: new Vector4(0.1490, 0.0000, 0.3333, 1)
                    }),
                    new GradientStop({
                        anchor: 1.0,
                        color: new Vector4(0.0000, 0.6863, 0.6863, 1)
                    })
                ]],

                // NOISE (all Simple) — values copied from your panels
                [noiseFiltersAtom, [
                    // Noise Setting 1
                    new RidgidNoiseFilter({
                        enabled: true,
                        strength: 0.1,
                        roughness: 2.9,
                        baseRoughness: 1.2,
                        center: new Vector3(0, 0, 0),
                        persistence: 0.5,
                        minValue: 1.9,      // "Base Elevation"
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
                        minValue: 1.9,      // "Base Elevation"
                        layerCount: 5,
                        useFirstLayerAsMask: true
                    })
                ]]
            ]),
        []
    )

    // console.log(initialValues)

    const celebStore = useMemo(() => {
        const s = createStore()
        initialValues.forEach((val, atom) => s.set(atom, val))
        return s
    }, [initialValues])


    return (
        <group {...props}>
            <Provider store={celebStore}>
                <PlanetGPU showcase={true}/>
                {/* Add glow if your scene is a bit dark: */}
                {/* <Atmosphere /> */}
            </Provider>
        </group>
    )
}