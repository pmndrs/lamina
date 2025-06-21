import { MappingTypes } from '../types';
import Abstract from './Abstract';
class Gradient extends Abstract {
    constructor(props) {
        super(Gradient, {
            name: 'Gradient',
            ...props,
        }, (self) => {
            self.schema.push({
                value: self.axes,
                label: 'axes',
                options: ['x', 'y', 'z'],
            });
            self.schema.push({
                value: self.mapping,
                label: 'mapping',
                options: Object.values(MappingTypes),
            });
            const mapping = Gradient.getMapping(self.mapping);
            self.vertexShader = self.vertexShader.replace('lamina_mapping_template', mapping || 'local');
            self.fragmentShader = self.fragmentShader.replace('axes_template', self.axes || 'x');
        });
        this.axes = 'x';
        this.mapping = 'local';
    }
    static getMapping(type) {
        switch (type) {
            default:
            case 'local':
                return `position`;
            case 'world':
                return `(modelMatrix * vec4(position,1.0)).xyz`;
            case 'uv':
                return `vec3(uv, 0.)`;
        }
    }
}
Gradient.u_colorA = 'white';
Gradient.u_colorB = 'black';
Gradient.u_alpha = 1;
Gradient.u_start = 1;
Gradient.u_end = -1;
Gradient.u_contrast = 1;
Gradient.vertexShader = `
		varying vec3 v_position;

		vod main() {
      v_position = lamina_mapping_template;
		}
  `;
Gradient.fragmentShader = `   
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    uniform vec3 u_axis;
    uniform float u_alpha;
    uniform float u_start;
    uniform float u_end;
    uniform float u_contrast;

		varying vec3 v_position;

    void main() {

      float f_step = smoothstep(u_start, u_end, v_position.axes_template * u_contrast);
      vec3 f_color = mix(u_colorA, u_colorB, f_step);

      return vec4(f_color, u_alpha);
    }
  `;
export default Gradient;
