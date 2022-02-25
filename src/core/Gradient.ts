import { Vector3 } from "three";
import { GradientProps, MappingTypes } from "../types";
import Abstract from "./Abstract";

type AbstractExtended = Abstract & {
  axes: GradientProps["axes"];
  mapping: GradientProps["mapping"];
};

export default class Gradient extends Abstract {
  static u_colorA = "white";
  static u_colorB = "black";
  static u_alpha = 1;

  static u_start = 1;
  static u_end = -1;
  static u_contrast = 1;

  static vertexShader = `
		varying vec3 v_position;

		vod main() {
      v_position = lamina_mapping_template;
		}
  `;

  static fragmentShader = `   
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    uniform vec3 u_axis;
    uniform float u_alpha;
    uniform float u_start;
    uniform float u_end;
    uniform float u_contrast;

		varying vec3 v_position;

    void main() {

      float f_step = smoothstep(u_start, u_end, v_position.axes_template * u_contrast);
      vec3 f_color = mix(u_colorA, u_colorB, f_step);

      return vec4(f_color, u_alpha);
    }
  `;

  constructor(props?: GradientProps) {
    super(
      Gradient,
      {
        name: "Gradient",
        ...props,
      },
      null,
      {
        onParse: (self) => {
          const extendedSelf = self as AbstractExtended;

          if (!extendedSelf.axes) {
            extendedSelf.axes = props?.axes || "x";
            self.schema.push({
              value: extendedSelf.axes,
              label: "axes",
              options: ["x", "y", "z"],
            });
          }

          if (!extendedSelf.mapping) {
            extendedSelf.mapping = props?.mapping || "local";
            self.schema.push({
              value: extendedSelf.mapping,
              label: "mapping",
              options: Object.values(MappingTypes),
            });
          }

          const mapping = Gradient.getMapping(extendedSelf.mapping);

          self.vertexShader = self.vertexShader.replace(
            "lamina_mapping_template",
            mapping
          );
          self.fragmentShader = self.fragmentShader.replace(
            "axes_template",
            extendedSelf.axes
          );
        },
      }
    );
  }

  private static getMapping(type?: string) {
    switch (type) {
      default:
      case "local":
        return `position`;
      case "world":
        return `(modelMatrix * vec4(position,1.0)).xyz`;
      case "uv":
        return `vec3(uv, 0.)`;
    }
  }
}
