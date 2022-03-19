// TODO Remove ts-ignore

import * as THREE from 'three'
import * as LAYERS from './core'

import BlendModesChunk from './chunks/BlendModes'
import NoiseChunk from './chunks/Noise'
import HelpersChunk from './chunks/Helpers'
import {
  LayerMaterialParameters,
  SerializedLayer,
  ShadingType,
  ShadingTypes,
  LaminaMaterialFile,
  LaminaLayerFile,
} from './types'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

class LayerMaterial extends CustomShaderMaterial {
  name: string = 'LayerMaterial'
  layers: LAYERS.Abstract[] = []
  baseColor: THREE.ColorRepresentation = 'white'
  alpha: number = 1
  lighting: ShadingType = 'basic'

  constructor({ color, alpha, lighting, layers, name, ...props }: LayerMaterialParameters = {}) {
    super(ShadingTypes[lighting || 'basic'], undefined, undefined, undefined, props)

    this.baseColor = color || this.baseColor
    this.alpha = alpha ?? this.alpha
    this.layers = layers || this.layers
    this.lighting = lighting || this.lighting
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
        lighting: this.lighting,
      },
    }
  }
}

function getExt(url: string) {
  return (url = url.substring(1 + url.lastIndexOf('/')).split('?')[0]).split('#')[0].substr(url.lastIndexOf('.'))
}

class LaminaLoader extends THREE.Loader {
  constructor(manager?: THREE.LoadingManager) {
    super(manager)
  }

  load<T extends LayerMaterial | LAYERS.Abstract = LayerMaterial>(
    url: string,
    onLoad?: (event: T) => void,
    onError?: (event: Error) => void
  ) {
    const _onError = function (e: Error) {
      if (onError) {
        onError(e)
      } else {
        console.error(e)
      }
    }

    const ext = getExt(url)
    if (!['.lamina', '.json'].includes(ext)) {
      _onError(new Error('Lamina Loader can only load .lamina or .json files.'))
      return null
    }

    fetch(url)
      .then((response) => {
        response
          .json()
          .then((json: LaminaMaterialFile | LaminaLayerFile) => {
            if (json.type === 'material') {
              const material = new LayerMaterial({
                ...json.properties,
                layers: json.layers.map((l) => {
                  // @ts-ignore
                  return new LAYERS[l.constructor](l.properties)
                }),
              })
              // @ts-ignore
              onLoad?.(material)
            } else {
              // @ts-ignore
              onLoad?.(new LAYERS[json.constructor](json.properties) as LAYERS.Abstract)
            }
          })
          .catch((e) => _onError(e))
      })
      .catch((e) => _onError(e))
  }

  async loadAsync<T extends LayerMaterial | LAYERS.Abstract = LayerMaterial>(url: string): Promise<T> {
    const ext = getExt(url)
    if (!['.lamina', '.json'].includes(ext)) {
      throw new Error('Lamina Loader can only load .lamina or .json files.')
    }

    const json: LaminaMaterialFile | LaminaLayerFile = await (await fetch(url)).json()
    if (json.type === 'material') {
      // @ts-ignore
      return new LayerMaterial({
        ...json.properties,
        layers: json.layers.map((l) => {
          // @ts-ignore
          return new LAYERS[l.constructor](l.properties)
        }),
      })
    } else {
      // @ts-ignore
      return new LAYERS[json.constructor](json.properties) as LAYERS.Abstract
    }
  }
}

export { LayerMaterial, LaminaLoader }
export * from './core'
