import AbstractLayer from './AbstractLayer'
import { Color, ColorRepresentation, IUniform } from 'three'
import { BaseLayerProps, LayerBlendMode, SC_BLEND_MODES } from '../types'

export default class BaseLayer extends AbstractLayer {
  name: string = 'Base'
  protected uuid: string = AbstractLayer.genID()

  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: BaseLayerProps) {
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
        value: SC_BLEND_MODES[mode ?? 'normal'],
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
  set mode(v: LayerBlendMode) {
    this.uniforms[`u_${this.uuid}_mode`].value = SC_BLEND_MODES[v]
  }
  get mode() {
    return this.uniforms[`u_${this.uuid}_mode`].value
  }
}
