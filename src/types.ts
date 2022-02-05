import { ColorRepresentation, Texture, Vector3 } from 'three'

export const BlendModes: {
  [key: string]: number
} = {
  normal: 1,
  add: 2,
  subtract: 3,
  multiply: 4,
  addsub: 5,
  lighten: 6,
  darken: 7,
  switch: 8,
  divide: 9,
  overlay: 10,
  screen: 11,
  softlight: 12,
}

export type BlendMode = keyof typeof BlendModes

export const NoiseTypes: {
  [key: string]: number
} = {
  white: 1,
  perlin: 2,
  simplex: 3,
}

export type NoiseType = keyof typeof NoiseTypes

export const MappingTypes: {
  [key: string]: number
} = {
  uv: 1,
  local: 2,
  world: 3,
}

export type MappingType = keyof typeof MappingTypes

export interface BaseProps {
  color?: ColorRepresentation
  alpha?: number
  mode?: BlendMode
}

export interface DepthProps {
  colorA?: ColorRepresentation
  colorB?: ColorRepresentation
  alpha?: number
  mode?: BlendMode
  near?: number
  far?: number
  origin?: Vector3
  isVector?: boolean
}

export interface FresnelProps {
  color?: ColorRepresentation
  alpha?: number
  mode?: BlendMode
  power?: number
  intensity?: number
  bias?: number
}

export interface NoiseProps {
  colorA?: ColorRepresentation
  colorB?: ColorRepresentation
  alpha?: number
  mode?: BlendMode
  scale?: number
  type?: NoiseType
  mapping?: MappingType
}

export interface NormalsProps {
  alpha?: number
  mode?: BlendMode
  direction?: Vector3
}

export interface TextureProps {
  alpha?: number
  mode?: BlendMode
  map?: Texture
}
