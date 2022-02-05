import { Color, ColorRepresentation, IUniform, Texture } from 'three'
import { BlendMode, NoiseProps, BlendModes, TextureProps } from '../types'
import Abstract from './Abstract'

export default class Noise extends Abstract {
  name: string = 'Texture'
  mode: BlendMode = 'texture'
  uuid: string = Abstract.genID()
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: TextureProps) {
    super()
    const { alpha, mode, map } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
      [`u_${this.uuid}_map`]: {
        value: map,
      },
    }
    this.mode = mode || 'normal'
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
    uniform sampler2D u_${this.uuid}_map;

    varying vec2 v_${this.uuid}_uv;
    // ************************************
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
      // SC: Fresnel layer frag-shader-code ***************************************************
      vec4 f_${this.uuid}_texture = texture2D(u_${this.uuid}_map, v_${this.uuid}_uv);

      ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(f_${this.uuid}_texture.xyz, f_${this.uuid}_texture.a * u_${this.uuid}_alpha)`
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
  set map(v: Texture) {
    this.uniforms[`u_${this.uuid}_map`].value = v
  }
  get map() {
    return this.uniforms[`u_${this.uuid}_map`].value
  }
}
