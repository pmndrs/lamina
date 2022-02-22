import * as THREE from "three";

import Abstract from "./core/Abstract";
import Depth from "./core/Depth";
import Color from "./core/Color";
import Shading from "./core/Shading";
import Noise from "./core/Noise";
import Fresnel from "./core/Fresnel";
import Gradient from "./core/Gradient";
import Matcap from "./core/Matcap";
import Texture from "./core/Texture";
import Displace from "./core/Displace";

import BlendModesChunk from "./chunks/BlendModes";
import NoiseChunk from "./chunks/Noise";
import HelpersChunk from "./chunks/Helpers";
import { LayerMaterialParameters, ShadingType } from "./types";
import { MathUtils, UniformsUtils } from "three";

class LayerMaterial extends THREE.ShaderMaterial {
  shadingAdded: boolean = false;
  layers: Abstract[];
  color: THREE.ColorRepresentation;
  alpha: number;
  lighting: ShadingType;

  constructor(
    props?: THREE.ShaderMaterialParameters & LayerMaterialParameters
  ) {
    super();

    this.color = props?.color || "#808080";
    this.alpha = props?.alpha ?? 1;
    this.layers = props?.layers || [];
    this.lighting = props?.lighting || "phong";

    this.customProgramCacheKey = () => {
      return MathUtils.generateUUID();
    };

    this.forceShading();
  }

  forceShading() {
    // Force shading as first layer. May change?
    switch (this.lighting) {
      default:
      case "phong":
        if (this.layers[0]?.name !== "Shading")
          this.layers.unshift(new Shading());
        break;

      case "none":
        if (this.layers[0]?.name === "Shading") this.layers.shift();
        break;
    }
  }

  genShaders() {
    let vertexVariables = "";
    let fragmentVariables = "";
    let vertexShader = "";
    let fragmentShader = "";

    // Restrict to one shading layer
    let shadingAdded = false;
    this.layers = this.layers.filter((l) => {
      if (l.name === "Shading") {
        if (shadingAdded) {
          return false;
        } else {
          shadingAdded = true;
        }
      }

      return true;
    });

    let uniforms: any = {};
    this.layers.forEach((l) => {
      vertexVariables += l.vertexVariables + "\n";
      fragmentVariables += l.fragmentVariables + "\n";
      vertexShader += l.vertexShader + "\n";
      fragmentShader += l.fragmentShader + "\n";

      Object.entries(l.uniforms).forEach(([key, value]) => {
        uniforms[key] = value;
      });

      for (const key in l.attribs) {
        // @ts-ignore
        this[key] = l.attribs[key];
      }
    });

    uniforms = THREE.UniformsUtils.merge([
      uniforms,
      THREE.UniformsLib.fog,
      {
        u_lamina_color: {
          value: new THREE.Color(this.color),
        },
        u_lamina_alpha: {
          value: this.alpha,
        },
      },
    ]);

    this.transparent = Boolean(this.alpha !== undefined && this.alpha < 1);

    return {
      uniforms: uniforms,
      vertexShader: /* glsl */ `

      ${HelpersChunk}
      ${NoiseChunk}
      ${vertexVariables}

      void main() {
        vec3 lamina_finalPosition = position;
        ${vertexShader}

        gl_Position = projectionMatrix * modelViewMatrix * vec4(lamina_finalPosition, 1.0);
      }
      `,
      fragmentShader: /* glsl */ `
      ${BlendModesChunk}

      ${HelpersChunk}
      ${NoiseChunk}
      ${fragmentVariables}

      uniform vec3 u_lamina_color;
      uniform float u_lamina_alpha;

      void main() {
        vec4 lamina_finalColor = vec4(u_lamina_color, u_lamina_alpha);
        ${fragmentShader}

        gl_FragColor = lamina_finalColor;
      }
      `,
    };
  }

  update() {
    // Force shading as first layer
    this.forceShading();

    const { uniforms, ...rest } = this.genShaders();
    Object.assign(this, rest);

    // Merge uniform keeping reference to this.uniforms
    for (const key in uniforms) {
      this.uniforms[key] = uniforms[key];
    }

    this.uniformsNeedUpdate = true;
    this.needsUpdate = true;
  }
}

export {
  LayerMaterial,
  Abstract,
  Depth,
  Color,
  Shading,
  Noise,
  Fresnel,
  Gradient,
  Matcap,
  Texture,
  Displace,
};
