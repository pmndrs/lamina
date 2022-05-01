import { getSpecialParameters, getUniform, isSerializableType, serializeProp } from '../../utils/Functions'
import { Color, IUniform, MathUtils, Texture, Vector3 } from 'three'
import { BlendMode, BlendModes, LayerProps, SerializedLayer } from '../../types'
import hash from 'object-hash'

// @ts-ignore
import tokenize from 'glsl-tokenizer'
// @ts-ignore
import descope from 'glsl-token-descope'
// @ts-ignore
import stringify from 'glsl-token-string'
// @ts-ignore
import tokenFunctions from 'glsl-token-functions'

export default class Abstract {
  uuid: string
  name: string = 'LayerMaterial'
  mode: BlendMode = 'normal'
  visible: boolean = true
  uniforms: {
    [key: string]: IUniform<any>
  }

  onUniformsParse?: (self: Abstract & any) => {
    [key: string]: IUniform<any>
  } | void
  onNonUniformsParse?: (self: Abstract & any) => {
    [key: string]: any
  } | void
  onShaderParse?: (self: Abstract & any) => void

  fragmentShader: string
  vertexShader: string
  vertexVariables: string
  fragmentVariables: string

  raw: {
    fragment: string
    vertex: string
    constructor: new () => Abstract
    uniforms: {
      [key: string]: IUniform<any>
    }
    nonUniforms: {
      [key: string]: any
    }
  }

  schema: {
    value: any
    label: any
    options?: any[]
  }[]

  __updateMaterial?: () => void

  constructor(c: new () => Abstract, props?: LayerProps | null) {
    this.uuid = MathUtils.generateUUID().replace(/-/g, '_')
    this.uniforms = {}
    this.schema = []
    this.raw = {
      fragment: '',
      vertex: '',
      constructor: c,
      uniforms: {},
      nonUniforms: {
        mode: 'normal',
        visible: true,
      },
    }
    this.vertexShader = ''
    this.fragmentShader = ''
    this.vertexVariables = ''
    this.fragmentVariables = ''
    this.onShaderParse = props?.onShaderParse
    this.onUniformsParse = props?.onUniformsParse

    // if (props && typeof props === 'object') {
    //   Object.keys(props).map((key) => {
    //     if (props[key] !== undefined) {
    //       // @ts-ignore
    //       this[key] = props[key]
    //     }
    //   })
    // }

    // Remove Name field from Debugger until a way to
    // rename Leva folders is found
    // this.schema.push({
    //   value: this.name,
    //   label: 'name',
    // })

    this.schema.push({
      value: this.mode,
      label: 'mode',
      options: Object.values(BlendModes),
    })
    this.schema.push({
      value: this.visible,
      label: 'visible',
    })

    this.init()
  }

  init() {
    const defaults = Object.getOwnPropertyNames(this.raw.constructor)

    defaults.forEach((v) => {
      let value = Object.getOwnPropertyDescriptor(this.raw.constructor, v)?.value

      if (isSerializableType(value) || value instanceof Color) value = value.clone()

      if (v.startsWith('u_')) {
        this.raw.uniforms[v.split('u_')[1]] = value
      } else {
        switch (v) {
          case 'fragmentShader':
            this.raw.fragment = value
            break
          case 'vertexShader':
            this.raw.vertex = value
            break

          default:
            if (typeof value !== 'function' && !['prototype', 'length'].includes(v)) {
              this.raw.nonUniforms[v] = value
            }
            break
        }
      }
    })

    this.buildUniforms()
    this.buildNonUniforms()
    this.buildShaders()
  }

