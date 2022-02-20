import { getSpecialParameters, getUniform } from "../utils/Functions";
import { IUniform, MathUtils } from "three";
import { BlendMode, BlendModes, LayerProps } from "../types";

// @ts-ignore
import tokenize from "glsl-tokenizer";
// @ts-ignore
import descope from "glsl-token-descope";
// @ts-ignore
import stringify from "glsl-token-string";
// @ts-ignore
import tokenFunctions from "glsl-token-functions";

export default class Abstract {
  static genID() {
    return MathUtils.generateUUID().replaceAll("-", "_");
  }

  attribs: {
    [name: string]: any;
  };

  uuid: string = MathUtils.generateUUID().replaceAll("-", "_");
  name: string = "LayerMaterial";
  mode: BlendMode = "normal";
  visible: boolean = true;
  uniforms: {
    [key: string]: IUniform<any> & {
      raw?: any;
    };
  };
  events?: {
    onParse?: (self: Abstract) => void;
  } | null;

  fragmentShader: string;
  vertexShader: string;
  vertexVariables: string;
  fragmentVariables: string;

  schema: {
    value: any;
    label: any;
    options?: any[];
  }[];

  constructor(
    c: any,
    props?: LayerProps | null,
    attribs?: {
      [name: string]: any;
    } | null,
    events?: {
      onParse?: (self: Abstract) => void;
    } | null
  ) {
    const defaults = Object.getOwnPropertyNames(c).filter((e) =>
      e.startsWith("u_")
    );
    const uniforms: { [key: string]: any } = defaults.reduce(
      (a, v) => ({
        ...a,
        [v.slice(1)]: Object.getOwnPropertyDescriptor(c, v)?.value,
      }),
      {}
    );

    for (const key in uniforms) {
      if (props?.[key]) uniforms[key] = props[key];
    }

    this.uniforms = {};
    this.schema = [];
    const properties: PropertyDescriptorMap & ThisType<any> = {};
    Object.keys(uniforms).map((key) => {
      const propName = key.split("_")[1];

      this.uniforms[`u_${this.uuid}_${propName}`] = {
        value: getUniform(uniforms[key]),
        raw: uniforms[key],
      };

      this.schema.push({
        value: uniforms[key],
        label: propName,
      });

      properties[propName] = {
        set: (v: any) => {
          this.uniforms[`u_${this.uuid}_${propName}`].value = getUniform(v);
          this.uniforms[`u_${this.uuid}_${propName}`].raw = v;
        },
        get: () => {
          return this.uniforms[`u_${this.uuid}_${propName}`].raw;
        },
      };
    });

    if (props?.name) this.name = props.name;
    if (props?.mode) this.mode = props.mode;
    if (props?.visible) this.visible = props.visible;

    Object.defineProperties(this, properties);

    this.vertexShader = "";
    this.fragmentShader = "";
    this.vertexVariables = "";
    this.fragmentVariables = "";
    this.attribs = attribs || {};
    this.events = events;

    this.buildShaders(c);

    this.schema.push({
      value: this.name,
      label: "name",
    });
    this.schema.push({
      value: this.mode,
      label: "mode",
      options: Object.values(BlendModes),
    });
  }

