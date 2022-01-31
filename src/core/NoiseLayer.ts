import { Color, ColorRepresentation, IUniform } from 'three'
import { LayerBlendMode, NoiseLayerProps, SC_BLEND_MODES } from '../types'
import AbstractLayer from './AbstractLayer'

export default class NoiseLayer extends AbstractLayer {
  name: string = 'Noise'
  protected uuid: string = AbstractLayer.genID()
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: NoiseLayerProps) {
    super()
    const { alpha, mode, scale, color } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
      [`u_${this.uuid}_mode`]: {
        value: SC_BLEND_MODES[mode ?? 'NORMAL'],
      },
      [`u_${this.uuid}_scale`]: {
        value: scale ?? 1,
      },
      [`u_${this.uuid}_color`]: {
        value: new Color(color ?? '#ffffff'),
      },
    }
  }

  getVertexVariables(): string {
    return /* glsl */ `
    varying vec2 v_${this.uuid}_uv;
    `
  }

  getVertexBody(e: string): string {
    return /* glsl */ `
    v_${this.uuid}_uv = uv;
    `
  }

  getFragmentVariables() {
    return /* glsl */ `    
    // SC: Fresnel layer variables **********
    uniform float u_${this.uuid}_alpha;
    uniform int u_${this.uuid}_mode;
    uniform vec3 u_${this.uuid}_color;
    uniform float u_${this.uuid}_scale;

    varying vec2 v_${this.uuid}_uv;
    // ************************************
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
      // SC: Fresnel layer frag-shader-code ***************************************************
      float f_${this.uuid}_noise = sc_rand(v_${this.uuid}_uv * u_${this.uuid}_scale);

      ${e} = sc_blend( vec4(u_${this.uuid}_color * f_${this.uuid}_noise, u_${this.uuid}_alpha), ${e}, u_${this.uuid}_mode );
      // *************************************************************************************
  `
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
  set color(v: ColorRepresentation) {
    this.uniforms[`u_${this.uuid}_color`].value = new Color(v)
  }
  get color() {
    return this.uniforms[`u_${this.uuid}_color`].value
  }
  set scale(v: number) {
    this.uniforms[`u_${this.uuid}_scale`].value = v
  }
  get scale() {
    return this.uniforms[`u_${this.uuid}_scale`].value
  }
}
