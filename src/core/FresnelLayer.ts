import { FresnelLayerProps, LayerBlendMode, SC_BLEND_MODES } from '../types'
import { Color, ColorRepresentation, IUniform } from 'three'
import AbstractLayer from './AbstractLayer'

export default class FresnelLayer extends AbstractLayer {
  name: string = 'Fresnel'
  protected uuid: string = AbstractLayer.genID()
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: FresnelLayerProps) {
    super()
    const { alpha, mode, color, bias, scale, intensity, factor } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
      [`u_${this.uuid}_mode`]: {
        value: SC_BLEND_MODES[mode ?? 'NORMAL'],
      },
      [`u_${this.uuid}_color`]: {
        value: new Color(color ?? '#ffffff'),
      },
      [`u_${this.uuid}_bias`]: {
        value: bias ?? 0.1,
      },
      [`u_${this.uuid}_scale`]: {
        value: scale ?? 1,
      },
      [`u_${this.uuid}_intensity`]: {
        value: intensity ?? 2,
      },
      [`u_${this.uuid}_factor`]: {
        value: factor ?? 1,
      },
    }
  }

  getVertexVariables(): string {
    return /* glsl */ `
    varying vec3 v_${this.uuid}_worldPosition;
    varying vec3 v_${this.uuid}_worldNormal;
    `
  }

  getVertexBody(e: string): string {
    return /* glsl */ `
    v_${this.uuid}_worldPosition = vec3(vec4(position, 1.0) * modelMatrix);
    v_${this.uuid}_worldNormal = normalize(vec3(vec4(normal, 0.0) * modelMatrix));
    `
  }

  getFragmentVariables() {
    return /* glsl */ `    
    // SC: Fresnel layer variables **********
    uniform float u_${this.uuid}_alpha;
    uniform int u_${this.uuid}_mode;
    uniform vec3 u_${this.uuid}_color;
    uniform float u_${this.uuid}_bias;
    uniform float u_${this.uuid}_scale;
    uniform float u_${this.uuid}_intensity;
    uniform float u_${this.uuid}_factor;

    varying vec3 v_${this.uuid}_worldPosition;
    varying vec3 v_${this.uuid}_worldNormal;
    // ************************************
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
      // SC: Fresnel layer frag-shader-code ***************************************************
      vec3 f_${this.uuid}_worldViewDirection = normalize(cameraPosition - v_${this.uuid}_worldPosition);
      float f_${this.uuid}_fresnel = dot(f_${this.uuid}_worldViewDirection, v_${this.uuid}_worldNormal);
      f_${this.uuid}_fresnel = clamp((1.0 - f_${this.uuid}_fresnel) * u_${this.uuid}_intensity, 0., 1.);

      ${e} = sc_blend( vec4(u_${this.uuid}_color * f_${this.uuid}_fresnel, u_${this.uuid}_alpha), ${e}, u_${this.uuid}_mode );
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
  set bias(v: number) {
    this.uniforms[`u_${this.uuid}_bias`].value = v
  }
  get bias() {
    return this.uniforms[`u_${this.uuid}_bias`].value
  }
  set scale(v: number) {
    this.uniforms[`u_${this.uuid}_scale`].value = v
  }
  get scale() {
    return this.uniforms[`u_${this.uuid}_scale`].value
  }
  set intensity(v: number) {
    this.uniforms[`u_${this.uuid}_intensity`].value = v
  }
  get intensity() {
    return this.uniforms[`u_${this.uuid}_intensity`].value
  }
  set factor(v: number) {
    this.uniforms[`u_${this.uuid}_factor`].value = v
  }
  get factor() {
    return this.uniforms[`u_${this.uuid}_factor`].value
  }
}
