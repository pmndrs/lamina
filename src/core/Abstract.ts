import { getUniform } from '../utils/Functions'
import { IUniform, MathUtils } from 'three'
import { BlendMode, BlendModes, DebugSchema, LayerProps, SerializedLayer } from '../types'

export default class Abstract {
  static genID() {
    return MathUtils.generateUUID().replaceAll('-', '_')
  }

  uuid: string = MathUtils.generateUUID().replaceAll('-', '_')
  name: string = 'Depth'
  mode: BlendMode = 'normal'
  visible: boolean = true
  alpha = 1
  uniforms: {
    [key: string]: IUniform<any>
  }

  constructor(props?: LayerProps, c?: any) {
    const defaults = Object.getOwnPropertyNames(c).filter((e) => e.startsWith('u_'))
    const uniforms: { [key: string]: any } = defaults.reduce(
      (a, v) => ({ ...a, [v.slice(1)]: Object.getOwnPropertyDescriptor(c, v)?.value }),
      {}
    )

    for (const key in uniforms) {
      if (props?.[key]) uniforms[key] = props[key]
    }

    this.uniforms = {}
    const properties: PropertyDescriptorMap & ThisType<any> = {}
    Object.keys(uniforms).map((key) => {
      this.uniforms[`u_${this.uuid}_${key}`] = {
        value: getUniform(key, uniforms[key]),
      }

      properties[key] = {
        set: (v: any) => {
          this.uniforms[`u_${this.uuid}_${key}`].value = getUniform(key, uniforms[key])
        },
        get: () => {
          return this.uniforms[`u_${this.uuid}_${key}`].value
        },
      }
    })

    if (props?.name) this.name = props.name
    if (props?.mode) this.mode = props.mode
    if (props?.visible) this.visible = props.visible
    if (props?.alpha) this.alpha = props.alpha

    Object.defineProperties(this, properties)
  }

  getBlendMode(type: number, a: string, b: string) {
    if (type === BlendModes['normal']) return `sc_copy(${a}, ${b})`
    else if (type === BlendModes['add']) return `sc_add(${a}, ${b})`
    else if (type === BlendModes['subtract']) return `sc_subtract(${a}, ${b})`
    else if (type === BlendModes['multiply']) return `sc_multiply(${a}, ${b})`
    else if (type === BlendModes['addsub']) return `sc_addSub(${a}, ${b})`
    else if (type === BlendModes['lighten']) return `sc_lighten(${a}, ${b})`
    else if (type === BlendModes['darken']) return `sc_darken(${a}, ${b})`
    else if (type === BlendModes['divide']) return `sc_divide(${a}, ${b})`
    else if (type === BlendModes['overlay']) return `sc_overlay(${a}, ${b})`
    else if (type === BlendModes['screen']) return `sc_screen(${a}, ${b})`
    else if (type === BlendModes['softlight']) return `sc_softLight(${a}, ${b})`
    else if (type === BlendModes['switch']) return `sc_switch(${a}, ${b})`
  }

  getVertexVariables(): string {
    return ''
  }
  getVertexBody(e?: string): string {
    return ''
  }

  serialize(): SerializedLayer | null {
    return null
  }

  static Schema: DebugSchema[]
}
