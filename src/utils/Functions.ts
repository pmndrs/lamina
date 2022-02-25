import { Color, Texture, Vector2, Vector3, Vector4 } from 'three'
import { LayerMaterialProps, SerializedLayer } from '../types'
import * as LAYERS from '../vanilla'

export function getUniform(value: any) {
  if (typeof value === 'string') {
    const v = new Color(value)
    v.convertLinearToSRGB()
    return v
  }

  return value
}

export function getSpecialParameters(label: string) {
  switch (label) {
    case 'alpha':
      return {
        min: 0,
        max: 1,
      }
    case 'scale':
      return {
        min: 0,
      }

    case 'map':
      return {
        image: undefined,
      }

    default:
      return {}
  }
}

export function getLayerMaterialArgs(props: LayerMaterialProps) {
  return [
    {
      color: props?.color,
      alpha: props?.alpha,
      lighting: props?.lighting,
      name: props?.name,
    },
  ] as any
}

export function serializeProp(prop: any) {
  if (prop instanceof Vector3 || prop instanceof Vector2 || prop instanceof Vector4) {
    return prop.toArray()
  } else if (prop instanceof Color) {
    return prop.toArray()
  } else if (prop instanceof Texture) {
    return prop.image.src
  }

  return prop
}

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

  navigator.clipboard.writeText(jsx)
  console.log(jsx)
}
