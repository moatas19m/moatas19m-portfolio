import vert from '../shaders/warpPoints.vert?raw'
import frag from '../shaders/warpPoints.frag?raw'

export function logShaderLengths() {
  // Keep lightweight; console only in dev
  // eslint-disable-next-line no-console
  console.log('[shaderCheck] vert bytes:', vert.length, 'frag bytes:', frag.length)
}


