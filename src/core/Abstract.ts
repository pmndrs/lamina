import { getSpecialParameters, getUniform, serializeProp } from '../utils/Functions'
import { Color, IUniform, MathUtils, Texture } from 'three'
import { BlendMode, BlendModes, LayerProps, SerializedLayer } from '../types'

// @ts-ignore
import tokenize from 'glsl-tokenizer'
// @ts-ignore
import descope from 'glsl-token-descope'
// @ts-ignore
import stringify from 'glsl-token-string'
// @ts-ignore
import tokenFunctions from 'glsl-token-functions'

export default class Abstract {
  static genID() {
    return MathUtils.generateUUID().replaceAll('-', '_')
  }

  attribs: {
    [name: string]: any
  }

  uuid: string = MathUtils.generateUUID().replaceAll('-', '_')
  name: string = 'LayerMaterial'
  mode: BlendMode = 'normal'
  visible: boolean = true
  uniforms: {
    [key: string]: IUniform<any> & {
      raw?: any
    }
  }

  events?: {
    onParse?: (self: Abstract) => void
  } | null

  fragmentShader: string
  vertexShader: string
  vertexVariables: string
  fragmentVariables: string

  schema: {
    value: any
    label: any
    options?: any[]
  }[]

  constructor(
    c: any,
    props?: LayerProps | null,
    attribs?: {
      [name: string]: any
    } | null,
    events?: {
      onParse?: (self: Abstract) => void
    } | null
  ) {
    const defaults = Object.getOwnPropertyNames(c).filter((e) => e.startsWith('u_'))
    const uniforms: { [key: string]: any } = defaults.reduce(
      (a, v) => ({
        ...a,
        [v.slice(1)]: Object.getOwnPropertyDescriptor(c, v)?.value,
      }),
      {}
    )

    for (const key in uniforms) {
      const propName = key.split('_')[1]
      if (props?.[propName] !== undefined) uniforms[key] = props[propName]
    }

    this.uniforms = {}
    this.schema = []
    const properties: PropertyDescriptorMap & ThisType<any> = {}
    Object.keys(uniforms).map((key) => {
      const propName = key.split('_')[1]

      this.uniforms[`u_${this.uuid}_${propName}`] = {
        value: getUniform(uniforms[key]),
        raw: uniforms[key],
      }

      this.schema.push({
        value: uniforms[key],
        label: propName,
      })

      properties[propName] = {
        set: (v: any) => {
          this.uniforms[`u_${this.uuid}_${propName}`].value = getUniform(v)
          this.uniforms[`u_${this.uuid}_${propName}`].raw = v
        },
        get: () => {
          return this.uniforms[`u_${this.uuid}_${propName}`].value
        },
      }
    })

    console.log(this)

    if (props?.name) this.name = props.name
    if (props?.mode) this.mode = props.mode
    if (props?.visible) this.visible = props.visible

    Object.defineProperties(this, properties)

    this.vertexShader = ''
    this.fragmentShader = ''
    this.vertexVariables = ''
    this.fragmentVariables = ''
    this.attribs = attribs || {}
    this.events = events

    this.buildShaders(c)

    this.schema.push({
      value: this.name,
      label: 'name',
    })
    this.schema.push({
      value: this.mode,
      label: 'mode',
      options: Object.values(BlendModes),
    })
    this.schema.push({
      value: this.visible,
      label: 'visible',
    })
  }

  buildShaders(constructor: any) {
    const shaders = Object.getOwnPropertyNames(constructor)
      .filter((e) => e === 'fragmentShader' || e === 'vertexShader')
      .reduce(
        (a, v) => ({
          ...a,
          [v]: Object.getOwnPropertyDescriptor(constructor, v)?.value,
        }),
        {}
      ) as {
      fragmentShader: string
      vertexShader: string
    }

    const tokens = {
      vert: tokenize(shaders.vertexShader || ''),
      frag: tokenize(shaders.fragmentShader || ''),
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

    this.events?.onParse?.(this)
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
    const s: string = shader.replaceAll(/\sf_/gm, ` f_${this.uuid}_`).replaceAll(/\(f_/gm, `(f_${this.uuid}_`)

    const returnValue = s.match(/^.*return.*$/gm)
    let sReplaced = s.replace(/^.*return.*$/gm, '')

    if (returnValue?.[0]) {
      const returnVariable = returnValue[0].replace('return', '').trim().replace(';', '')

      const blendMode = this.getBlendMode(returnVariable, 'lamina_finalColor')
      sReplaced += isVertex ? `lamina_finalPosition = ${returnVariable}.xyz;` : `lamina_finalColor = ${blendMode};`
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
    let nonUniformPropKeys = Object.keys(this)
    nonUniformPropKeys = nonUniformPropKeys.filter(
      (e) =>
        ![
          'uuid',
          'uniforms',
          'schema',
          'fragmentShader',
          'vertexShader',
          'fragmentVariables',
          'vertexVariables',
          'attribs',
          'events',
          '__r3f',
        ].includes(e)
    )
    const nonUniformProps = {}
    nonUniformPropKeys.forEach((k) => {
      // @ts-ignore
      nonUniformProps[k] = this[k]
    })

    const props: { [key: string]: any } = {}
    for (const key in this.uniforms) {
      const name = key.replace(`u_${this.uuid}_`, '')
      props[name] = serializeProp(this.uniforms[key].value)
    }

    return {
      constructor: name,
      properties: {
        ...props,
        ...nonUniformProps,
      },
    }
  }
}
