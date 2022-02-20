import { ShaderLib, UniformsUtils } from "three";
import { ShadingProps } from "../types";
import Abstract from "./Abstract";

function createFragment() {
  let base = ShaderLib.phong.fragmentShader;

  base = base
    .replace(
      "void main() {",
      /* glsl */ `
        uniform float u_alpha;
        void main() {
      `
    )
    .replace(
      "#include <output_fragment>",
      /* glsl */ `
        #include <output_fragment>
        return vec4(outgoingLight, outgoingLight.r * u_alpha);
      `
    );

  return base;
}

export default class Shading extends Abstract {
  static u_alpha = 1;

  static vertexShader = ShaderLib.phong.vertexShader;
  static fragmentShader = createFragment();

  constructor(props?: ShadingProps) {
    super(
      Shading,
      {
        name: "Shading",
        ...props,
      },
      {
        lights: true,
      }
    );

    this.uniforms = UniformsUtils.merge([
      this.uniforms,
      ShaderLib.phong.uniforms,
    ]);
    this.uniforms.shininess.value = 100;
  }
}
