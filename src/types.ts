import { ColorRepresentation, Vector3 } from "three";
import { Abstract } from "./vanilla";

export const BlendModes: {
  [key: string]: string;
} = {
  normal: "normal",
  add: "add",
  subtract: "subtract",
  multiply: "multiply",
  addsub: "addsub",
  lighten: "lighten",
  darken: "darken",
  switch: "switch",
  divide: "divide",
  overlay: "overlay",
  screen: "screen",
  softlight: "softlight",
};

export type BlendMode =
  | "normal"
  | "add"
  | "subtract"
  | "multiply"
  | "addsub"
  | "lighten"
  | "darken"
  | "switch"
  | "divide"
  | "overlay"
  | "screen"
  | "softlight";

export const NoiseTypes: {
  [key: string]: string;
} = {
  perlin: "perlin",
  simplex: "simplex",
  cell: "cell",
  curl: "curl",
  white: "white",
};

export type NoiseType = "perlin" | "simplex" | "cell" | "curl";

export const MappingTypes: {
  [key: string]: string;
} = {
  local: "local",
  world: "world",
  uv: "uv",
};

export type MappingType = "local" | "world" | "uv";

export interface BaseProps {
  color?: ColorRepresentation;
  alpha?: number;
}

export interface LayerMaterialParameters {
  layers?: Abstract[];
  color?: ColorRepresentation;
  alpha?: number;
}
export interface LayerMaterialProps {
  color?: ColorRepresentation;
  alpha?: number;
}

export interface LayerProps {
  alpha?: number;
  mode?: BlendMode;
  name?: string;
  visible?: boolean;
  [key: string]: any;
}

export interface DepthProps extends LayerProps {
  colorA?: ColorRepresentation;
  colorB?: ColorRepresentation;
  near?: number;
  far?: number;
  origin?: Vector3;
  isVector?: boolean;
}

export interface ColorProps extends LayerProps {
  color?: ColorRepresentation;
}
export interface ShadingProps extends LayerProps {}

export interface NoiseProps extends LayerProps {
  colorA?: ColorRepresentation;
  colorB?: ColorRepresentation;
  colorC?: ColorRepresentation;
  colorD?: ColorRepresentation;

  mapping?: MappingType;
  type?: NoiseType;
}
