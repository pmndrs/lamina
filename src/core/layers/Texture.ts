import { TextureProps } from '../../types'
import Abstract from './Abstract'

export default class Texture extends Abstract {
  static u_alpha = 1
  static u_map = null

  static vertexShader = `
    varying vec2 v_uv;
    
    void main() {
        v_uv = uv;
    }
    `

  static fragmentShader = ` 
		uniform sampler2D u_map;  
		uniform float u_alpha;  
		varying vec2 v_uv;

    void main() {
			vec3 f_color = texture2D(u_map, v_uv).rgb;
      return vec4(f_color, u_alpha);
    }
  `

  constructor(props?: TextureProps) {
    super(Texture, {
      name: 'Texture',
      ...props,
    })
  }
}
