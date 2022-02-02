/* eslint-disable */

import { ReactThreeFiber } from '@react-three/fiber'
import { LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer } from 'lamina'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial: ReactThreeFiber.Node<LayerMaterial, typeof LayerMaterial>
      baseLayer: ReactThreeFiber.Node<BaseLayer, typeof BaseLayer>
      depthLayer: ReactThreeFiber.Node<DepthLayer, typeof DepthLayer>
      fresnelLayer: ReactThreeFiber.Node<FresnelLayer, typeof FresnelLayer>
      noiseLayer: ReactThreeFiber.Node<NoiseLayer, typeof NoiseLayer>
    }
  }
}

export const SC_BLEND_MODES = {
  NORMAL: 1,
  ADD: 2,
  SUBTRACT: 3,
  MULTIPLY: 4,
  ADDSUB: 5,
  LIGHTEN: 6,
  DARKEN: 7,
  SWITCH: 8,
  DIVIDE: 9,
  OVERLAY: 10,
  SCREEN: 11,
  SOFTLIGHT: 12,
}
