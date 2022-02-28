import { ColorRepresentation, Texture, Vector3 } from 'three'
import { Abstract } from './vanilla'

export const BlendModes: {
  [key: string]: string
} = {
  normal: 'normal',
  add: 'add',
  subtract: 'subtract',
  multiply: 'multiply',
  addsub: 'addsub',
  lighten: 'lighten',
  darken: 'darken',
  switch: 'switch',
  divide: 'divide',
  overlay: 'overlay',
  screen: 'screen',
  softlight: 'softlight',
}

export type BlendMode =
  | 'normal'
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'addsub'
  | 'lighten'
  | 'darken'
  | 'switch'
  | 'divide'
  | 'overlay'
  | 'screen'
  | 'softlight'

export const NoiseTypes: {
  [key: string]: string
} = {
  perlin: 'perlin',
  simplex: 'simplex',
  cell: 'cell',
  curl: 'curl',
  white: 'white',
}

export type NoiseType = 'perlin' | 'simplex' | 'cell' | 'curl'

export const MappingTypes: {
  [key: string]: string
} = {
  local: 'local',
  world: 'world',
  uv: 'uv',
}

export type MappingType = 'local' | 'world' | 'uv'

export type ShadingType = 'phong' | 'none'

export interface BaseProps {
  color?: ColorRepresentation
  alpha?: number
  name?: string
}

export interface LayerMaterialParameters {
  layers?: Abstract[]
  color?: ColorRepresentation
  alpha?: number
  lighting?: ShadingType
  name?: string
}
export type LayerMaterialProps = LayerMaterialParameters

export interface LayerProps {
  mode?: BlendMode
  name?: string
  visible?: boolean
  [key: string]: any
}

export interface DepthProps extends LayerProps {
  colorA?: ColorRepresentation
  colorB?: ColorRepresentation
  alpha?: number
  near?: number
  far?: number
  origin?: Vector3
  isVector?: boolean
}

export interface ColorProps extends LayerProps {
  color?: ColorRepresentation
  alpha?: number
}
export interface ShadingProps extends LayerProps {
  shininess?: number
  color?: ColorRepresentation
}

export interface NoiseProps extends LayerProps {
  colorA?: ColorRepresentation
  colorB?: ColorRepresentation
  colorC?: ColorRepresentation
  colorD?: ColorRepresentation
  alpha?: number
  mapping?: MappingType
  type?: NoiseType
  scale?: number
}
export interface DisplaceProps extends LayerProps {
  strength?: number
  scale?: number
  mapping?: MappingType
  type?: NoiseType
}

export interface FresnelProps extends LayerProps {
  color?: ColorRepresentation
  alpha?: number
  power?: number
  intensity?: number
  bias?: number
}
export interface GradientProps extends LayerProps {
  colorA?: ColorRepresentation
  colorB?: ColorRepresentation
  axes?: 'x' | 'y' | 'z'
  alpha?: number
  contrast?: number
  start?: number
  end?: number
  mapping?: MappingType
}

export interface MatcapProps extends LayerProps {
  map?: Texture
}
export interface TextureProps extends LayerProps {
  map?: Texture
}

export interface SerializedLayer {
  constructor: string
  properties: {
    [name: string]: any
  }
}
