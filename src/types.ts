import { ColorRepresentation } from 'three'

export const SC_BLEND_MODES = {
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

export type LayerBlendMode = keyof typeof SC_BLEND_MODES

export interface BaseLayerProps {
  color?: ColorRepresentation
  alpha?: number
  mode?: LayerBlendMode
}

export interface DepthLayerProps {
  colorA?: ColorRepresentation
  colorB?: ColorRepresentation
  alpha?: number
  mode?: LayerBlendMode
  near?: number
  far?: number
  origin?: number[]
  isVector?: boolean
}

export interface FresnelLayerProps {
  color?: ColorRepresentation
  alpha?: number
  mode?: LayerBlendMode
  intensity?: number
  scale?: number
  bias?: number
}

export interface NoiseLayerProps {
  color?: ColorRepresentation
  alpha?: number
  mode?: LayerBlendMode
  scale?: number
}
