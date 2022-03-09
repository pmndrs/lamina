import { ColorProps } from '../types'
import Abstract from './Abstract'

export default class Color extends Abstract {
  static u_color = 'red'
  static u_alpha = 1

  static fragmentShader = `   
    uniform vec3 u_color;
    uniform float u_alpha;

    void main() {
      return vec4(u_color, u_alpha);
    }
  `

  constructor(props?: ColorProps) {
    super(Color, {
      name: 'Color',
      ...props,
    })
  }
}
