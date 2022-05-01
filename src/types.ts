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

export type NoiseType = 'perlin' | 'simplex' | 'cell' | 'curl' | 'white'

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
  lambert: THREE.MeshLambertMaterial,
  standard: THREE.MeshStandardMaterial,
}

export type ShadingType = 'phong' | 'physical' | 'toon' | 'basic' | 'lambert' | 'standard'

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

  onUniformsParse?: (self: Abstract & any) => void
  onNonUniformsParse?: (self: Abstract & any) => void
  onShaderParse?: (self: Abstract & any) => void

  [key: string]: any
}

export interface ColorProps extends LayerProps {
  color?: THREE.ColorRepresentation | THREE.Color
  alpha?: number
}
export interface NormalProps extends LayerProps {
  direction?: THREE.Vector3 | [number, number, number]
  alpha?: number
}

export interface DepthProps extends LayerProps {
  colorA?: THREE.ColorRepresentation | THREE.Color
  colorB?: THREE.ColorRepresentation | THREE.Color
  alpha?: number
  near?: number
  far?: number
  origin?: THREE.Vector3 | [number, number, number]
  mapping?: 'vector' | 'world' | 'camera'
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
  offset?: THREE.Vector3 | [number, number, number]
}
export interface DisplaceProps extends LayerProps {
  strength?: number
  scale?: number
  mapping?: MappingType
  type?: NoiseType
  offset?: THREE.Vector3 | [number, number, number]
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
  alpha?: number
}
export interface TextureProps extends LayerProps {
  map?: THREE.Texture
  alpha?: number
}

export interface ShaderProps extends LayerProps {
  vertex?: string
  fragment?: string
  alpha?: number

  onUniformsParse?: (self: Abstract & any) => void
  onNonUniformsParse?: (self: Abstract & any) => void
  onShaderParse?: (self: Abstract & any) => void

  [name: string]: any
}

export interface SerializedLayer {
  constructor: string
  fragment: string
  vertex: string
  uniforms: {
    [key: string]: any
  }
  nonUniforms: {
    [key: string]: any
  }
  currents: {
    [key: string]: any
  }
  functions: {
    onShaderParse?: string
    onNonUniformsParse?: string
    onUniformsParse?: string
  }
}

export interface SerializedBase {
  constructor: string
  currents: {
    [key: string]: any
  }
}

export interface LaminaMaterialFile {
  metadata: {
    version: number
    type: 'mat'
  }
  base: SerializedBase
  layers: SerializedLayer[]
}

export interface LaminaLayerFile {
  metadata: {
    version: number
    type: 'layer'
  }
  base: SerializedLayer
}
