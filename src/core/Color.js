import Abstract from './Abstract';
class Color extends Abstract {
    constructor(props) {
        super(Color, {
            name: 'Color',
            ...props,
        });
    }
}
Color.u_color = 'red';
Color.u_alpha = 1;
Color.fragmentShader = `   
    uniform vec3 u_color;
    uniform float u_alpha;

    void main() {
      return vec4(u_color, u_alpha);
    }
  `;
export default Color;
