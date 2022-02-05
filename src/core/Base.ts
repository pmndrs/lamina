import Abstract from './Abstract'
import { Color, ColorRepresentation, IUniform } from 'three'
import { BaseProps, BlendMode, BlendModes } from '../types'

export default class Base extends Abstract {
  name: string = 'Base'
  mode: BlendMode = 'normal'
  protected uuid: string = Abstract.genID()

  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: BaseProps) {
    super()
    const { color, alpha, mode } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_color`]: {
        value: new Color(color ?? '#ffffff'),
      },
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
    }

    this.mode = mode || 'normal'
  }

  getFragmentVariables() {
    return `    
    uniform float u_${this.uuid}_alpha;
    uniform vec3 u_${this.uuid}_color;
`
  }

  getFragmentBody(e: string) {
    return `    
      ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(u_${this.uuid}_color, u_${this.uuid}_alpha)`
    )};
  `
  }

  set color(v: ColorRepresentation) {
    this.uniforms[`u_${this.uuid}_color`].value = new Color(v)
  }
  get color() {
    return this.uniforms[`u_${this.uuid}_color`].value
  }
  set alpha(v: number) {
    this.uniforms[`u_${this.uuid}_alpha`].value = v
  }
  get alpha() {
    return this.uniforms[`u_${this.uuid}_alpha`].value
  }
}
