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
    // @ts-ignore
    console.log(this._transmission)
  }

  private genShaders() {
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

  serialize(): Partial<SerializedLayer> {
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

class PlaceholderLayer extends LAYERS.Abstract {}

class LaminaLoader extends THREE.Loader {
  constructor(manager?: THREE.LoadingManager) {
    super(manager)
  }

  private makeLayer(l: any) {
    // @ts-ignore
    const layer = new LAYERS.Abstract(PlaceholderLayer)

    const id = LAYERS.Abstract.genUUID()
    for (const key in l.shaders) {
      l.shaders[key] = l.shaders[key].replace(new RegExp(l.properties.uuid, 'g'), id)
    }

    layer.buildUniforms(undefined, { ...l.properties, uuid: id }, l.uniforms)
    layer.fragmentShader = l.shaders.fragmentShader
    layer.fragmentVariables = l.shaders.fragmentVariables
    layer.vertexShader = l.shaders.vertexShader
    layer.vertexVariables = l.shaders.vertexVariables

    // Non uniforms are har coded into the shader :(
    layer.schema = layer.schema.filter((e) => !['visible', 'mode'].includes(e.label))

    return layer
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
                  return this.makeLayer(l)
                }),
              })
              // @ts-ignore
              onLoad?.(material)
            } else {
              // @ts-ignore
              onLoad?.(this.makeLayer(json))
            }
          })
          .catch((e) => _onError(e))
      })
      .catch((e) => _onError(e))
  }

  async loadAsync<T extends LayerMaterial | LAYERS.Abstract = LayerMaterial>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.load<T>(
        url,
        (material) => {
          resolve(material)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }
}

export { LayerMaterial, LaminaLoader }
export * from './core'
