import { ShaderProps } from '../../types'
import Abstract from './Abstract'

export default class Shader extends Abstract {
  _fragment: string
  _vertex: string

  constructor(props?: ShaderProps) {
    super(Shader, {
      name: 'Shader',
      extern: true,
      ...props,
    })
    this._fragment = ''
    this._vertex = ''

    return new Proxy(this, this)
  }

  set fragment(v: string) {
    this._fragment = v
    this.raw.fragment = v
    this.raw.vertex = this._vertex
    this.buildShaders()
    this.__updateMaterial?.()
  }

  get fragment() {
    return this._fragment
  }

  set vertex(v: string) {
    this._vertex = v
    this.raw.vertex = v
    this.raw.fragment = this._fragment
    this.buildShaders()
    this.__updateMaterial?.()
  }

  get vertex() {
    return this._vertex
  }

  get(target: this, name: string) {
    return target[name as keyof this]
  }

  set(target: this, name: string, val: any) {
    if (name.startsWith('u_')) {
      const key = name.split('u_')[1]

      if (target.raw.uniforms[key] === undefined) {
        target.raw.uniforms[key] = val
        target.buildUniforms()
      }

      target[key as keyof this] = val
      return true
    }

    target[name as keyof this] = val
    return true
  }
}
