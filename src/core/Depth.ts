import { Vector3 } from 'three'
import { DepthProps } from '../types'
import Abstract from './Abstract'

type AbstractExtended = Abstract & {
  mapping: DepthProps['mapping']
}

export default class Depth extends Abstract {
  static u_near = 2
  static u_far = 10
  static u_origin = new Vector3(0, 0, 0)
  static u_colorA = 'white'
  static u_colorB = 'black'
  static u_alpha = 1

  static vertexShader = `
  varying vec3 v_worldPosition;
  varying vec3 v_position;

  void main() {
    v_worldPosition = (vec4(position, 1.0) * modelMatrix).xyz;
    v_position = position;
  }
  `

  static fragmentShader = `   
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
  `

  mapping: 'vector' | 'world' | 'camera' = 'vector'

  constructor(props?: DepthProps) {
    super(
      Depth,
      {
        name: 'Depth',
        ...props,
      },
      (self: Depth) => {
        self.schema.push({
          value: self.mapping,
          label: 'mapping',
          options: ['vector', 'world', 'camera'],
        })

        const mapping = Depth.getMapping(self.uuid, self.mapping)

        self.fragmentShader = self.fragmentShader.replace('lamina_mapping_template', mapping)
      }
    )
  }

  private static getMapping(uuid: string, type?: string) {
    switch (type) {
      default:
      case 'vector':
        return `length(v_${uuid}_worldPosition - u_${uuid}_origin)`
      case 'world':
        return `length(v_${uuid}_position - vec3(0.))`
      case 'camera':
        return `length(v_${uuid}_worldPosition - cameraPosition)`
    }
  }
}
