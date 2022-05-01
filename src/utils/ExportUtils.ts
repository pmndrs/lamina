import { LaminaLayerFile, LaminaMaterialFile, SerializedLayer } from '../types'
import * as LAYERS from '../vanilla'

function getPropsFromLayer(layer: Partial<SerializedLayer>) {
  // @ts-ignore
  const constructor = LAYERS[layer.constructor]
  const instance = new constructor()
  let props = ''
  // @ts-ignore
  Object.entries(layer.properties || {}).forEach(([key, val]) => {
    const defaultVal = constructor['u_' + key] ?? instance[key]

    switch (key) {
      case 'name':
        if (val !== layer.constructor) props += ` ${key}={${JSON.stringify(val)}}`
        break

      case 'visible':
        if (!val) props += ` ${key}={${JSON.stringify(val)}}`
        break

      default:
        if (val !== defaultVal) props += ` ${key}={${JSON.stringify(val)}}`
        break
    }
  })

  return props
}

export function serializedLayersToJSX(layers: SerializedLayer[], material: Partial<SerializedLayer>) {
  const materialProps = getPropsFromLayer(material)

  const jsx = `
    <LayerMaterial${materialProps}>
      ${layers
        .map((layer) => {
          const props = getPropsFromLayer(layer)
          return `<${layer.constructor}${props} />`
        })
        .join('\n\t')}
    </LayerMaterial>
    `

  return jsx
}

function getJSPropsFromLayer(layer: SerializedLayer) {
  // @ts-ignore
  const constructor = LAYERS[layer.constructor]
  const instance = new constructor()
  let props = '\t'
  // @ts-ignore
  let entries = Object.entries(layer.properties)
  entries.forEach(([key, val], idx) => {
    var _constructor
    const eol = '\n\t\t'
    if (key.includes('color')) {
      // @ts-ignore
      const v = typeof val === 'string' ? val : '#' + val.getHexString()
      props += `${key}: ${JSON.stringify(v)},${eol}`
    } else {
      const defaultVal = (_constructor = constructor['u_' + key]) != null ? _constructor : instance[key]
      switch (key) {
        case 'name':
          if (val !== layer.constructor) props += `${key}: ${JSON.stringify(val)},${eol}`
          break

        case 'visible':
          if (!val) props += `${key}:${JSON.stringify(val)},${eol}`
          break

        default:
          if (val !== defaultVal) props += `${key}: ${JSON.stringify(val)},${eol}`
          break
      }
    }
  })
  return props
}

export function serializedLayersToJS(layers: SerializedLayer[], material: SerializedLayer) {
  const materialProps = getJSPropsFromLayer(material)
  const jsLayers = `${layers
    .map((l) => {
      return `new ${l.constructor}({
      ${getJSPropsFromLayer(l)}
      })`
    })
    .join(',\n\t\t')}`

  const js = `
  new LayerMaterial({
    ${materialProps}
    layers: [
      ${jsLayers}
    ]
  })`

  return js
}

function isValidHttpUrl(string: string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

async function toDataURL(url: string) {
  var xhr = new XMLHttpRequest()

  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()

  return new Promise((res, rej) => {
    xhr.onload = function () {
      var reader = new FileReader()
      reader.onloadend = function () {
        res(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
  })
}

export async function downloadObjectAsJson(exportObj: LaminaMaterialFile | LaminaLayerFile, exportName: string) {
  const obj = structuredClone(exportObj)

  if (obj.metadata.type === 'mat') {
    const o = obj as LaminaMaterialFile

    await Promise.all(
      o.layers.map(async (layer) => {
        await Promise.all(
          Object.entries(layer.currents).map(async ([key, val]) => {
            if (isValidHttpUrl(val)) {
              layer.currents[key] = await toDataURL(val)
            }
          })
        )
      })
    )
  } else {
    const o = obj as LaminaLayerFile
    await Promise.all(
      Object.entries(o.base.currents).map(async ([key, val]) => {
        if (isValidHttpUrl(val)) {
          o.base.currents[key] = await toDataURL(val)
        }
      })
    )
  }

  var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj))
  var downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', exportName + '.lamina')
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}
