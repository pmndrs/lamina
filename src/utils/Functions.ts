import { Color, TextureLoader } from "three";
import { LayerMaterialProps } from "../types";

export function getUniform(value: any) {
  if (typeof value === "string") {
    const v = new Color(value);
    v.convertLinearToSRGB();
    return v;
  }

  return value;
}

export function getSpecialParameters(label: string) {
  switch (label) {
    case "alpha":
      return {
        min: 0,
        max: 1,
      };
    case "scale":
      return {
        min: 0,
      };

    default:
      return {};
  }
}

export function getLayerMaterialArgs(props: LayerMaterialProps) {
  return [
    {
      color: props?.color,
      alpha: props?.alpha,
      lighting: props?.lighting,
    },
  ] as any;
}
