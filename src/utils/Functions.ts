import { Color } from 'three'

export function getUniform(name: string, value: any) {
  switch (name) {
    case 'color':
    case 'colorA':
    case 'colorB':
      return new Color(value)

    default:
      return value
  }
}
