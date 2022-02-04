import { Color, ColorRepresentation, IUniform } from 'three'
import { BlendMode, NoiseProps, BlendModes } from '../types'
import Abstract from './Abstract'

export default class Noise extends Abstract {
  name: string = 'Noise'
  protected uuid: string = Abstract.genID()
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: NoiseProps) {
    super()
    const { alpha, mode, scale, color } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
      [`u_${this.uuid}_mode`]: {
        value: BlendModes[mode ?? 'normal'],
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
  set mode(v: BlendMode) {
    this.uniforms[`u_${this.uuid}_mode`].value = BlendModes[v]
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
