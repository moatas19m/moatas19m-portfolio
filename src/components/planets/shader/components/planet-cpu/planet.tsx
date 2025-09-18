import { useAtomValue } from "jotai";

import {
  isBlendAtom,
  isWireframeAtom,
  meshResolutionAtom,
  planetRadiusAtom,
  rendersGlobeAtom,
} from "@shader/atoms/settings";
import TerrainFace from "@shader/components/planet-cpu/terrain-face";
import WireFace from "@shader/components/wire-face/wire-face";

import {
  VECTOR_BACK,
  VECTOR_DOWN,
  VECTOR_FRONT,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_UP,
} from "@shader/lib/vector";

const directions = [
  VECTOR_UP,
  VECTOR_DOWN,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_FRONT,
  VECTOR_BACK,
];

const Planet = () => {
  const resolution = useAtomValue(meshResolutionAtom);
  const wireframe = useAtomValue(isWireframeAtom);
  const radius = useAtomValue(planetRadiusAtom);
  const rendersGlobe = useAtomValue(rendersGlobeAtom);
  const isBlend = useAtomValue(isBlendAtom);

  return (
    <mesh>
      {directions.map((direction, i) => {
        if (rendersGlobe || direction === VECTOR_FRONT)
          return (
            <TerrainFace
              wireframe={wireframe}
              resolution={resolution}
              radius={radius}
              localUp={direction}
              key={`terrain-face-${i}-${rendersGlobe ? "globe" : "face"}`}
              renderBackface={!rendersGlobe}
              isBlend={isBlend}
            />
          );

        return (
          <WireFace
            resolution={10}
            radius={radius}
            localUp={direction}
            key={`wire-face-${i}`}
          />
        );
      })}
    </mesh>
  );
};

export default Planet;
