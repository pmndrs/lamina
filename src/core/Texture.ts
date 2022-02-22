import { TextureProps } from "../types";
import Abstract from "./Abstract";

type AbstractExtended = Abstract & {
  map: TextureProps["map"];
};

export default class Texture extends Abstract {
  static u_alpha = 1;

  static vertexShader = `
    varying vec2 v_uv;
    
    void main() {
        v_uv = uv;
    }
    `;

  static fragmentShader = ` 
		uniform sampler2D u_map;  
		uniform float u_alpha;  
		varying vec2 v_uv;

    void main() {
			vec3 f_color = texture2D(u_map, v_uv).rgb;
      return vec4(f_color, u_alpha);
    }
  `;

  constructor(props?: TextureProps) {
    console.log(props);
    super(
      Texture,
      {
        name: "Texture",
        ...props,
      },
      null,
      {
        onParse: (self) => {
          const extendedSelf = self as AbstractExtended;
          const unifromKey = `u_${self.uuid}_map`;

          if (!extendedSelf.map) {
            extendedSelf.map = props?.map;
            self.schema.push({
              label: "map",
              // @ts-ignore
              image: undefined,
              value: undefined,
            });

            self.uniforms[unifromKey] = {
              value: extendedSelf.map,
              raw: extendedSelf.map,
            };

            self.fragmentShader = self.fragmentShader.replace(
              "u_map",
              unifromKey
            );
          }

          console.log("extendedSelf.map", extendedSelf.map);

          self.uniforms[unifromKey].value = extendedSelf.map;
        },
      }
    );

    console.log(this.uniforms);
  }
}
