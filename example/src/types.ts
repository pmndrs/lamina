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
