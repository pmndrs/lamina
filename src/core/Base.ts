import Abstract from './Abstract'
import { Color, ColorRepresentation, IUniform } from 'three'
import { BaseProps, BlendMode, BlendModes } from '../types'

export default class Base extends Abstract {
  name: string = 'Base'
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
      [`u_${this.uuid}_mode`]: {
        value: BlendModes[mode ?? 'normal'],
      },
    }
  }

  getFragmentVariables() {
    return `    
    // SC: Base layer uniforms **********
    uniform float u_${this.uuid}_alpha;
    uniform int u_${this.uuid}_mode;
    uniform vec3 u_${this.uuid}_color;
    // ************************************
`
  }

  getFragmentBody(e: string) {
    return `    
      // SC: Base layer frag-shader-code ***************************************************
      ${e} = sc_blend( vec4(u_${this.uuid}_color, u_${this.uuid}_alpha), ${e}, u_${this.uuid}_mode );
      // *************************************************************************************
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
  set mode(v: BlendMode) {
    this.uniforms[`u_${this.uuid}_mode`].value = BlendModes[v]
  }
  get mode() {
    return this.uniforms[`u_${this.uuid}_mode`].value
  }
}
