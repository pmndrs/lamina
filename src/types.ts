import { Schema } from 'leva/dist/declarations/src/types'
import { ColorRepresentation, Texture, Vector3 } from 'three'
import { Abstract } from './vanilla'

export type LayerMaterialParameters = {
  layers: Abstract[]
  color?: THREE.ColorRepresentation
  alpha?: number
  shadows?: boolean
}

export type LayerMaterialProps = JSX.IntrinsicElements['layerMaterial'] & {
  children?: React.ReactNode
} & LayerMaterialParameters

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
  curl: 4,
  cell: 5,
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

export interface LayerProps {
  alpha?: number
  mode?: BlendMode
  name?: string
  visible?: boolean
  [key: string]: any
}

export interface BaseProps {
  color?: ColorRepresentation
  alpha?: number
  mode?: BlendMode
}

export interface DepthProps extends LayerProps {
  colorA?: ColorRepresentation
  colorB?: ColorRepresentation
  near?: number
  far?: number
  origin?: Vector3
  isVector?: boolean
}

export interface GradientProps {
  colorA?: ColorRepresentation
  colorB?: ColorRepresentation
  alpha?: number
  mode?: BlendMode
  a?: Vector3
  b?: Vector3
  angle?: Vector3
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
  map?: Texture | string
}

export type DebugSchema = Omit<Schema[''], 'value'> & {
  label: string
  value: any
  __constructorKey: string
}

export interface SerializedLayer {
  type: string
  name: string
  uuid: string
  settings: {
    [name: string]: any
  }
  defaults: {
    [name: string]: any
  }
}

export interface SerializedMaterial {
  version: number
  name: string
  settings: {
    [name: string]: any
  }
  defaults: {
    [name: string]: any
  }
  layers: SerializedLayer[]
}
