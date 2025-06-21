import Abstract from './Abstract';
class Texture extends Abstract {
    constructor(props) {
        super(Texture, {
            name: 'Texture',
            ...props,
        });
    }
}
Texture.u_alpha = 1;
Texture.u_map = undefined;
Texture.vertexShader = `
    varying vec2 v_uv;
    
    void main() {
        v_uv = uv;
    }
    `;
Texture.fragmentShader = ` 
		uniform sampler2D u_map;  
		uniform float u_alpha;  
		varying vec2 v_uv;

    void main() {
			vec4 f_color = texture2D(u_map, v_uv);
      return vec4(f_color.rgb, f_color.a * u_alpha);
    }
  `;
export default Texture;
