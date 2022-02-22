import { FresnelProps } from "../types";
import Abstract from "./Abstract";

export default class Fresnel extends Abstract {
  static u_color = "white";
  static u_alpha = 1;
  static u_bias = 0;
  static u_intensity = 1;
  static u_power = 2;

  static vertexShader = `
    varying vec3 v_worldPosition;
    varying vec3 v_worldNormal;

    void main() {
        v_worldPosition = normalize(vec3(modelViewMatrix * vec4(position, 1.0)).xyz);
        v_worldNormal = normalize(normalMatrix * normal);
    }
  `;

  static fragmentShader = `   
    uniform vec3 u_color;
    uniform float u_alpha;
    uniform float u_bias;
    uniform float u_intensity;
    uniform float u_power;

    varying vec3 v_worldPosition;
    varying vec3 v_worldNormal;

    void main() {
        float f_a = ( 1.0 - -min(dot(v_worldPosition, normalize(v_worldNormal) ), 0.0) );
        float f_fresnel = u_bias + (u_intensity * pow(f_a, u_power));

        return vec4(f_fresnel * u_color, u_alpha);
    }
  `;

  constructor(props?: FresnelProps) {
    super(Fresnel, {
      name: "Fresnel",
      ...props,
    });
  }
}
