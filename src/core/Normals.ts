import { Color, ColorRepresentation, IUniform, Vector3 } from 'three'
import { BlendMode, NoiseProps, BlendModes, NormalsProps } from '../types'
import Abstract from './Abstract'

export default class Noise extends Abstract {
  name: string = 'Normals'
  mode: BlendMode = 'normal'
  protected uuid: string = Abstract.genID()
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: NormalsProps) {
    super()
    const { alpha, mode, direction } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
      [`u_${this.uuid}_direction`]: {
        value: direction,
      },
    }
    this.mode = mode || 'normal'
  }

  getVertexVariables(): string {
    return /* glsl */ `
    varying vec3 v_${this.uuid}_normals;
    `
  }

  getVertexBody(e: string): string {
    return /* glsl */ `
    v_${this.uuid}_normals = normal;
    `
  }

  getFragmentVariables() {
    return /* glsl */ `    
    // SC: Fresnel layer variables **********
    uniform float u_${this.uuid}_alpha;
    uniform vec3 u_${this.uuid}_color;
    uniform vec3 u_${this.uuid}_direction;

    varying vec3 v_${this.uuid}_normals;
    // ************************************
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
      // SC: Fresnel layer frag-shader-code ***************************************************
      vec3 f_${this.uuid}_normalColor = vec3(1.);
      f_${this.uuid}_normalColor.x = v_${this.uuid}_normals.x * u_${this.uuid}_direction.x;
      f_${this.uuid}_normalColor.y = v_${this.uuid}_normals.y * u_${this.uuid}_direction.y;
      f_${this.uuid}_normalColor.z = v_${this.uuid}_normals.z * u_${this.uuid}_direction.z;

      ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(f_${this.uuid}_normalColor, u_${this.uuid}_alpha)`
    )};
      // *************************************************************************************
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
  set direction(v: Vector3) {
    this.uniforms[`u_${this.uuid}_direction`].value = v
  }
  get direction() {
    return this.uniforms[`u_${this.uuid}_direction`].value
  }
}
