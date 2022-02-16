import { DepthProps, BlendMode, BlendModes } from '../types'
import { Vector3, Color, ColorRepresentation, IUniform } from 'three'
import Abstract from './Abstract'
import { getUniform } from '../utils/Functions'

export default class Depth extends Abstract {
  static u_near = 0
  static u_far = 1e7
  static u_origin = [0, 0, 0]
  static u_colorA = 'red'
  static u_colorB = 'blue'
  static u_isVector = true

  static v_worldPosition = 'vec3'

  static vertexShader = `
  varying vec3 v_worldPosition;

  void main() {
    v_worldPosition = vec3(vec4(position, 1.0) * modelMatrix);
  }
  `

  static fragmentShader = `   
    uniform float u_alpha;
    uniform float u_near;
    uniform float u_far;
    uniform float u_isVector;
    uniform vec3 u_origin;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
  
    varying vec3 v_worldPosition;

    vec3 main(vec4 input) {
      vec3 base =  ( u_isVector > 0.5 ) ?  u_origin : cameraPosition;
      float dist = length(v_worldPosition.xyz - base);
      float dep = (u_dist - u_near) / (u_far - u_near);
      vec3 depth =  mix( u_colorB, u_colorA, 1.0 - clamp(dep, 0., 1.));
  
      return depth
    }
  `

  constructor(props?: DepthProps) {
    super(props, Depth)
    console.log(this)
  }

  getVertexVariables(): string {
    return /* glsl */ `
    varying vec3 v_${this.uuid}_worldPosition;
    `
  }

  getVertexBody(e: string): string {
    return /* glsl */ `
    v_${this.uuid}_worldPosition = vec3(vec4(position, 1.0) * modelMatrix);
    `
  }

  getFragmentVariables() {
    return /* glsl */ `    
    uniform float u_${this.uuid}_alpha;
    uniform float u_${this.uuid}_near;
    uniform float u_${this.uuid}_far;
    uniform float u_${this.uuid}_isVector;
    uniform vec3 u_${this.uuid}_origin;
    uniform vec3 u_${this.uuid}_colorA;
    uniform vec3 u_${this.uuid}_colorB;

    varying vec3 v_${this.uuid}_worldPosition;
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
     
      vec3 f_${this.uuid}_base = ( u_${this.uuid}_isVector > 0.5 ) ?  u_${this.uuid}_origin : cameraPosition;
      float f_${this.uuid}_dist = length( v_${this.uuid}_worldPosition.xyz - f_${this.uuid}_base );
      float f_${this.uuid}_dep = ( f_${this.uuid}_dist - u_${this.uuid}_near ) / ( u_${this.uuid}_far - u_${
      this.uuid
    }_near );

      vec3 f_${this.uuid}_depth =  mix( u_${this.uuid}_colorB, u_${this.uuid}_colorA, 1.0 - clamp( f_${
      this.uuid
    }_dep, 0., 1. ) );

      ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(f_${this.uuid}_depth, u_${this.uuid}_alpha)`
    )};
  `
  }

  // set alpha(v: number) {
  //   this.uniforms[`u_${this.uuid}_alpha`].value = v
  // }
  // get alpha() {
  //   return this.uniforms[`u_${this.uuid}_alpha`].value
  // }

  // set near(v: number) {
  //   this.uniforms[`u_${this.uuid}_near`].value = v
  // }
  // get near() {
  //   return this.uniforms[`u_${this.uuid}_near`].value
  // }
  // set far(v: number) {
  //   this.uniforms[`u_${this.uuid}_far`].value = v
  // }
  // get far() {
  //   return this.uniforms[`u_${this.uuid}_far`].value
  // }
  // set origin(v: Vector3) {
  //   this.uniforms[`u_${this.uuid}_origin`].value = v
  // }
  // get origin() {
  //   return this.uniforms[`u_${this.uuid}_origin`].value
  // }
  // set colorA(v: ColorRepresentation) {
  //   this.uniforms[`u_${this.uuid}_colorA`].value = new Color(v)
  // }
  // get colorA() {
  //   return this.uniforms[`u_${this.uuid}_colorA`].value
  // }
  // set colorB(v: ColorRepresentation) {
  //   this.uniforms[`u_${this.uuid}_colorB`].value = new Color(v)
  // }
  // get colorB() {
  //   return this.uniforms[`u_${this.uuid}_colorB`].value
  // }
  // set isVector(v: boolean) {
  //   this.uniforms[`u_${this.uuid}_isVector`].value = v
  // }
  // get isVector() {
  //   return this.uniforms[`u_${this.uuid}_isVector`].value
  // }
}
