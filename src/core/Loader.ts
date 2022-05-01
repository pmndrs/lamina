import * as THREE from 'three'
import { LayerMaterial, Abstract, Shader } from './LayerMaterial'
import { LaminaLayerFile, LaminaMaterialFile } from '../types'

class ImportedLayer extends Abstract {
  constructor(props?: any) {
    super(ImportedLayer, props)
  }
}

function isBase64UrlImage(s: string) {
  return s.trim().startsWith('data:image')
}

export class LaminaLoader extends THREE.Loader {
  texLoader: THREE.TextureLoader

  constructor(manager?: THREE.LoadingManager) {
    super(manager)
    this.texLoader = new THREE.TextureLoader()
  }

  load<T extends LayerMaterial | Abstract = LayerMaterial>(
    url: string,
    onLoad?: (event: T) => void,
    onError?: (event: Error) => void
  ): void {
    fetch(url)
      .then((resp) =>
        resp
          .json()
          .then(async (json: T extends LayerMaterial ? LaminaMaterialFile : LaminaLayerFile) => {
            if (json.metadata.type === 'mat') {
              const data = json as LaminaMaterialFile

              const layers = await Promise.all(
                data.layers.map(async (layer) => {
                  const l = new Abstract(ImportedLayer)
                  l.raw.fragment = layer.fragment
                  l.raw.vertex = layer.vertex
                  l.raw.uniforms = layer.uniforms
                  l.raw.nonUniforms = layer.nonUniforms

                  l.onShaderParse = new Function(`return (${layer.functions.onShaderParse})`)()
                  l.onNonUniformsParse = new Function(`return (${layer.functions.onNonUniformsParse})`)()
                  l.onUniformsParse = new Function(`return (${layer.functions.onUniformsParse})`)()

                  l.buildUniforms()
                  l.buildNonUniforms()
                  l.buildShaders()

                  await Promise.all(
                    Object.entries(layer.currents).map(async ([key, val]) => {
                      if (typeof val === 'string' && isBase64UrlImage(val)) {
                        const t = await this.texLoader.loadAsync(val)
                        t.encoding = THREE.sRGBEncoding
                        //@ts-ignore
                        l[key] = t
                      } else {
                        //@ts-ignore
                        l[key] = val
                      }
                    })
                  )

                  return l
                })
              )

              delete data.base.currents.metadata
              const mat = new LayerMaterial({
                ...data.base.currents,
                layers,
              })

              onLoad?.(mat as T)
            }
          })
          .catch((e) => onError?.(e))
      )
      .catch((e) => onError?.(e))
  }

  loadAsync<T extends LayerMaterial | Abstract = LayerMaterial>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.load<T>(
        url,
        (e) => {
          resolve(e)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }
}
