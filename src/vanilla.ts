import * as THREE from 'three'

import Abstract from './core/Abstract'
import Depth from './core/Depth'
import Color from './core/Color'
import Shading from './core/Shading'
import Noise from './core/Noise'
import Fresnel from './core/Fresnel'
import Gradient from './core/Gradient'
import Matcap from './core/Matcap'
import Texture from './core/Texture'
import Displace from './core/Displace'

import BlendModesChunk from './chunks/BlendModes'
import NoiseChunk from './chunks/Noise'
import HelpersChunk from './chunks/Helpers'
import { LayerMaterialParameters, LayerMaterialProps, SerializedLayer, ShadingProps, ShadingType } from './types'
import { MathUtils, UniformsUtils } from 'three'

class LayerMaterial extends THREE.ShaderMaterial {
  shadingAdded: boolean = false
  layers: Abstract[]
  color: THREE.ColorRepresentation
  alpha: number
  lighting: ShadingType
  lightingProps: ShadingProps
  uuid: string

  static u_color = 'white'
  static u_alpha = 1
  static u_layers = []
  static u_lighting: ShadingType = 'phong'
  static u_lightingProps: ShadingProps = {
    shininess: 1,
    color: 'white',
    alpha: 1,
    mode: 'normal',
  }
  static u_name = 'LayerMaterial'

  constructor(props?: THREE.ShaderMaterialParameters & LayerMaterialParameters) {
    super(props)

    this.uuid = MathUtils.generateUUID()
    this.color = props?.color || LayerMaterial.u_color
    this.alpha = props?.alpha ?? LayerMaterial.u_alpha
    this.layers = props?.layers || LayerMaterial.u_layers
    this.lighting = props?.lighting || LayerMaterial.u_lighting
    this.lightingProps = props?.lightingProps || LayerMaterial.u_lightingProps
    this.name = props?.name || LayerMaterial.u_name

    this.customProgramCacheKey = () => {
      return this.uuid
    }

    this.update()
  }

  forceShading() {
    // Strip pre-existing  shading layers

    // Force shading to be always on top. May change?
    switch (this.lighting) {
      default:
      case 'phong':
        if (this.layers[this.layers.length - 1]?.name !== 'PresetShading') {
          this.layers = this.layers.filter((l) => {
            if (l.constructor.name === 'Shading') {
              return false
            }

            return true
          })
          const s = new Shading(this.lightingProps)
          s.name = 'PresetShading'
          this.layers.push(s)
        }

        break

      case 'none':
        if (this.layers[this.layers.length - 1]?.name === 'PresetShading') this.layers.pop()
        break
    }
  }

  genShaders() {
    let vertexVariables = ''
    let fragmentVariables = ''
    let vertexShader = ''
    let fragmentShader = ''

    // Restrict to one shading layer
    let shadingAdded = false

    this.layers = this.layers.filter((l) => {
      if (l.constructor.name === 'Shading') {
        if (shadingAdded) {
          return false
        } else {
          shadingAdded = true
        }
      }

      return true
    })

    this.layers.forEach((layer) => {
      layer.buildShaders(layer.constructor)
    })

    let uniforms: any = {}
    this.layers
      .filter((l) => l.visible)
      .forEach((l) => {
        vertexVariables += l.vertexVariables + '\n'
        fragmentVariables += l.fragmentVariables + '\n'
        vertexShader += l.vertexShader + '\n'
        fragmentShader += l.fragmentShader + '\n'

        uniforms = {
          ...uniforms,
          ...l.uniforms,
        }

        for (const key in l.attribs) {
          // @ts-ignore
          this[key] = l.attribs[key]
        }
      })

    uniforms = {
      ...uniforms,
      ...THREE.UniformsLib.fog,
      ...{
        u_lamina_color: {
          value: typeof this.color === 'string' ? new THREE.Color(this.color).convertSRGBToLinear() : this.color,
        },
        u_lamina_alpha: {
          value: this.alpha,
        },
      },
    }

    this.transparent = Boolean(this.alpha !== undefined && this.alpha < 1)

    return {
      uniforms: uniforms,
      vertexShader: /* glsl */ `
      ${HelpersChunk}
      ${NoiseChunk}
      ${vertexVariables}

      void main() {
        vec3 lamina_finalPosition = position;
        vec3 lamina_finalNormal = normal;
        ${vertexShader}

        #ifdef vNormal
          vNormal = lamina_finalNormal;
        #endif
        gl_Position = projectionMatrix * modelViewMatrix * vec4(lamina_finalPosition, 1.0);
      }
      `,
      fragmentShader: /* glsl */ `
      ${HelpersChunk}
      ${NoiseChunk}
      ${BlendModesChunk}
      ${fragmentVariables}

      uniform vec3 u_lamina_color;
      uniform float u_lamina_alpha;

      void main() {
        vec4 lamina_finalColor = vec4(u_lamina_color, u_lamina_alpha);
        ${fragmentShader}

        gl_FragColor = lamina_finalColor;

        #include <tonemapping_fragment>
	      #include <encodings_fragment>
      }
      `,
    }
  }

  update() {
    // Force shading as first layer
    this.forceShading()

    const { uniforms, ...rest } = this.genShaders()
    Object.assign(this, rest)

    for (const key in uniforms) {
      this.uniforms[key] = uniforms[key]
    }

    this.uniformsNeedUpdate = true
    this.needsUpdate = true
  }

  serialize(): SerializedLayer {
    return {
      constructor: 'LayerMaterial',
      properties: {
        color: this.color,
        alpha: this.alpha,
        lighting: this.lighting,
        lightingProps: this.lightingProps,
        name: this.name,
      },
    }
  }
}

export { LayerMaterial, Abstract, Depth, Color, Shading, Noise, Fresnel, Gradient, Matcap, Texture, Displace }
