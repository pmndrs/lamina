import { IUniform, MathUtils } from 'three'
import { BlendMode, BlendModes } from '../types'

export default abstract class Abstract {
  public abstract uuid: string
  public abstract name: string
  public abstract mode: BlendMode
  public abstract uniforms: {
    [key: string]: IUniform<any>
  }

  public abstract getFragmentVariables(): string
  public abstract getFragmentBody(e?: string): string

  static genID() {
    return MathUtils.generateUUID().replaceAll('-', '_')
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
}
