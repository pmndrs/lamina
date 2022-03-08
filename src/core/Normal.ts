import { Vector3 } from 'three'
import { NormalProps } from '../types'
import Abstract from './Abstract'

export default class Normal extends Abstract {
  static u_alpha = 1
  static u_direction = new Vector3(1, 1, 1)

  static vertexShader = `   
  varying vec3 v_normals; 

  void main() {
    v_normals = normal;
  }
`

  static fragmentShader = `   
  	uniform float u_alpha;
  	uniform vec3 u_color;
  	uniform vec3 u_direction;

		varying vec3 v_normals;

    void main() {
			vec3 f_normalColor = vec3(1.);
      f_normalColor.x = v_normals.x * u_direction.x;
      f_normalColor.y = v_normals.y * u_direction.y;
      f_normalColor.z = v_normals.z * u_direction.z;

      return vec4(f_normalColor, u_alpha);
    }
  `

  constructor(props?: NormalProps) {
    super(Normal, {
      name: 'Normal',
      ...props,
    })
  }
}
