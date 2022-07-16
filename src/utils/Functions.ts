import { Color, Matrix3, Matrix4, sRGBEncoding, Texture, TextureLoader, Vector2, Vector3, Vector4 } from 'three'
import { LayerMaterialProps } from '../types'

export function isBlobUrl(url: string) {
  return /^blob:/.test(url)
}

export function isValidHttpUrl(url: string) {
  return /^(http|https):\/\//.test(url)
}

export function isDataUrl(url: string) {
  return /^data:image\//.test(url)
}

export function toDataUrl(url: string, callback: (data: string) => void) {
  var xhr = new XMLHttpRequest()
  xhr.onload = function () {
    var reader = new FileReader()
    reader.onloadend = function () {
      callback(reader.result as string)
    }
    reader.readAsDataURL(xhr.response)
  }
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}

export function isTextureSrc(src: string) {
  return isValidHttpUrl(src) || isDataUrl(src) || isBlobUrl(src)
}

export function getUniform(value: any) {
  if (isTextureSrc(value)) {
    return new TextureLoader().load(value, (t) => {
      t.encoding = sRGBEncoding
    })
  } else if (typeof value === 'string') {
    return new Color(value)
  } else {
    return value
  }
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

function roundToTwo(num: number) {
  return +Math.round((num + Number.EPSILON) * 100) / 100
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
    return (prop.toArray() as number[]).map((e) => roundToTwo(e))
  } else if (prop instanceof Color) {
    return '#' + prop.clone().getHexString()
  } else if (prop instanceof Texture) {
    return prop.image?.src
  }

  return typeof prop === 'number' ? roundToTwo(prop) : prop
}
