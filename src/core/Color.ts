import Abstract from './Abstract'
import { Color as THREEColor, ColorRepresentation, IUniform } from 'three'
import { BaseProps, BlendMode, BlendModes } from '../types'

export default class Color extends Abstract {
  name: string = 'Color'
  mode: BlendMode = 'normal'
  protected uuid: string = Abstract.genID()

  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: BaseProps) {
    super()
    const { color, alpha, mode } = props || {}

    this.uniforms = {
      [`u_${this.uuid}_color`]: {
        value: new THREEColor(color ?? '#ffffff'),
      },
      [`u_${this.uuid}_alpha`]: {
        value: alpha ?? 1,
      },
    }

    this.mode = mode || 'normal'
  }

  getFragmentVariables() {
    return `    
    uniform float u_${this.uuid}_alpha;
    uniform vec3 u_${this.uuid}_color;
`
  }

  getFragmentBody(e: string) {
    return `    
      ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(u_${this.uuid}_color, u_${this.uuid}_alpha)`
    )};
  `
  }

  set color(v: ColorRepresentation) {
    this.uniforms[`u_${this.uuid}_color`].value = new THREEColor(v)
  }
  get color() {
    return this.uniforms[`u_${this.uuid}_color`].value
  }
  set alpha(v: number) {
    this.uniforms[`u_${this.uuid}_alpha`].value = v
  }
  get alpha() {
    return this.uniforms[`u_${this.uuid}_alpha`].value
  }

  // Schema
  getSchema() {
    return [
      {
        label: 'Color',
        value: new THREEColor(this.color).toArray(),
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
    ]
  }

  serialize() {
    return {
      type: 'Color',
      name: this.name,
      uuid: this.uuid,
      settings: {
        color: '#' + new THREEColor(this.color).getHexString(),
        alpha: this.alpha,
        mode: this.mode,
      },
      defaults: {
        color: '#ffffff',
        alpha: 1,
        mode: 'normal',
      },
    }
  }
}
