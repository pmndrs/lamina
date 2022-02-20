import { Color, ColorRepresentation } from "three";

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
