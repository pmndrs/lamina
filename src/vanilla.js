import * as THREE from 'three';
import Abstract from './core/Abstract';
import Color from './core/Color';
import Depth from './core/Depth';
import Displace from './core/Displace';
import Fresnel from './core/Fresnel';
import Gradient from './core/Gradient';
import Matcap from './core/Matcap';
import Noise from './core/Noise';
import Normal from './core/Normal';
import Texture from './core/Texture';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import BlendModesChunk from './chunks/BlendModes';
import HelpersChunk from './chunks/Helpers';
import NoiseChunk from './chunks/Noise';
import { ShadingTypes } from './types';
class LayerMaterial extends CustomShaderMaterial {
    constructor({ color, alpha, lighting, layers, name, ...props } = {}) {
        super({
            baseMaterial: ShadingTypes[lighting || 'basic'],
            ...props,
        });
        this.name = 'LayerMaterial';
        this.layers = [];
        this.lighting = 'basic';
        const _baseColor = color || 'white';
        const _alpha = alpha !== null && alpha !== void 0 ? alpha : 1;
        this.uniforms = {
            u_lamina_color: {
                value: typeof _baseColor === 'string' ? new THREE.Color(_baseColor).convertSRGBToLinear() : _baseColor,
            },
            u_lamina_alpha: {
                value: _alpha,
            },
        };
        this.layers = layers || this.layers;
        this.lighting = lighting || this.lighting;
        this.name = name || this.name;
        this.refresh();
    }
    genShaders() {
        let vertexVariables = '';
        let fragmentVariables = '';
        let vertexShader = '';
        let fragmentShader = '';
        let uniforms = {};
        this.layers
            .filter((l) => l.visible)
            .forEach((l) => {
            // l.buildShaders(l.constructor)
            vertexVariables += l.vertexVariables + '\n';
            fragmentVariables += l.fragmentVariables + '\n';
            vertexShader += l.vertexShader + '\n';
            fragmentShader += l.fragmentShader + '\n';
            uniforms = {
                ...uniforms,
                ...l.uniforms,
            };
        });
        uniforms = {
            ...uniforms,
            ...this.uniforms,
        };
        return {
            uniforms,
            vertexShader: `
        ${HelpersChunk}
        ${NoiseChunk}
        ${vertexVariables}

        void main() {
          vec3 lamina_finalPosition = position;
          vec3 lamina_finalNormal = normal;

          ${vertexShader}

          csm_Position = lamina_finalPosition;
          csm_Normal = lamina_finalNormal;
        }
        `,
            fragmentShader: `
        ${HelpersChunk}
        ${NoiseChunk}
        ${BlendModesChunk}
        ${fragmentVariables}

        uniform vec3 u_lamina_color;
        uniform float u_lamina_alpha;

        void main() {
          vec4 lamina_finalColor = vec4(u_lamina_color, u_lamina_alpha);

          ${fragmentShader}

          csm_DiffuseColor = lamina_finalColor;
         
        }
        `,
        };
    }
    refresh() {
        const { uniforms, fragmentShader, vertexShader } = this.genShaders();
        super.update({ fragmentShader, vertexShader, uniforms });
    }
    serialize() {
        return {
            constructor: 'LayerMaterial',
            properties: {
                color: this.color,
                alpha: this.alpha,
                name: this.name,
                lighting: this.lighting,
            },
        };
    }
    set color(v) {
        var _a, _b;
        if ((_b = (_a = this.uniforms) === null || _a === void 0 ? void 0 : _a.u_lamina_color) === null || _b === void 0 ? void 0 : _b.value)
            this.uniforms.u_lamina_color.value = typeof v === 'string' ? new THREE.Color(v).convertSRGBToLinear() : v;
    }
    get color() {
        var _a, _b;
        return (_b = (_a = this.uniforms) === null || _a === void 0 ? void 0 : _a.u_lamina_color) === null || _b === void 0 ? void 0 : _b.value;
    }
    set alpha(v) {
        this.uniforms.u_lamina_alpha.value = v;
    }
    get alpha() {
        return this.uniforms.u_lamina_alpha.value;
    }
}
export { Abstract, Color, Depth, Displace, Fresnel, Gradient, LayerMaterial, Matcap, Noise, Normal, Texture };
