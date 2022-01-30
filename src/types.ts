import { Color } from "three";

export const SC_BLEND_MODES = {
  NORMAL: 1,
  ADD: 2,
  SUBSTRACT: 3,
  MULTIPLY: 4,
  ADDSUB: 5,
  LIGHTEN: 6,
  DARKEN: 7,
  SWITCH: 8,
  DIVIDE: 9,
  OVERLAY: 10,
  SCREEN: 11,
  SOFTLIGHT: 12
};

export type LayerBlendMode = keyof typeof SC_BLEND_MODES;

export interface BaseLayerProps {
  color?: Color;
  alpha?: number;
  mode?: LayerBlendMode;
}

export interface DepthLayerProps {
  colorA?: Color;
  colorB?: Color;
  alpha?: number;
  mode?: LayerBlendMode;
  near?: number;
  far?: number;
  origin?: number[];
  isVector?: boolean;
}

export interface FresnalLayerProps {
  color?: Color;
  alpha?: number;
  mode?: LayerBlendMode;
  intensity?: number;
  factor?: number;
  scale?: number;
  bias?: number;
}

export interface NoiseLayerProps {
  color?: Color;
  alpha?: number;
  mode?: LayerBlendMode;
  scale?: number;
}
