import { Color, ColorRepresentation, IUniform, Vector3 } from 'three'
import { BlendMode, BlendModes, NormalsProps } from '../types'
import Abstract from './Abstract'

export default class Normals extends Abstract {
  name: string = 'Normals'
  mode: BlendMode = 'normal'
  visible: boolean = true

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
        value: direction ?? new Vector3(1, 1, 1),
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
    uniform float u_${this.uuid}_alpha;
    uniform vec3 u_${this.uuid}_direction;

    varying vec3 v_${this.uuid}_normals;
`
  }

  getFragmentBody(e: string) {
    return /* glsl */ `    
      vec3 f_${this.uuid}_normalColor = vec3(1.);
      f_${this.uuid}_normalColor.x = v_${this.uuid}_normals.x * u_${this.uuid}_direction.x;
      f_${this.uuid}_normalColor.y = v_${this.uuid}_normals.y * u_${this.uuid}_direction.y;
      f_${this.uuid}_normalColor.z = v_${this.uuid}_normals.z * u_${this.uuid}_direction.z;

      ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(packNormalToRGB(f_${this.uuid}_normalColor), u_${this.uuid}_alpha)`
    )};
  `
  }

  set alpha(v: number) {
    this.uniforms[`u_${this.uuid}_alpha`].value = v
  }
  get alpha() {
    return this.uniforms[`u_${this.uuid}_alpha`].value
  }
  set direction(v: Vector3) {
    this.uniforms[`u_${this.uuid}_direction`].value = v
  }
  get direction() {
    return this.uniforms[`u_${this.uuid}_direction`].value
  }

  getSchema() {
    return [
      {
        label: 'Visible',
        value: this.visible,
        __constructorKey: 'visible',
      },
      {
        label: 'Alpha',
        value: this.alpha,
        min: 0,
        max: 1,
        __constructorKey: 'alpha',
      },
      {
        label: 'Direction',
        value: this.direction,
        __constructorKey: 'direction',
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
        alpha: this.alpha,
        mode: this.mode,
        direction: this.direction,
        visible: this.visible,
      },
      defaults: {
        alpha: 1,
        mode: 'normal',
        direction: [1, 1, 1],
        visible: true,
      },
    }
  }
}
