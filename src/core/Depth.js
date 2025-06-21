import { Vector3 } from 'three';
import Abstract from './Abstract';
class Depth extends Abstract {
    constructor(props) {
        super(Depth, {
            name: 'Depth',
            ...props,
        }, (self) => {
            self.schema.push({
                value: self.mapping,
                label: 'mapping',
                options: ['vector', 'world', 'camera'],
            });
            const mapping = Depth.getMapping(self.uuid, self.mapping);
            self.fragmentShader = self.fragmentShader.replace('lamina_mapping_template', mapping);
        });
        this.mapping = 'vector';
    }
    static getMapping(uuid, type) {
        switch (type) {
            default:
            case 'vector':
                return `length(v_${uuid}_worldPosition - u_${uuid}_origin)`;
            case 'world':
                return `length(v_${uuid}_position - vec3(0.))`;
            case 'camera':
                return `length(v_${uuid}_worldPosition - cameraPosition)`;
        }
    }
}
Depth.u_near = 2;
Depth.u_far = 10;
Depth.u_origin = new Vector3(0, 0, 0);
Depth.u_colorA = 'white';
Depth.u_colorB = 'black';
Depth.u_alpha = 1;
Depth.vertexShader = `
  varying vec3 v_worldPosition;
  varying vec3 v_position;

  void main() {
    v_worldPosition = (vec4(position, 1.0) * modelMatrix).xyz;
    v_position = position;
  }
  `;
Depth.fragmentShader = `   
    uniform float u_alpha;
    uniform float u_near;
    uniform float u_far;
    uniform float u_isVector;
    uniform vec3 u_origin;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;

    varying vec3 v_worldPosition;
    varying vec3 v_position;

    void main() {
      float f_dist = lamina_mapping_template;
      float f_depth = (f_dist - u_near) / (u_far - u_near);
			vec3 f_depthColor =  mix(u_colorB, u_colorA, 1.0 - clamp(f_depth, 0., 1.));
  
  
      return vec4(f_depthColor, u_alpha);
    }
  `;
export default Depth;
