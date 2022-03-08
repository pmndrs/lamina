import { Vector3 } from 'three'
import { ColorProps, DisplaceProps, MappingType, MappingTypes, NoiseProps, NoiseType, NoiseTypes } from '../types'
import Abstract from './Abstract'

type AbstractExtended = Abstract & {
  type: NoiseType
  mapping: MappingType
}

export default class Displace extends Abstract {
  static u_strength = 1
  static u_scale = 1
  static u_offset = new Vector3(0, 0, 0)

  static vertexShader = `
       
      uniform float u_strength;
      uniform float u_scale;
      uniform vec3 u_offset;

      vec3 displace(vec3 p) {
				vec3 f_position = lamina_mapping_template;
        float f_n = lamina_noise_template((f_position + u_offset) * u_scale) * u_strength;
        vec3 f_newPosition = p + (f_n * normal);

				return f_newPosition;
      }

      
			vec3 orthogonal(vec3 v) {
  		  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
  		  : vec3(0.0, -v.z, v.y));
  		}
  		vec3 recalcNormals(vec3 newPos) {
  		  float offset = 0.001;
  		  vec3 tangent = orthogonal(normal);
  		  vec3 bitangent = normalize(cross(normal, tangent));
  		  vec3 neighbour1 = position + tangent * offset;
  		  vec3 neighbour2 = position + bitangent * offset;
  		  vec3 displacedNeighbour1 = displace(neighbour1);
  		  vec3 displacedNeighbour2 = displace(neighbour2);
  		  vec3 displacedTangent = displacedNeighbour1 - newPos;
  		  vec3 displacedBitangent = displacedNeighbour2 - newPos;
  		  return normalize(cross(displacedTangent, displacedBitangent));
  		}
  
  
      void main() {
       
				vec3 f_newPosition = displace(position);
        lamina_finalNormal = recalcNormals(f_newPosition);

        return f_newPosition;
      }
    `

  type: NoiseType = 'perlin'
  mapping: MappingType = 'local'

  constructor(props?: DisplaceProps) {
    super(
      Displace,
      {
        name: 'Displace',
        ...props,
      },
      (self: Displace) => {
        self.schema.push({
          value: self.type,
          label: 'type',
          options: Object.values(NoiseTypes),
        })

        self.schema.push({
          value: self.mapping,
          label: 'mapping',
          options: Object.values(MappingTypes),
        })

        const noiseFunc = Displace.getNoiseFunction(self.type)
        const mapping = Displace.getMapping(self.mapping)

        self.vertexVariables = self.vertexVariables.replace('lamina_mapping_template', mapping)
        self.vertexVariables = self.vertexVariables.replace('lamina_noise_template', noiseFunc)
      }
    )
  }

  private static getNoiseFunction(type?: string) {
    switch (type) {
      default:
      case 'perlin':
        return `lamina_noise_perlin`
      case 'simplex':
        return `lamina_noise_simplex`
      case 'cell':
        return `lamina_noise_worley`
      case 'white':
        return `lamina_noise_white`
      case 'curl':
        return `lamina_noise_swirl`
    }
  }

  private static getMapping(type?: string) {
    switch (type) {
      default:
      case 'local':
        return `p`
      case 'world':
        return `(modelMatrix * vec4(p,1.0)).xyz`
      case 'uv':
        return `vec3(uv, 0.)`
    }
  }
}