  buildUniforms() {
    const properties: PropertyDescriptorMap & ThisType<any> = {}
    Object.keys(this.raw.uniforms).map((propName) => {
      // @ts-ignore
      if (this[propName] === undefined) {
        this.uniforms[`u_${this.uuid}_${propName}`] = {
          value: getUniform(this.raw.uniforms[propName]),
        }

        this.schema.push({
          value: this.raw.uniforms[propName],
          label: propName,
        })

        properties[propName] = {
          set: (v: any) => {
            this.uniforms[`u_${this.uuid}_${propName}`].value = getUniform(v)
          },
          get: () => {
            return this.uniforms[`u_${this.uuid}_${propName}`].value
          },
        }
      }
    })

    const userDefinedUniforms = this.onUniformsParse?.(this) || {}
    Object.defineProperties(this, { ...properties, ...userDefinedUniforms })
  }

  buildNonUniforms() {
    const properties: PropertyDescriptorMap & ThisType<any> = {}
    Object.keys(this.raw.nonUniforms).map((propName) => {
      // @ts-ignore
      if (this[`_${propName}`] === undefined) {
        this.schema.push({
          value: this.raw.nonUniforms[propName],
          label: propName,
        })

        //@ts-ignore
        this[`_${propName}`] = this.raw.nonUniforms[propName]

        properties[propName] = {
          set: (v: any) => {
            //@ts-ignore
            this[`_${propName}`] = v
            this.buildShaders()
            this.__updateMaterial?.()
          },
          get: () => {
            // @ts-ignore
            return this[`_${propName}`]
          },
        }
      }
    })

    const userDefinedUniforms = this.onNonUniformsParse?.(this) || {}
    Object.defineProperties(this, { ...properties, ...userDefinedUniforms })
  }

  buildShaders() {
    const tokens = {
      vert: tokenize(this.raw.vertex),
      frag: tokenize(this.raw.fragment),
    }

    const descoped = {
      vert: descope(tokens.vert, this.renameTokens.bind(this)),
      frag: descope(tokens.frag, this.renameTokens.bind(this)),
    }

    const funcs = {
      vert: tokenFunctions(descoped.vert),
      frag: tokenFunctions(descoped.frag),
    }

    const mainIndex = {
      vert: funcs.vert
        .map((e: any) => {
          return e.name
        })
        .indexOf('main'),
      frag: funcs.frag
        .map((e: any) => {
          return e.name
        })
        .indexOf('main'),
    }

    const variables = {
      vert: mainIndex.vert >= 0 ? stringify(descoped.vert.slice(0, funcs.vert[mainIndex.vert].outer[0])) : '',
      frag: mainIndex.frag >= 0 ? stringify(descoped.frag.slice(0, funcs.frag[mainIndex.frag].outer[0])) : '',
    }

    const funcBodies = {
      vert: mainIndex.vert >= 0 ? this.getShaderFromIndex(descoped.vert, funcs.vert[mainIndex.vert].body) : '',
      frag: mainIndex.frag >= 0 ? this.getShaderFromIndex(descoped.frag, funcs.frag[mainIndex.frag].body) : '',
    }

    this.vertexShader = this.processFinal(funcBodies.vert, true)
    this.fragmentShader = this.processFinal(funcBodies.frag)
    this.vertexVariables = variables.vert
    this.fragmentVariables = variables.frag

    this.onShaderParse?.(this)
    // this.schema = this.schema.filter((value, index) => {
    //   const _value = value.label
    //   return (
    //     index ===
    //     this.schema.findIndex((obj) => {
    //       return obj.label === _value
    //     })
    //   )
    // })
  }

  renameTokens(name: string) {
    if (name.startsWith('u_')) {
      const slice = name.slice(2)
      return `u_${this.uuid}_${slice}`
    } else if (name.startsWith('v_')) {
      const slice = name.slice(2)
      return `v_${this.uuid}_${slice}`
    } else if (name.startsWith('f_')) {
      const slice = name.slice(2)
      return `f_${this.uuid}_${slice}`
    } else {
      return name
    }
  }

