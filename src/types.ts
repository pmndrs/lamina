import { ColorRepresentation } from 'three'

export const BlendModes = {
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
  origin?: number[]
  isVector?: boolean
}

export interface FresnelProps {
  color?: ColorRepresentation
  alpha?: number
  mode?: BlendMode
  intensity?: number
  scale?: number
  bias?: number
}

export interface NoiseProps {
  color?: ColorRepresentation
  alpha?: number
  mode?: BlendMode
  scale?: number
}
