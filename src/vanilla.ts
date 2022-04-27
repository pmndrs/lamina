import * as THREE from 'three'
import hash from 'object-hash'

import Abstract from './core/Abstract'
import Depth from './core/Depth'
import Color from './core/Color'
import Noise from './core/Noise'
import Fresnel from './core/Fresnel'
import Gradient from './core/Gradient'
import Matcap from './core/Matcap'
import Texture from './core/Texture'
import Displace from './core/Displace'
import Normal from './core/Normal'
import Shader from './core/Shader'

import BlendModesChunk from './chunks/BlendModes'
import NoiseChunk from './chunks/Noise'
import HelpersChunk from './chunks/Helpers'
import { LayerMaterialParameters, SerializedLayer, ShadingType, ShadingTypes } from './types'
import {
  ColorRepresentation,
  MeshBasicMaterialParameters,
  MeshLambertMaterialParameters,
  MeshPhongMaterialParameters,
  MeshPhysicalMaterialParameters,
  MeshStandardMaterialParameters,
  MeshToonMaterialParameters,
} from 'three'
// import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import CustomShaderMaterial from './CSM/vanilla'

type AllMaterialParams =
  | MeshPhongMaterialParameters
  | MeshPhysicalMaterialParameters
  | MeshToonMaterialParameters
  | MeshBasicMaterialParameters
  | MeshLambertMaterialParameters
  | MeshStandardMaterialParameters

class LayerMaterial extends CustomShaderMaterial {
  name: string = 'LayerMaterial'
  layers: Abstract[] = []
  lighting: ShadingType = 'basic'

  constructor({ color, alpha, lighting, layers, name, ...props }: LayerMaterialParameters & AllMaterialParams = {}) {
    super(ShadingTypes[lighting || 'basic'], undefined, undefined, undefined, props)

    const _baseColor = color || 'white'
    const _alpha = alpha ?? 1

    this.uniforms = {
      u_lamina_color: {
        value: typeof _baseColor === 'string' ? new THREE.Color(_baseColor).convertSRGBToLinear() : _baseColor,
      },
      u_lamina_alpha: {
        value: _alpha,
      },
    }

    this.layers = layers || this.layers
    this.lighting = lighting || this.lighting

    this.refresh()
  }

  genShaders() {
    console.log('genShaders')
    let vertexVariables = ''
    let fragmentVariables = ''
    let vertexShader = ''
    let fragmentShader = ''
    let uniforms: any = {}

    this.layers
      .filter((l) => l.visible)
      .forEach((l) => {
        // l.buildShaders(l.constructor)

        vertexVariables += l.vertexVariables + '\n'
        fragmentVariables += l.fragmentVariables + '\n'
        vertexShader += l.vertexShader + '\n'
        fragmentShader += l.fragmentShader + '\n'

        uniforms = {
          ...uniforms,
          ...l.uniforms,
        }
      })

    uniforms = {
      ...uniforms,
      ...this.uniforms,
    }

    return {
      uniforms,
      vertexShader: `
        ${HelpersChunk}
        ${NoiseChunk}
        ${vertexVariables}

        void main() {
          vec3 lamina_finalPosition = position;
          vec3 lamina_finalNormal = normal;

          ${vertexShader}

          csm_Position = lamina_finalPosition;
          csm_Normal = lamina_finalNormal;
        }
        `,
      fragmentShader: `
        ${HelpersChunk}
        ${NoiseChunk}
        ${BlendModesChunk}
        ${fragmentVariables}

        uniform vec3 u_lamina_color;
        uniform float u_lamina_alpha;

        void main() {
          vec4 lamina_finalColor = vec4(u_lamina_color, u_lamina_alpha);

          ${fragmentShader}

          csm_DiffuseColor = lamina_finalColor;
         
        }
        `,
    }
  }

  refresh() {
    console.log('refresh')
    const hashes = this.layers.map((layer) => {
      if (!layer.__updateMaterial) {
        layer.__updateMaterial = this.refresh.bind(this)
      }
      return layer.getHash()
    })
    const { uniforms, fragmentShader, vertexShader } = this.genShaders()
    const h = hash([...hashes, fragmentShader, vertexShader, ...Object.values(this.serialize().properties || {})])

    super.uuid = h
    super.update(fragmentShader, vertexShader, uniforms)
    this.needsUpdate = true
  }

  serialize(): Partial<SerializedLayer> {
    return {
      constructor: 'LayerMaterial',
      properties: {
        color: this.color,
        alpha: this.alpha,
        name: this.name,
        lighting: this.lighting,
      },
    }
  }

  set color(v: ColorRepresentation) {
    if (this.uniforms?.u_lamina_color?.value)
      this.uniforms.u_lamina_color.value = typeof v === 'string' ? new THREE.Color(v).convertSRGBToLinear() : v
  }
  get color() {
    return this.uniforms?.u_lamina_color?.value
  }
  set alpha(v: number) {
    this.uniforms.u_lamina_alpha.value = v
  }
  get alpha() {
    return this.uniforms.u_lamina_alpha.value
  }
}

export { LayerMaterial, Abstract, Depth, Color, Noise, Fresnel, Gradient, Matcap, Texture, Displace, Normal, Shader }
