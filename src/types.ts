import * as THREE from 'three'
import { Abstract } from './vanilla'

export const BlendModes: {
  [key: string]: string
} = {
  normal: 'normal',
  add: 'add',
  subtract: 'subtract',
  multiply: 'multiply',
  lighten: 'lighten',
  darken: 'darken',
  divide: 'divide',
  overlay: 'overlay',
  screen: 'screen',
  softlight: 'softlight',
  negation: 'negation',
  reflect: 'reflect',
}

export type BlendMode =
  | 'normal'
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'lighten'
  | 'darken'
  | 'divide'
  | 'overlay'
  | 'screen'
  | 'softlight'
  | 'reflect'
  | 'negation'

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

export const ShadingTypes: {
  [key: string]: new () => THREE.Material
} = {
  phong: THREE.MeshPhongMaterial,
  physical: THREE.MeshPhysicalMaterial,
  toon: THREE.MeshToonMaterial,
  basic: THREE.MeshBasicMaterial,
  depth: THREE.MeshDepthMaterial,
  lambert: THREE.MeshLambertMaterial,
  standard: THREE.MeshStandardMaterial,
}

export type ShadingType = 'none' | 'phong' | 'physical' | 'toon' | 'basic' | 'depth' | 'lambert' | 'standard'

export interface BaseProps {
  color?: THREE.ColorRepresentation | THREE.Color
  alpha?: number
  name?: string
}

export interface LayerMaterialParameters {
  layers?: Abstract[]
  color?: THREE.ColorRepresentation | THREE.Color
  alpha?: number
  lighting?: ShadingType
  name?: string
}
export type LayerMaterialProps = Omit<LayerMaterialParameters, 'layers'>

export interface LayerProps {
  mode?: BlendMode
  name?: string
  visible?: boolean
  [key: string]: any
}

export interface DepthProps extends LayerProps {
  colorA?: THREE.ColorRepresentation | THREE.Color
  colorB?: THREE.ColorRepresentation | THREE.Color
  alpha?: number
  near?: number
  far?: number
  origin?: THREE.Vector3 | [number, number, number]
  isVector?: boolean
  mapping?: 'vector' | 'camera' | 'world'
}

export interface ColorProps extends LayerProps {
  color?: THREE.ColorRepresentation | THREE.Color
  alpha?: number
}
export interface ShadingProps extends LayerProps {
  shininess?: number
  color?: THREE.ColorRepresentation | THREE.Color
}

export interface NoiseProps extends LayerProps {
  colorA?: THREE.ColorRepresentation | THREE.Color
  colorB?: THREE.ColorRepresentation | THREE.Color
  colorC?: THREE.ColorRepresentation | THREE.Color
  colorD?: THREE.ColorRepresentation | THREE.Color
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
  color?: THREE.ColorRepresentation | THREE.Color
  alpha?: number
  power?: number
  intensity?: number
  bias?: number
}
export interface GradientProps extends LayerProps {
  colorA?: THREE.ColorRepresentation | THREE.Color
  colorB?: THREE.ColorRepresentation | THREE.Color
  axes?: 'x' | 'y' | 'z'
  alpha?: number
  contrast?: number
  start?: number
  end?: number
  mapping?: MappingType
}

export interface MatcapProps extends LayerProps {
  map?: THREE.Texture
}
export interface TextureProps extends LayerProps {
  map?: THREE.Texture
}

export interface SerializedLayer {
  constructor: string
  properties: {
    [name: string]: any
  }
}
