import AbstractLayer from './AbstractLayer'
import { Color, IUniform } from 'three'
import { LayerBlendMode, SC_BLEND_MODES } from '../types'

export default class BaseLayer extends AbstractLayer {
  name: string = 'Base'
  protected uuid: string

  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor() {
    super()
    this.uuid = AbstractLayer.genID()

    this.uniforms = {
      [`u_${this.uuid}_color`]: {
        value: new Color('#ffffff'),
      },
      [`u_${this.uuid}_alpha`]: {
        value: 1,
      },
      [`u_${this.uuid}_mode`]: {
        value: 1,
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

  set color(v: Color) {
    this.uniforms[`u_${this.uuid}_color`].value = v
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
  set mode(v: LayerBlendMode) {
    this.uniforms[`u_${this.uuid}_mode`].value = SC_BLEND_MODES[v]
  }
  get mode() {
    return this.uniforms[`u_${this.uuid}_mode`].value
  }
}
