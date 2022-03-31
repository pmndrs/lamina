import { Color, Matrix3, Matrix4, Texture, Vector2, Vector3, Vector4 } from 'three'
import { LayerMaterialProps } from '../types'

export function getUniform(value: any) {
  if (typeof value === 'string') {
    return new Color(value).convertLinearToSRGB()
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

export function getLayerMaterialArgs({ color, alpha, lighting, name, ...rest }: LayerMaterialProps & any = {}) {
  return [
    {
      color,
      alpha,
      lighting,
      name,
    },
    rest,
  ] as any
}

export function isSerializableType(prop: any) {
  return (
    prop instanceof Vector3 ||
    prop instanceof Vector2 ||
    prop instanceof Vector4 ||
    prop instanceof Matrix3 ||
    prop instanceof Matrix4
  )
}

export function serializeProp(prop: any) {
  if (isSerializableType(prop)) {
    return prop.toArray()
  } else if (prop instanceof Color) {
    return '#' + prop.clone().convertLinearToSRGB().getHexString()
  } else if (prop instanceof Texture) {
    return prop.image.src
  }

  return prop
}
