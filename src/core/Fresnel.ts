import { FresnelProps, BlendMode, BlendModes } from '../types'
import { Color, ColorRepresentation, IUniform } from 'three'
import Abstract from './Abstract'

export default class Fresnel extends Abstract {
  name: string = 'Fresnel'
  mode: BlendMode = 'normal'
  uuid: string = Abstract.genID()
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: FresnelProps) {
    super()
    const { alpha, mode, color, bias, intensity, power } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
      [`u_${this.uuid}_color`]: {
        value: new Color(color ?? '#ffffff'),
      },
      [`u_${this.uuid}_bias`]: {
        value: bias ?? 0,
      },
      [`u_${this.uuid}_intensity`]: {
        value: intensity ?? 1,
      },
      [`u_${this.uuid}_power`]: {
        value: power ?? 2,
      },
    }

    this.mode = mode || 'normal'
  }

  getVertexVariables(): string {
    return /* glsl */ `
    varying vec3 v_${this.uuid}_worldPosition;
    varying vec3 v_${this.uuid}_worldNormal;
    `
  }

  getVertexBody(e: string): string {
    return /* glsl */ `
    v_${this.uuid}_worldPosition = normalize(vec3(modelViewMatrix * vec4(position, 1.0)).xyz);
    v_${this.uuid}_worldNormal = normalize(normalMatrix * normal);
    `
  }

  getFragmentVariables() {
    return /* glsl */ `    
    uniform float u_${this.uuid}_alpha;
    uniform vec3 u_${this.uuid}_color;
    uniform float u_${this.uuid}_bias;
    uniform float u_${this.uuid}_intensity;
    uniform float u_${this.uuid}_power;
    uniform float u_${this.uuid}_factor;

    varying vec3 v_${this.uuid}_worldPosition;
    varying vec3 v_${this.uuid}_worldNormal;
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
      float f_${this.uuid}_a = ( 1.0 - -min(dot(v_${this.uuid}_worldPosition, normalize(v_${
      this.uuid
    }_worldNormal) ), 0.0) );
      float f_${this.uuid}_fresnel = u_${this.uuid}_bias + (u_${this.uuid}_intensity * pow(f_${this.uuid}_a, u_${
      this.uuid
    }_power));

      ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(u_${this.uuid}_color * f_${this.uuid}_fresnel, u_${this.uuid}_alpha)`
    )};
  `
  }

  set alpha(v: number) {
    this.uniforms[`u_${this.uuid}_alpha`].value = v
  }
  get alpha() {
    return this.uniforms[`u_${this.uuid}_alpha`].value
  }

  set color(v: ColorRepresentation) {
    this.uniforms[`u_${this.uuid}_color`].value = new Color(v)
  }
  get color() {
    return this.uniforms[`u_${this.uuid}_color`].value
  }
  set bias(v: number) {
    this.uniforms[`u_${this.uuid}_bias`].value = v
  }
  get bias() {
    return this.uniforms[`u_${this.uuid}_bias`].value
  }
  set intensity(v: number) {
    this.uniforms[`u_${this.uuid}_intensity`].value = v
  }
  get intensity() {
    return this.uniforms[`u_${this.uuid}_intensity`].value
  }
  set power(v: number) {
    this.uniforms[`u_${this.uuid}_power`].value = v
  }
  get power() {
    return this.uniforms[`u_${this.uuid}_power`].value
  }
}
