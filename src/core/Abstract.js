import { Color, MathUtils } from 'three';
import { BlendModes } from '../types';
import { getSpecialParameters, getUniform, isSerializableType, serializeProp } from '../utils/Functions';
// @ts-ignore
import tokenize from 'glsl-tokenizer';
// @ts-ignore
import descope from 'glsl-token-descope';
// @ts-ignore
import stringify from 'glsl-token-string';
// @ts-ignore
import tokenFunctions from 'glsl-token-functions';
export default class Abstract {
    constructor(c, props, onParse) {
        this.uuid = MathUtils.generateUUID().replace(/-/g, '_');
        this.name = 'LayerMaterial';
        this.mode = 'normal';
        this.visible = true;
        const defaults = Object.getOwnPropertyNames(c).filter((e) => e.startsWith('u_'));
        const uniforms = defaults.reduce((a, v) => {
            var _a;
            let value = (_a = Object.getOwnPropertyDescriptor(c, v)) === null || _a === void 0 ? void 0 : _a.value;
            if (isSerializableType(value) || value instanceof Color)
                value = value.clone();
            return {
                ...a,
                [v.slice(1)]: value,
            };
        }, {});
        for (const key in uniforms) {
            const propName = key.split('_')[1];
            if ((props === null || props === void 0 ? void 0 : props[propName]) !== undefined)
                uniforms[key] = props[propName];
        }
        if (props) {
            Object.keys(props).map((key) => {
                if (props[key] !== undefined) {
                    // @ts-ignore
                    this[key] = props[key];
                }
            });
        }
        this.uniforms = {};
        this.schema = [];
        const properties = {};
        Object.keys(uniforms).map((key) => {
            const propName = key.split('_')[1];
            this.uniforms[`u_${this.uuid}_${propName}`] = {
                value: getUniform(uniforms[key]),
            };
            this.schema.push({
                value: uniforms[key],
                label: propName,
            });
            properties[propName] = {
                set: (v) => {
                    this.uniforms[`u_${this.uuid}_${propName}`].value = getUniform(v);
                },
                get: () => {
                    return this.uniforms[`u_${this.uuid}_${propName}`].value;
                },
            };
        });
        if (props === null || props === void 0 ? void 0 : props.name)
            this.name = props.name;
        if (props === null || props === void 0 ? void 0 : props.mode)
            this.mode = props.mode;
        if (props === null || props === void 0 ? void 0 : props.visible)
            this.visible = props.visible;
        Object.defineProperties(this, properties);
        this.vertexShader = '';
        this.fragmentShader = '';
        this.vertexVariables = '';
        this.fragmentVariables = '';
        this.onParse = onParse;
        this.buildShaders(c);
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
        });
        this.schema.push({
            value: this.visible,
            label: 'visible',
        });
    }
    buildShaders(constructor) {
        var _a;
        const shaders = Object.getOwnPropertyNames(constructor)
            .filter((e) => e === 'fragmentShader' || e === 'vertexShader')
            .reduce((a, v) => {
            var _a;
            return ({
                ...a,
                [v]: (_a = Object.getOwnPropertyDescriptor(constructor, v)) === null || _a === void 0 ? void 0 : _a.value,
            });
        }, {});
        const tokens = {
            vert: tokenize(shaders.vertexShader || ''),
            frag: tokenize(shaders.fragmentShader || ''),
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
                .map((e) => {
                return e.name;
            })
                .indexOf('main'),
            frag: funcs.frag
                .map((e) => {
                return e.name;
            })
                .indexOf('main'),
        };
        const variables = {
            vert: mainIndex.vert >= 0 ? stringify(descoped.vert.slice(0, funcs.vert[mainIndex.vert].outer[0])) : '',
            frag: mainIndex.frag >= 0 ? stringify(descoped.frag.slice(0, funcs.frag[mainIndex.frag].outer[0])) : '',
        };
        const funcBodies = {
            vert: mainIndex.vert >= 0 ? this.getShaderFromIndex(descoped.vert, funcs.vert[mainIndex.vert].body) : '',
            frag: mainIndex.frag >= 0 ? this.getShaderFromIndex(descoped.frag, funcs.frag[mainIndex.frag].body) : '',
        };
        this.vertexShader = this.processFinal(funcBodies.vert, true);
        this.fragmentShader = this.processFinal(funcBodies.frag);
        this.vertexVariables = variables.vert;
        this.fragmentVariables = variables.frag;
        (_a = this.onParse) === null || _a === void 0 ? void 0 : _a.call(this, this);
        this.schema = this.schema.filter((value, index) => {
            const _value = value.label;
            return (index ===
                this.schema.findIndex((obj) => {
                    return obj.label === _value;
                }));
        });
    }
    renameTokens(name) {
        if (name.startsWith('u_')) {
            const slice = name.slice(2);
            return `u_${this.uuid}_${slice}`;
        }
        else if (name.startsWith('v_')) {
            const slice = name.slice(2);
            return `v_${this.uuid}_${slice}`;
        }
        else if (name.startsWith('f_')) {
            const slice = name.slice(2);
            return `f_${this.uuid}_${slice}`;
        }
        else {
            return name;
        }
    }
    processFinal(shader, isVertex) {
        const s = shader.replace(/\sf_/gm, ` f_${this.uuid}_`).replace(/\(f_/gm, `(f_${this.uuid}_`);
        const returnValue = s.match(/^.*return.*$/gm);
        let sReplaced = s.replace(/^.*return.*$/gm, '');
        if (returnValue === null || returnValue === void 0 ? void 0 : returnValue[0]) {
            const returnVariable = returnValue[0].replace('return', '').trim().replace(';', '');
            const blendMode = this.getBlendMode(returnVariable, 'lamina_finalColor');
            sReplaced += isVertex ? `lamina_finalPosition = ${returnVariable};` : `lamina_finalColor = ${blendMode};`;
        }
        return sReplaced;
    }
    getShaderFromIndex(tokens, index) {
        return stringify(tokens.slice(index[0], index[1]));
    }
    getBlendMode(b, a) {
        switch (this.mode) {
            default:
            case 'normal':
                return `lamina_blend_alpha(${a}, ${b}, ${b}.a)`;
            case 'add':
                return `lamina_blend_add(${a}, ${b}, ${b}.a)`;
            case 'subtract':
                return `lamina_blend_subtract(${a}, ${b}, ${b}.a)`;
            case 'multiply':
                return `lamina_blend_multiply(${a}, ${b}, ${b}.a)`;
            case 'lighten':
                return `lamina_blend_lighten(${a}, ${b}, ${b}.a)`;
            case 'darken':
                return `lamina_blend_darken(${a}, ${b}, ${b}.a)`;
            case 'divide':
                return `lamina_blend_divide(${a}, ${b}, ${b}.a)`;
            case 'overlay':
                return `lamina_blend_overlay(${a}, ${b}, ${b}.a)`;
            case 'screen':
                return `lamina_blend_screen(${a}, ${b}, ${b}.a)`;
            case 'softlight':
                return `lamina_blend_softlight(${a}, ${b}, ${b}.a)`;
            case 'reflect':
                return `lamina_blend_reflect(${a}, ${b}, ${b}.a)`;
            case 'negation':
                return `lamina_blend_negation(${a}, ${b}, ${b}.a)`;
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
            };
        });
        return latestSchema;
    }
    serialize() {
        const name = this.constructor.name.split('$')[0];
        let nonUniformPropKeys = Object.keys(this);
        nonUniformPropKeys = nonUniformPropKeys.filter((e) => ![
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
            'onParse',
        ].includes(e));
        const nonUniformProps = {};
        nonUniformPropKeys.forEach((k) => {
            // @ts-ignore
            nonUniformProps[k] = this[k];
        });
        const props = {};
        for (const key in this.uniforms) {
            const name = key.replace(`u_${this.uuid}_`, '');
            props[name] = serializeProp(this.uniforms[key].value);
        }
        return {
            constructor: name,
            properties: {
                ...props,
                ...nonUniformProps,
            },
        };
    }
}
