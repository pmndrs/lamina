import { ShaderChunk, ShaderMaterial, ShaderMaterialParameters, UniformsLib, UniformsUtils } from 'three'
import Abstract from './core/Abstract'
import Base from './core/Base'
import Depth from './core/Depth'
import Fresnel from './core/Fresnel'
import Noise from './core/Noise'
import Normals from './core/Normals'
import Texture from './core/Texture'

import HelperChunk from './core/ShaderChunks/Helpers'
import BlendModesChunk from './core/ShaderChunks/BlendModes'
import NoiseChunk from './core/ShaderChunks/Noise'

type LayerMaterialProps = {
  layers: Abstract[]
}

class LayerMaterial extends ShaderMaterial {
  public layers: Abstract[] = []
  static constructShader(shaderMaterial: ShaderMaterial, layers: Abstract[] = []) {
    let uniforms: { [key: string]: any } = {}
    const variables = {
      vert: '',
      frag: '',
    }
    const body = {
      vert: '',
      frag: '',
    }
    const specials = {
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

    if (shaderMaterial.fog) {
      variables.vert += ShaderChunk.fog_pars_vertex + '\n'
      specials.vert += ShaderChunk.fog_vertex + '\n'

      variables.frag += ShaderChunk.fog_pars_fragment + '\n'
      specials.frag += ShaderChunk.fog_fragment + '\n'
    }

    uniforms = UniformsUtils.merge([uniforms, UniformsLib.fog])

    const shaders = {
      uniforms,
      vertexShader: `
      #include <common>
      ${variables.vert}
      void main() {
        ${body.vert}

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        vec4 worldPosition = gl_Position;
        vec3 transformedNormal = normal;

        ${specials.vert}
    }
    `,
      fragmentShader: `
      #include <common>
      #include <packing>

      ${HelperChunk}
      ${NoiseChunk}
      ${BlendModesChunk}
      ${variables.frag}
      void main() {
        vec4 sc_finalColor = vec4(vec3(1.), 1.);
        ${body.frag}
        gl_FragColor = sc_finalColor;


        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <premultiplied_alpha_fragment>
        #include <dithering_fragment>

        ${specials.frag}
    }
    `,
    }

    return shaders
  }

  constructor(props: ShaderMaterialParameters & LayerMaterialProps) {
    super(props)
    if (props && props.layers && props.layers.length) {
      this.layers = props.layers
      this.update()
    }
  }

  update() {
    if (this.layers.length) {
      Object.assign(this, LayerMaterial.constructShader(this, this.layers))
      this.uniformsNeedUpdate = true
      this.needsUpdate = true
    }
  }
}

export { LayerMaterial, Abstract, Base, Depth, Fresnel, Noise, Normals, Texture }
