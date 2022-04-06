import { ShaderProps } from '../types'
import { getUniform } from '../utils/Functions'
import Abstract from './Abstract'

export default class Shader extends Abstract {
  _fragment: string
  _vertex: string

  constructor(props?: ShaderProps) {
    super(
      Shader,
      {
        name: 'Shader',
        extern: true,
        ...props,
      },
      props?.onParse
    )
    this._fragment = ''
    this._vertex = ''

    return new Proxy(this, this)
  }

  set fragment(v: string) {
    this._fragment = v
    this.fragmentShader = v
    this.vertexShader = this._vertex
    this.buildShaders()
  }

  get fragment() {
    return this._fragment
  }

  set vertex(v: string) {
    this._vertex = v
    this.vertexShader = v
    this.fragmentShader = this._fragment
    this.buildShaders()
  }

  get vertex() {
    return this._vertex
  }

  get(target: this, name: string) {
    return target[name as keyof this]
  }

  set(target: this, name: string, val: any) {
    if (name.startsWith('u_')) {
      target.setUniform(target, name, val)
    }

    target[name as keyof this] = val
    return true
  }

  private setUniform(target: this, key: string, value: any) {
    const properties: PropertyDescriptorMap & ThisType<any> = {}

    const split = key.split('_')
    const propName = split[1]

    target.uniforms[`u_${target.uuid}_${propName}`] = {
      value: getUniform(value),
    }

    target.schema.push({
      value: value,
      label: propName,
    })

    properties[propName] = {
      set: (v: any) => {
        target.uniforms[`u_${target.uuid}_${propName}`].value = getUniform(v)
      },
      get: () => {
        return target.uniforms[`u_${target.uuid}_${propName}`].value
      },
    }

    Object.defineProperties(target, properties)
  }
}
