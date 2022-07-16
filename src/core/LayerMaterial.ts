import * as THREE from 'three'
import Abstract from './layers/Abstract'
import Depth from './layers/Depth'
import Color from './layers/Color'
import Noise from './layers/Noise'
import Fresnel from './layers/Fresnel'
import Gradient from './layers/Gradient'
import Matcap from './layers/Matcap'
import Texture from './layers/Texture'
import Displace from './layers/Displace'
import Normal from './layers/Normal'
import Shader from './layers/Shader'

import BlendModesChunk from '../chunks/BlendModes'
import NoiseChunk from '../chunks/Noise'
import HelpersChunk from '../chunks/Helpers'
import { LayerMaterialParameters, SerializedBase, SerializedLayer, ShadingType, ShadingTypes } from '../types'
import {
  ColorRepresentation,
  MeshBasicMaterialParameters,
  MeshLambertMaterialParameters,
  MeshPhongMaterialParameters,
  MeshPhysicalMaterialParameters,
  MeshStandardMaterialParameters,
  MeshToonMaterialParameters,
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import objectHash from 'object-hash'

type AllMaterialParams =
  | MeshPhongMaterialParameters
  | MeshPhysicalMaterialParameters
  | MeshToonMaterialParameters
  | MeshBasicMaterialParameters
  | MeshLambertMaterialParameters
  | MeshStandardMaterialParameters

class LayerMaterial extends CustomShaderMaterial {
  layers: Abstract[] = []
  lighting: ShadingType = 'basic'

  __lamina__debuggerNeedsUpdate: boolean = false

  constructor({ color, alpha, lighting, layers, ...props }: LayerMaterialParameters & AllMaterialParams = {}) {
    super({
      baseMaterial: ShadingTypes[lighting || 'basic'],
      transparent: true,
      ...props,
    })

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
    const hashes = this.layers.map((layer) => {
      if (!layer.__updateMaterial) {
        layer.__updateMaterial = this.refresh.bind(this)
      }
      return layer.getHash()
    })
    this.__lamina__debuggerNeedsUpdate = true
    const { uniforms, fragmentShader, vertexShader } = this.genShaders()
    super.update({ fragmentShader, vertexShader, uniforms })
  }

  serialize(): SerializedBase {
    return {
      constructor: 'LayerMaterial',
      currents: this.toJSON(),
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

  toJSON(meta?: any) {
    return {
      ...super.toJSON(),
      lighting: this.lighting,
      name: this.name,
    }
  }
}

export { LayerMaterial, Abstract, Depth, Color, Noise, Fresnel, Gradient, Matcap, Texture, Displace, Normal, Shader }
