import { ShaderMaterial, ShaderMaterialParameters } from 'three'
import Abstract from './core/Abstract'
import Base from './core/Base'
import Depth from './core/Depth'
import Fresnel from './core/Fresnel'
import Noise from './core/Noise'
import HelperChunk from './core/ShaderChunks/Helpers'
import BlendModesChunk from './core/ShaderChunks/BlendModes'
import RandChunk from './core/ShaderChunks/Rand'

type LayerMaterialProps = {
  layers: Abstract[]
}

class LayerMaterial extends ShaderMaterial {
  static constructShader({ layers, ...props }: ShaderMaterialParameters & LayerMaterialProps = {} as any) {
    const uniforms: { [key: string]: any } = {}
    const variables = {
      vert: '',
      frag: '',
    }
    const body = {
      vert: '',
      frag: '',
    }
    layers?.forEach((layer: Abstract) => {
      variables.frag += layer.getFragmentVariables() + ' \n'
      variables.vert += layer.getVertexVariables() + ' \n'
      Object.keys(layer.uniforms).forEach((key) => (uniforms[key] = layer.uniforms[key]))
      body.frag += layer.getFragmentBody('sc_finalColor') + ' \n'
      body.vert += layer.getVertexBody('') + ' \n'
    })

    return {
      uniforms,
      vertexShader: `
    ${variables.vert}
    void main() {
      ${body.vert}
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
    `,
      fragmentShader: `
    ${HelperChunk}
    ${RandChunk}
    ${BlendModesChunk}
    ${variables.frag}
    void main() {
      vec4 sc_finalColor = vec4(0.);
      ${body.frag}
      gl_FragColor = sc_finalColor;
      #include <tonemapping_fragment>
      #include <encodings_fragment>
      #include <fog_fragment>
      #include <premultiplied_alpha_fragment>
      #include <dithering_fragment>
    }
    `,
      ...props,
    }
  }

  constructor(props: ShaderMaterialParameters & LayerMaterialProps) {
    super(LayerMaterial.constructShader(props))
    this.uniformsNeedUpdate = true
    this.needsUpdate = true
  }
}

export { LayerMaterial, Abstract, Base, Depth, Fresnel, Noise }
