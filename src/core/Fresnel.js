import Abstract from './Abstract';
class Fresnel extends Abstract {
    constructor(props) {
        super(Fresnel, {
            name: 'Fresnel',
            ...props,
        });
    }
}
Fresnel.u_color = 'white';
Fresnel.u_alpha = 1;
Fresnel.u_bias = 0;
Fresnel.u_intensity = 1;
Fresnel.u_power = 2;
Fresnel.u_factor = 1;
Fresnel.vertexShader = `
    varying vec3 v_worldPosition;
    varying vec3 v_worldNormal;

    void main() {
        v_worldPosition = vec3(-viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2]);
        v_worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
        
    }
  `;
Fresnel.fragmentShader = `   
    uniform vec3 u_color;
    uniform float u_alpha;
    uniform float u_bias;
    uniform float u_intensity;
    uniform float u_power;
    uniform float u_factor;

    varying vec3 v_worldPosition;
    varying vec3 v_worldNormal;

    void main() {
        float f_a = (u_factor  + dot(v_worldPosition, v_worldNormal));
        float f_fresnel = u_bias + u_intensity * pow(abs(f_a), u_power);

        f_fresnel = clamp(f_fresnel, 0.0, 1.0);
        return vec4(f_fresnel * u_color, u_alpha);
    }
  `;
export default Fresnel;
