import { DepthLayerProps, LayerBlendMode, SC_BLEND_MODES } from '../types'
import { Vector3, Color, ColorRepresentation, IUniform } from 'three'
import AbstractLayer from './AbstractLayer'

export default class DepthLayer extends AbstractLayer {
  name: string = 'Depth'
  protected uuid: string = AbstractLayer.genID()
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: DepthLayerProps) {
    super()

    const { alpha, mode, colorA, colorB, near, far, origin, isVector } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
      [`u_${this.uuid}_mode`]: {
        value: SC_BLEND_MODES[mode ?? 'normal'],
      },
      [`u_${this.uuid}_near`]: {
        value: near ?? 700,
      },
      [`u_${this.uuid}_far`]: {
        value: far ?? 1e7,
      },
      [`u_${this.uuid}_origin`]: {
        value: origin ?? new Vector3(),
      },
      [`u_${this.uuid}_colorA`]: {
        value: new Color(colorA ?? '#ffffff'),
      },
      [`u_${this.uuid}_colorB`]: {
        value: new Color(colorB ?? '#ffffff'),
      },
      [`u_${this.uuid}_isVector`]: {
        value: isVector ?? true,
      },
    }
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
    // SC: Fresnel layer variables **********
    uniform float u_${this.uuid}_alpha;
    uniform int u_${this.uuid}_mode;
    uniform float u_${this.uuid}_near;
    uniform float u_${this.uuid}_far;
    uniform float u_${this.uuid}_isVector;
    uniform vec3 u_${this.uuid}_origin;
    uniform vec3 u_${this.uuid}_colorA;
    uniform vec3 u_${this.uuid}_colorB;

    varying vec3 v_${this.uuid}_worldPosition;
    // ************************************
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
      // SC: Depth layer frag-shader-code ***************************************************
     
      vec3 f_${this.uuid}_base = ( u_${this.uuid}_isVector > 0.5 ) ?  u_${this.uuid}_origin : cameraPosition;
      float f_${this.uuid}_dist = length( v_${this.uuid}_worldPosition.xyz - f_${this.uuid}_base );
      float f_${this.uuid}_dep = ( f_${this.uuid}_dist - u_${this.uuid}_near ) / ( u_${this.uuid}_far - u_${this.uuid}_near );

      vec3 f_${this.uuid}_depth =  mix( u_${this.uuid}_colorB, u_${this.uuid}_colorA, 1.0 - clamp( f_${this.uuid}_dep, 0., 1. ) );

      ${e} = sc_blend(vec4(f_${this.uuid}_depth, u_${this.uuid}_alpha), ${e}, u_${this.uuid}_mode );

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
  set near(v: number) {
    this.uniforms[`u_${this.uuid}_near`].value = v
  }
  get near() {
    return this.uniforms[`u_${this.uuid}_near`].value
  }
  set far(v: number) {
    this.uniforms[`u_${this.uuid}_far`].value = v
  }
  get far() {
    return this.uniforms[`u_${this.uuid}_far`].value
  }
  set origin(v: number[]) {
    this.uniforms[`u_${this.uuid}_origin`].value = v
  }
  get origin() {
    return this.uniforms[`u_${this.uuid}_origin`].value
  }
  set colorA(v: ColorRepresentation) {
    this.uniforms[`u_${this.uuid}_colorA`].value = new Color(v)
  }
  get colorA() {
    return this.uniforms[`u_${this.uuid}_colorA`].value
  }
  set colorB(v: ColorRepresentation) {
    this.uniforms[`u_${this.uuid}_colorB`].value = new Color(v)
  }
  get colorB() {
    return this.uniforms[`u_${this.uuid}_colorB`].value
  }
  set isVector(v: boolean) {
    this.uniforms[`u_${this.uuid}_isVector`].value = v
  }
  get isVector() {
    return this.uniforms[`u_${this.uuid}_isVector`].value
  }
}
