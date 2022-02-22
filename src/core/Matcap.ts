import { MatcapProps } from "../types";
import Abstract from "./Abstract";

// Credits: https://www.clicktorelease.com/blog/creating-spherical-environment-mapping-shader/

export default class Matcap extends Abstract {
  static u_alpha = 1;
  static u_map = undefined;

  static vertexShader = `
    varying vec3 v_position;
    varying vec3 v_normal;
    
    void main() {
      v_position = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
      v_normal = normalize( normalMatrix * normal );
    }
    `;

  static fragmentShader = ` 
		uniform sampler2D u_map;  
		uniform float u_alpha;  
		varying vec3 v_position;
		varying vec3 v_normal;

		
    void main() {
			vec3 f_r = reflect( v_position, v_normal );
			float f_m = 2. * sqrt( pow( f_r.x, 2. ) + pow( f_r.y, 2. ) + pow( f_r.z + 1., 2. ) );
			vec2 f_vN = f_r.xy / f_m + .5;

			vec3 f_base = texture2D(u_map, f_vN).rgb;

      return vec4(f_base, u_alpha);
    }
  `;

  constructor(props?: MatcapProps) {
    super(Matcap, {
      name: "Matcap",
      ...props,
    });
  }
}
