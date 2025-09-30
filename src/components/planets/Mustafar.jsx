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
import { SimpleNoiseFilter } from '@shader/lib/noise'
import { useMemo } from 'react'


export default function Mustafar(props) {
    const initialValues = useMemo(
        () =>
            new Map([
                // geometry / toggles
                [meshResolutionAtom, 144],
                [planetRadiusAtom,   0.9],
                [isWireframeAtom,    false],
                [rendersGlobeAtom,   true],
                [isBlendAtom,        true],

                [elevationGradientAtom, [
                    new GradientStop({ anchor: 0.0,   color: new Vector4(0.5686, 0.5216, 0.0000, 1) }),
                    new GradientStop({ anchor: 0.126, color: new Vector4(0.3843, 0.0902, 0.0000, 1) }),
                    new GradientStop({ anchor: 0.57,  color: new Vector4(0.3529, 0.0314, 0.0000, 1) }),
                    new GradientStop({ anchor: 0.9,   color: new Vector4(0.7490, 0.0863, 0.0863, 1) }),
                    new GradientStop({ anchor: 1.0,   color: new Vector4(1.0000, 1.0000, 1.0000, 1) }),
                ]],

                [depthGradientAtom, [
                    new GradientStop({
                        anchor: 0.481892,
                        color: new Vector4(0.2941, 0.0000, 0.0000, 1)
                    }),
                    new GradientStop({
                        anchor: 1.0,
                        color: new Vector4(0.5451, 0.0000, 0.0000, 1)
                    })
                ]],

                // NOISE (all Simple) — values copied from your panels
                [noiseFiltersAtom, [
                    // Noise Setting 1
                    new SimpleNoiseFilter({
                        enabled: true,
                        strength: 0.3,
                        roughness: 2.5,
                        baseRoughness: 1.2,
                        center: new Vector3(0, 0, 0),
                        persistence: 0.5,
                        minValue: 1.1,      // "Base Elevation"
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

    const musStore = useMemo(() => {
        const s = createStore()
        initialValues.forEach((val, atom) => s.set(atom, val))
        return s
    }, [initialValues])


    return (
        <group {...props}>
            <Provider store={musStore}>
                <PlanetGPU showcase={true}/>
                {/* Add glow if your scene is a bit dark: */}
                {/* <Atmosphere /> */}
            </Provider>
        </group>
    )
}