  buildShaders(constructor: any) {
    const shaders = Object.getOwnPropertyNames(constructor)
      .filter((e) => e === "fragmentShader" || e === "vertexShader")
      .reduce(
        (a, v) => ({
          ...a,
          [v]: Object.getOwnPropertyDescriptor(constructor, v)?.value,
        }),
        {}
      ) as {
      fragmentShader: string;
      vertexShader: string;
    };

    const tokens = {
      vert: tokenize(shaders.vertexShader || ""),
      frag: tokenize(shaders.fragmentShader || ""),
    };

    const descoped = {
      vert: descope(tokens.vert, this.renameTokens.bind(this)),
      frag: descope(tokens.frag, this.renameTokens.bind(this)),
    };

    const funcs = {
      vert: tokenFunctions(descoped.vert),
      frag: tokenFunctions(descoped.frag),
    };

    const mainIndex = {
      vert: funcs.vert
        .map((e: any) => {
          return e.name;
        })
        .indexOf("main"),
      frag: funcs.frag
        .map((e: any) => {
          return e.name;
        })
        .indexOf("main"),
    };

    const variables = {
      vert:
        mainIndex.vert >= 0
          ? stringify(
              descoped.vert.slice(0, funcs.vert[mainIndex.vert].outer[0])
            )
          : "",
      frag:
        mainIndex.frag >= 0
          ? stringify(
              descoped.frag.slice(0, funcs.frag[mainIndex.frag].outer[0])
            )
          : "",
    };

    const funcBodies = {
      vert:
        mainIndex.vert >= 0
          ? this.getShaderFromIndex(
              descoped.vert,
              funcs.vert[mainIndex.vert].body
            )
          : "",
      frag:
        mainIndex.frag >= 0
          ? this.getShaderFromIndex(
              descoped.frag,
              funcs.frag[mainIndex.frag].body
            )
          : "",
    };

    this.vertexShader = this.processFinal(funcBodies.vert);
    this.fragmentShader = this.processFinal(funcBodies.frag);
    this.vertexVariables = variables.vert;
    this.fragmentVariables = variables.frag;

    console.log(this);
    this.events?.onParse?.(this);
  }

  renameTokens(name: string) {
    if (name.startsWith("u_") || name.startsWith("v_")) {
      const slice = name.slice(2);
      return `u_${this.uuid}_${slice}`;
    } else if (name.startsWith("f_")) {
      const slice = name.slice(2);
      return `f_${this.uuid}_${slice}`;
    } else {
      return name;
    }
  }

  processFinal(shader: string) {
    const s: string = shader
      .replaceAll(/\sf_/gm, ` f_${this.uuid}_`)
      .replaceAll(/\(f_/gm, `(f_${this.uuid}_`);

    const returnValue = s.match(/^.*return.*$/gm);
    let sReplaced = s.replace(/^.*return.*$/gm, "");

    if (returnValue?.[0]) {
      const returnVariable = returnValue[0]
        .replace("return", "")
        .trim()
        .replace(";", "");

      const blendMode = this.getBlendMode(returnVariable, "lamina_finalColor");
      sReplaced += `lamina_finalColor = ${blendMode};`;
    }

    return sReplaced;
  }

  getShaderFromIndex(tokens: any, index: number[]) {
    return stringify(tokens.slice(index[0], index[1]));
  }

  getBlendMode(b: string, a: string) {
    switch (this.mode) {
      default:
      case "normal":
        return `lamina_blend_copy(${a}, ${b})`;
      case "add":
        return `lamina_blend_add(${a}, ${b})`;
      case "subtract":
        return `lamina_blend_subtract(${a}, ${b})`;
      case "multiply":
        return `lamina_blend_multiply(${a}, ${b})`;
      case "addsub":
        return `lamina_blend_addSub(${a}, ${b})`;
      case "lighten":
        return `lamina_blend_lighten(${a}, ${b})`;
      case "darken":
        return `lamina_blend_darken(${a}, ${b})`;
      case "divide":
        return `lamina_blend_divide(${a}, ${b})`;
      case "overlay":
        return `lamina_blend_overlay(${a}, ${b})`;
      case "screen":
        return `lamina_blend_screen(${a}, ${b})`;
      case "softlight":
        return `lamina_blend_softLight(${a}, ${b})`;
      case "switch":
        return `lamina_blend_switch(${a}, ${b})`;
    }
  }

  getSchema() {
    const latestSchema = this.schema.map(({ label, options }) => {
      return {
        label,
        options,
        ...getSpecialParameters(label),
        // @ts-ignore
        value: this[label],
      };
    });

    return latestSchema;
  }
}
