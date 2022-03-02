import { SerializedLayer } from 'src/types'
import * as LAYERS from '../vanilla'

function getPropsFromLayer(layer: SerializedLayer) {
  // @ts-ignore
  const constructor = LAYERS[layer.constructor]
  let props = ''
  Object.entries(layer.properties).forEach(([key, val]) => {
    const defaultVal = constructor['u_' + key]

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

export function serializedLayersToJSX(layers: SerializedLayer[], material: SerializedLayer) {
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