  processFinal(shader: string, isVertex?: boolean) {
    const s: string = shader.replace(/\sf_/gm, ` f_${this.uuid}_`).replace(/\(f_/gm, `(f_${this.uuid}_`)

    const returnValue = s.match(/^.*return.*$/gm)
    let sReplaced = s.replace(/^.*return.*$/gm, '')

    if (returnValue?.[0]) {
      const returnVariable = returnValue[0].replace('return', '').trim().replace(';', '')

      const blendMode = this.getBlendMode(returnVariable, 'lamina_finalColor')
      sReplaced += isVertex ? `lamina_finalPosition = ${returnVariable};` : `lamina_finalColor = ${blendMode};`
    }

    return sReplaced
  }

  getShaderFromIndex(tokens: any, index: number[]) {
    return stringify(tokens.slice(index[0], index[1]))
  }

  getBlendMode(b: string, a: string) {
    switch (this.mode) {
      default:
      case 'normal':
        return `lamina_blend_alpha(${a}, ${b}, ${b}.a)`
      case 'add':
        return `lamina_blend_add(${a}, ${b}, ${b}.a)`
      case 'subtract':
        return `lamina_blend_subtract(${a}, ${b}, ${b}.a)`
      case 'multiply':
        return `lamina_blend_multiply(${a}, ${b}, ${b}.a)`
      case 'lighten':
        return `lamina_blend_lighten(${a}, ${b}, ${b}.a)`
      case 'darken':
        return `lamina_blend_darken(${a}, ${b}, ${b}.a)`
      case 'divide':
        return `lamina_blend_divide(${a}, ${b}, ${b}.a)`
      case 'overlay':
        return `lamina_blend_overlay(${a}, ${b}, ${b}.a)`
      case 'screen':
        return `lamina_blend_screen(${a}, ${b}, ${b}.a)`
      case 'softlight':
        return `lamina_blend_softlight(${a}, ${b}, ${b}.a)`
      case 'reflect':
        return `lamina_blend_reflect(${a}, ${b}, ${b}.a)`
      case 'negation':
        return `lamina_blend_negation(${a}, ${b}, ${b}.a)`
    }
  }

  getHash() {
    const nonUniformKeys = Object.keys(this.raw.nonUniforms)
    const uniformKeys = Object.keys(this.raw.uniforms)
    const unifiedKeys = [...nonUniformKeys, ...uniformKeys]
    // @ts-ignore
    const values = unifiedKeys.map((key) => serializeProp(this[key]))
    return hash(values)
  }

  getSchema() {
    const latestSchema = this.schema.map(({ label, options, ...rest }) => {
      return {
        label,
        options,
        ...getSpecialParameters(label),
        ...rest,
        // @ts-ignore
        value: serializeProp(this[label]),
      }
    })

    return latestSchema
  }

  serialize(): SerializedLayer {
    const name = this.constructor.name.split('$')[0]

    const uniforms: { [key: string]: any } = {}
    Object.entries(this.raw.uniforms).forEach(([key, value]) => {
      uniforms[key] = serializeProp(value)
    })

    const nonUniforms: { [key: string]: any } = {}
    Object.entries(this.raw.nonUniforms).forEach(([key, value]) => {
      nonUniforms[key] = serializeProp(value)
    })

    const currents: { [key: string]: any } = {}
    const allValueKeys = [...Object.keys(uniforms), ...Object.keys(nonUniforms)]
    allValueKeys
      // @ts-ignore
      .map((key) => this[key])
      .forEach((value, i) => {
        const key = allValueKeys[i]
        currents[key] = serializeProp(value)
      })

    return {
      constructor: name,
      fragment: this.raw.fragment,
      vertex: this.raw.vertex,
      uniforms: uniforms,
      nonUniforms: nonUniforms,
      currents: currents,
      functions: {
        onShaderParse: this.onShaderParse?.toString(),
        onNonUniformsParse: this.onNonUniformsParse?.toString(),
        onUniformsParse: this.onUniformsParse?.toString(),
      },
    }
  }
}
