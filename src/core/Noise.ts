import { Color, ColorRepresentation, IUniform } from 'three'
import { BlendMode, NoiseProps, BlendModes, NoiseType, NoiseTypes, MappingType, MappingTypes } from '../types'
import Abstract from './Abstract'

export default class Noise extends Abstract {
  name: string = 'Noise'
  mode: BlendMode = 'normal'
  type: NoiseType = 'perlin'
  mapping: MappingType = 'uv'
  visible: boolean = true

  protected uuid: string = Abstract.genID()
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: NoiseProps) {
    super()
    const { alpha, mode, scale, colorA, colorB, type, mapping } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
      [`u_${this.uuid}_scale`]: {
        value: scale ?? 10,
      },
      [`u_${this.uuid}_colorA`]: {
        value: new Color(colorA ?? '#000000'),
      },
      [`u_${this.uuid}_colorB`]: {
        value: new Color(colorB ?? '#ffffff'),
      },
    }
    this.mode = mode || 'normal'
    this.type = type || 'perlin'
    this.mapping = mapping || 'local'
  }

  private getMapping() {
    switch (MappingTypes[this.mapping]) {
      case MappingTypes.uv:
        return `vec3(uv, 0.)`
      case MappingTypes.local:
        return `position`
      case MappingTypes.world:
        return `
        (modelMatrix * vec4(position,1.0)).xyz;
        `

      default:
        break
    }
  }

  private getNoise(e: string) {
    switch (NoiseTypes[this.type]) {
      case NoiseTypes.white:
        return `lamina_noise_white(${e})`
      case NoiseTypes.perlin:
        return `lamina_noise_perlin(${e})`
      case NoiseTypes.simplex:
        return `lamina_noise_simplex(${e})`
      case NoiseTypes.curl:
        return `lamina_noise_swirl(${e})`
      case NoiseTypes.cell:
        return `lamina_noise_worley(${e})`

      default:
        break
    }
  }

  getVertexVariables(): string {
    return /* glsl */ `
    varying vec3 v_${this.uuid}_position;
    `
  }

  getVertexBody(e: string): string {
    return /* glsl */ `
    v_${this.uuid}_position = ${this.getMapping()};
    `
  }

  getFragmentVariables() {
    return /* glsl */ `    
    uniform float u_${this.uuid}_alpha;
    uniform vec3 u_${this.uuid}_colorA;
    uniform vec3 u_${this.uuid}_colorB;
    uniform float u_${this.uuid}_scale;
    varying vec3 v_${this.uuid}_position;
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
      float f_${this.uuid}_noise = ${this.getNoise(`v_${this.uuid}_position * u_${this.uuid}_scale`)};
      vec3 f_${this.uuid}_noiseColor = mix(u_${this.uuid}_colorA, u_${this.uuid}_colorB, f_${this.uuid}_noise);

      ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(f_${this.uuid}_noiseColor, u_${this.uuid}_alpha)`
    )};
    `
  }

  set alpha(v: number) {
    this.uniforms[`u_${this.uuid}_alpha`].value = v
  }
  get alpha() {
    return this.uniforms[`u_${this.uuid}_alpha`].value
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
  set scale(v: number) {
    this.uniforms[`u_${this.uuid}_scale`].value = v
  }
  get scale() {
    return this.uniforms[`u_${this.uuid}_scale`].value
  }

  getSchema() {
    return [
      {
        label: 'Visible',
        value: this.visible,
        __constructorKey: 'visible',
      },
      {
        label: 'Color A',
        value: '#' + new Color(this.colorA).getHexString(),
        __constructorKey: 'colorA',
      },
      {
        label: 'Color B',
        value: '#' + new Color(this.colorB).getHexString(),
        __constructorKey: 'colorB',
      },
      {
        label: 'Alpha',
        value: this.alpha,
        min: 0,
        max: 1,
        __constructorKey: 'alpha',
      },
      {
        label: 'Scale',
        value: this.scale,
        __constructorKey: 'scale',
      },
      {
        label: 'Type',
        options: Object.keys(NoiseTypes),
        value: this.type,
        __constructorKey: 'type',
      },
      {
        label: 'Blend Mode',
        options: Object.keys(BlendModes),
        value: this.mode,
        __constructorKey: 'mode',
      },

      {
        label: 'Mapping',
        options: Object.keys(MappingTypes),
        value: this.mapping,
        __constructorKey: 'mapping',
      },
    ]
  }

  serialize() {
    return {
      type: 'Color',
      name: this.name,
      uuid: this.uuid,
      settings: {
        colorA: new Color(this.colorA).toArray(),
        colorB: new Color(this.colorB).toArray(),
        alpha: this.alpha,
        scale: this.scale,
        mode: this.mode,
        mapping: this.mapping,
        visible: this.visible,
      },
      defaults: {
        colorA: '#000000',
        colorB: '#ffffff',
        alpha: 1,
        scale: 10,
        mode: 'normal',
        mapping: 'local',
        visible: true,
      },
    }
  }
}
