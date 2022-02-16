import { FresnelProps, BlendMode, BlendModes } from '../types'
import { Color, ColorRepresentation, IUniform } from 'three'
import Abstract from './Abstract'

export default class Fresnel extends Abstract {
  name: string = 'Fresnel'
  mode: BlendMode = 'normal'
  visible: boolean = true

  protected uuid: string = Abstract.genID()
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
        value: new Color(color ?? '#ff0000'),
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

  // Schema
  getSchema() {
    return [
      {
        label: 'Visible',
        value: this.visible,
        __constructorKey: 'visible',
      },
      {
        label: 'Color',
        value: '#' + new Color(this.color).getHexString(),
        __constructorKey: 'color',
      },
      {
        label: 'Alpha',
        value: this.alpha,
        min: 0,
        max: 1,
        __constructorKey: 'alpha',
      },
      {
        label: 'Blend Mode',
        options: Object.keys(BlendModes),
        value: this.mode,
        __constructorKey: 'mode',
      },
      {
        label: 'Power',
        value: this.power,
        __constructorKey: 'power',
      },
      {
        label: 'Intensity',
        value: this.intensity,
        __constructorKey: 'intensity',
      },
      {
        label: 'Bias',
        value: this.bias,
        __constructorKey: 'bias',
      },
    ]
  }

  serialize() {
    return {
      type: 'Fresnel',
      name: this.name,
      uuid: this.uuid,
      settings: {
        color: new Color(this.color).toArray(),
        alpha: this.alpha,
        mode: this.mode,
        power: this.power,
        intensity: this.intensity,
        bias: this.bias,
        visible: this.visible,
      },
      defaults: {
        color: '#ff0000',
        alpha: 1,
        mode: 'normal',
        power: 2,
        intensity: 1,
        bias: 0,
        visible: true,
      },
    }
  }
}
