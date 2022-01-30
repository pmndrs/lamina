/* eslint-disable */

import { extend, ReactThreeFiber } from '@react-three/fiber'
import { ShaderMaterial } from 'three'
import AbstractLayer from './core/AbstractLayer'

import BaseLayer from './core/ColorLayer'
import DepthLayer from './core/DepthLayer'
import FresnelLayer from './core/FresnelLayer'
import NoiseLayer from './core/NoiseLayer'

import HelperChunk from './core/ShaderChunks/Helpers'
import BlendModesChunk from './core/ShaderChunks/BlendModes'
import RandChunk from './core/ShaderChunks/Rand'

class LayerMaterial extends ShaderMaterial {
  constructor(props: any) {
    super(props)

    this.onBeforeCompile = (shader) => {
      // @ts-ignore
      const layers: AbstractLayer[] = this.__r3f.objects

      const variables = {
        vert: '',
        frag: '',
      }
      let uniforms = {}
      const body = {
        vert: '',
        frag: '',
      }
      layers.forEach((layer: AbstractLayer) => {
        variables.frag += layer.getFragmentVariables() + ' \n'
        variables.vert += layer.getVertexVariables() + ' \n'

        uniforms = {
          ...layer.uniforms,
          ...uniforms,
        }

        body.frag += layer.getFragmentBody('sc_finalColor') + ' \n'
        body.vert += layer.getVertexBody('') + ' \n'
      })

      console.log(uniforms)

      shader.vertexShader = `
      ${variables.vert}
      void main() {
        ${body.vert}

        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
      `

      shader.fragmentShader = `
      ${HelperChunk}
      ${RandChunk}
      ${BlendModesChunk}
      ${variables.frag}
      void main() {
        vec4 sc_finalColor = vec4(0.);
        ${body.frag}
        gl_FragColor = sc_finalColor;

      }
      `

      shader.uniforms = uniforms
      console.log(shader.fragmentShader)

      return shader
    }
  }
}

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

export { LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer }
