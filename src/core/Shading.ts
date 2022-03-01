import { ColorRepresentation, ShaderLib, UniformsUtils } from 'three'
import { Color } from 'three'
import { ShadingProps } from '../types'
import Abstract from './Abstract'

function createFragment() {
  let base = ShaderLib.phong.fragmentShader

  base = base
    .replace(
      'void main() {',
      /* glsl */ `
        uniform float u_alpha;
        void main() {
      `
    )
    .replace(
      '#include <output_fragment>',
      /* glsl */ `
        #include <output_fragment>
        return vec4(outgoingLight, outgoingLight.r * u_alpha);
      `
    )

  return base
}

export default class Shading extends Abstract {
  static u_alpha = 1
  static u_shininess = 1

  static vertexShader = ShaderLib.phong.vertexShader
  static fragmentShader = createFragment()

  constructor(props?: ShadingProps) {
    super(
      Shading,
      {
        name: 'Shading',
        ...props,
      },
      {
        lights: true,
      },
      {
        onParse: (self) => {
          self.uniforms = UniformsUtils.merge([ShaderLib.phong.uniforms, self.uniforms])

          self.fragmentShader = self.fragmentShader.replace(
            '#include <lights_phong_fragment>',
            `
            #include <lights_phong_fragment>
            material.specularShininess = clamp(u_${self.uuid}_shininess, 0.0001, 1.) * 100.;
            `
          )

          self.fragmentVariables += `uniform float u_${self.uuid}_shininess;`
        },
      }
    )
  }
}
