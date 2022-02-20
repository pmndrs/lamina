import { DepthProps } from "../types";
import Abstract from "./Abstract";

export default class Depth extends Abstract {
  static u_near = 0;
  static u_far = 1e7;
  static u_origin = [0, 0, 0];
  static u_colorA = "red";
  static u_colorB = "blue";
  static u_isVector = true;
  static u_alpha = 1;

  static vertexShader = `
  varying vec3 v_worldPosition;

  void main() {
    v_worldPosition = vec3(vec4(position, 1.0) * modelMatrix);
  }
  `;

  static fragmentShader = `   
    uniform float u_alpha;
    uniform float u_near;
    uniform float u_far;
    uniform float u_isVector;
    uniform vec3 u_origin;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
  
    varying vec3 v_worldPosition;

    void main() {
      vec3 f_base =  ( u_isVector > 0.5 ) ?  u_origin : cameraPosition;
      float f_dist = length(v_worldPosition.xyz - f_base);
      float f_dep = (f_dist - u_near) / (u_far - u_near);
      vec3 f_depth =  mix( u_colorB, u_colorA, 1.0 - clamp(f_dep, 0., 1.));
  
      return vec4(f_depth, u_alpha);
    }
  `;

  constructor(props?: DepthProps) {
    super(Depth, {
      name: "Depth",
      ...props,
    });
  }
}
