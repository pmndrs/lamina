import * as THREE from 'three'
import Abstract from './core/Abstract'
import Color from './core/Color'
import Depth from './core/Depth'
import Fresnel from './core/Fresnel'
import Noise from './core/Noise'
import Normals from './core/Normals'
import Texture from './core/Texture'

import HelperChunk from './core/ShaderChunks/Helpers'
import BlendModesChunk from './core/ShaderChunks/BlendModes'
import NoiseChunk from './core/ShaderChunks/Noise'
import { LayerMaterialParameters, SerializedLayer, SerializedMaterial } from './types'

class LayerMaterial extends THREE.ShaderMaterial {
  public layers: Abstract[] = []
  static constructShader(shaderMaterial: THREE.ShaderMaterial & LayerMaterialParameters, layers: Abstract[] = []) {
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
      variables.vert += THREE.ShaderChunk.fog_pars_vertex + '\n'
      specials.vert += THREE.ShaderChunk.fog_vertex + '\n'

      variables.frag += THREE.ShaderChunk.fog_pars_fragment + '\n'
      specials.frag += THREE.ShaderChunk.fog_fragment + '\n'
    }
    if (shaderMaterial.shadows) {
      variables.vert += THREE.ShaderChunk.shadowmap_pars_vertex + '\n'
      specials.vert += THREE.ShaderChunk.shadowmap_vertex + '\n'

      variables.frag += THREE.ShaderChunk.shadowmap_pars_fragment + '\n'
    }

    uniforms = THREE.UniformsUtils.merge([
      uniforms,
      THREE.UniformsLib.fog,
      {
        u_lamina_baseColor: {
          value: new THREE.Color(shaderMaterial.color ?? 'red'),
        },
        u_lamina_alpha: {
          value: shaderMaterial.alpha ?? 1,
        },
      },
    ])

    shaderMaterial.transparent = Boolean(shaderMaterial.alpha !== undefined && shaderMaterial.alpha < 1)

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
      uniform vec3 u_lamina_baseColor;
      uniform float u_lamina_alpha;
      void main() {
        vec4 sc_finalColor = vec4(u_lamina_baseColor, u_lamina_alpha);
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

  constructor(props: THREE.ShaderMaterialParameters & LayerMaterialParameters) {
    super({
      ...props,
      name: 'LayerMaterial',
    })
    if (props && props.layers && props.layers.length) {
      this.layers = props.layers
      this.update()
    }
  }

  update() {
    const { uniforms, ...rest } = LayerMaterial.constructShader(this, this.layers)
    Object.assign(this, rest)

    // Merge uniform keeping reference to this.uniforms
    for (const key in uniforms) {
      this.uniforms[key] = uniforms[key]
    }

    this.uniformsNeedUpdate = true
    this.needsUpdate = true
  }

  serialize(): SerializedMaterial {
    return {
      version: 1,
      name: this.name,
      settings: {
        alpha: (this as LayerMaterialParameters).alpha,
        color: (this as LayerMaterialParameters).color,
      },
      defaults: {
        alpha: 1,
        color: '#ff0000',
      },
      layers: this.layers.map((l) => l.serialize()).filter((e) => e !== null) as SerializedLayer[],
    }
  }
}

export { LayerMaterial, Abstract, Color, Depth, Fresnel, Noise, Normals, Texture }
