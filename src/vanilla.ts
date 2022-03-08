import * as THREE from 'three'

import Abstract from './core/Abstract'
import Depth from './core/Depth'
import Color from './core/Color'
import Noise from './core/Noise'
import Fresnel from './core/Fresnel'
import Gradient from './core/Gradient'
import Matcap from './core/Matcap'
import Texture from './core/Texture'
import Displace from './core/Displace'

import BlendModesChunk from './chunks/BlendModes'
import NoiseChunk from './chunks/Noise'
import HelpersChunk from './chunks/Helpers'
import { LayerMaterialParameters, SerializedLayer, ShadingType, ShadingTypes } from './types'
import { MaterialParameters, MathUtils } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

class LayerMaterial extends CustomShaderMaterial {
  name: string = 'LayerMaterial'
  layers: Abstract[] = []
  baseColor: THREE.ColorRepresentation = 'white'
  alpha: number = 1
  shading: ShadingType = 'basic'

  // Defaults for debugger
  static u_shading = 'basic'

  constructor({ color, alpha, shading, layers, name, ...props }: LayerMaterialParameters & any = {}) {
    super(ShadingTypes[shading || 'basic'], undefined, undefined, undefined, props)

    this.baseColor = color || this.baseColor
    this.alpha = alpha ?? this.alpha
    this.layers = layers || this.layers
    this.shading = shading || this.shading
    this.name = name || this.name

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
      ...{
        u_lamina_color: {
          value:
            typeof this.baseColor === 'string' ? new THREE.Color(this.baseColor).convertSRGBToLinear() : this.baseColor,
        },
        u_lamina_alpha: {
          value: this.alpha,
        },
      },
    }

    this.transparent = Boolean(this.alpha !== undefined && this.alpha < 1)

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
    const { uniforms, fragmentShader, vertexShader } = this.genShaders()
    super.update(fragmentShader, vertexShader, uniforms)
  }

  serialize(): SerializedLayer {
    return {
      constructor: 'LayerMaterial',
      properties: {
        color: this.baseColor,
        alpha: this.alpha,
        name: this.name,
        lighting: this.shading,
      },
    }
  }
}

export { LayerMaterial, Abstract, Depth, Color, Noise, Fresnel, Gradient, Matcap, Texture, Displace }
