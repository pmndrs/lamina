<br />

<h1 align="center">lamina</h1>
<h3 align="center">🍰 An extensible, layer based shader material for ThreeJS</h3>

<br>

<p align="center">
  <a href="https://www.npmjs.com/package/lamina" target="_blank">
    <img src="https://img.shields.io/npm/v/lamina.svg?style=flat&colorA=000000&colorB=000000" />
  </a>
  <a href="https://www.npmjs.com/package/lamina" target="_blank">
    <img src="https://img.shields.io/npm/dm/lamina.svg?style=flat&colorA=000000&colorB=000000" />
  </a>
  <a href="https://twitter.com/pmndrs" target="_blank">
    <img src="https://img.shields.io/twitter/follow/pmndrs?label=%40pmndrs&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000" alt="Chat on Twitter">
  </a>
  <a href="https://discord.gg/ZZjjNvJ" target="_blank">
    <img src="https://img.shields.io/discord/740090768164651008?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=000000" alt="Chat on Twitter">
  </a>
</p>

<br />

<p align="center">
  <a href="https://codesandbox.io/embed/github/pmndrs/lamina/tree/main/examples/example-configurator" target="_blank"><img width="400" src="https://github.com/pmndrs/lamina/blob/main/assets/configurator.png?raw=true"  /></a>
  <a href="https://codesandbox.io/embed/github/pmndrs/lamina/tree/main/examples/layer-materials" target="_blank"><img width="400" src="https://github.com/pmndrs/lamina/blob/main/assets/lamina.png?raw=true"  /></a>
</p>
<p align="middle">
  <i>These demos are real, you can click them! They contain the full code, too. 📦</i>
</p>
<br />

`lamina` let's you create materials with a declarative, system of layers. Layers make it incredibly easy to stack and blend effects. This approach was first made popular by the [Spline team](https://spline.design/).

```jsx
import { LayerMaterial, Color } from 'lamina'

function GradientSphere() {
  return (
    <Sphere>
      <LayerMaterial color="#ffffff">
        <Depth
          colorA="#810000" //
          colorB="#ffd0d0"
          alpha={0.5}
          mode="multiply"
          near={0}
          far={2}
          origin={[1, 1, 1]}
        />
      </LayerMaterial>
    </Sphere>
  )
}
```

<details>
  <summary>Show Vanilla example</summary>

Lamina can be used with vanilla Three.js. Each layer is just a class.

```js
import { LayerMaterial, Color } from 'lamina/vanilla'

const geometry = new THREE.SphereGeometry(1, 128, 64)
const material = new LayerMaterial({
  color: '#d9d9d9',
  layers: [
    new Depth({
      colorA: '#002f4b',
      colorB: '#f2fdff',
      alpha: 0.5,
      mode: 'multiply',
      near: 0,
      far: 2,
      origin: new THREE.Vector3(1, 1, 1),
    }),
  ],
})

const mesh = new THREE.Mesh(geometry, material)
```

Note: To match the colors of the react example, you must convert all colors to Linear encoding like so:

```js
new Depth({
  colorA: new THREE.Color('#002f4b').convertSRGBToLinear(),
  colorB: new THREE.Color('#f2fdff').convertSRGBToLinear(),
  alpha: 0.5,
  mode: 'multiply',
  near: 0,
  far: 2,
  origin: new THREE.Vector3(1, 1, 1),
}),
```

</details>

## Layers

### Built-in layers

Here are the layers that lamina currently provides

| Name       | Function                               |
| ---------- | -------------------------------------- |
| `Color`    | Flat color.                            |
| `Depth`    | Depth based gradient.                  |
| `Displace` | Displace vertices using. noise         |
| `Fresnel`  | Fresnel shading (strip or rim-lights). |
| `Gradient` | Linear gradient.                       |
| `Matcap`   | Load in a Matcap.                      |
| `Noise`    | White, perlin or simplex noise         |
| `Normals`  | Visualize vertex normals               |
| `Texture`  | Image texture                          |

See the section for each layer for the options on it.

### Writing your own layers

You can write your own layers by extending the `Abstract` class. The concept if simple:

> Each layer can be treated as an isolated shader program that produces a `vec4` color.

The color of each layer will be blended together using the specified blend mode. A list of all available blend modes can be found [here](https://github.com/pmndrs/lamina/blob/445ff4adc084f88865c2b3ffc801e2b4f83917ec/src/types.ts#L3).

```ts
// Extend the Abstract layer
class CustomLayer extends Abstract {
  // Define stuff as static properties!

  // Uniforms: Must begin with prefix "u_".
  // Assign them their default value
  static u_color = 'red'
  static u_alpha = 1

  // Define your fragment shader just like you already do!
  // Only difference is, you must return the final color of this layer
  static fragmentShader = `   
    uniform vec3 u_color;
    uniform float u_alpha;

    // Varyings must be prefixed by "v_"
    varying vec3 v_Position;

    vec4 main() {
      // Local variables must be prefixed by "f_"
      vec4 f_color = vec4(u_color, u_alpha)
      return f_color;
    }
  `

  // Optionally Define a vertex shader!
  // Same rules as fragment shaders, except no blend modes.
  static vertexShader = `   
    // Varyings must be prefixed by "v_"
    varying vec3 v_Position;

    void main() {
      v_Position = position;
      return position * 2.;
    }
  `

  constructor(props) {
    // You MUST call `super` with the current constructor as the first argument.
    // Second argument is optional and provides non-uniform parameters like blend mode, name and visibility.
    super(Color, {
      name: 'Color',
      ...props,
    })
  }
}
```

If you need a specialized or advance use-case, see the Advanced Usage section

### Using your own layers

<strong>Custom layers are Vanilla compatible by default.</strong>

To use them with React-three-fiber, you must use the `extend` function to add the layer to your component library!

```jsx
import { extend } from "@react-three/fiber"

extend({ CustomLayer })

// ...
const ref = useRef();

// Animate uniforms using a ref
useFrame(({ clock }) => {
  ref.current.color.setRGB(
    Math.sin(clock.elapsedTime),
    Math.cos(clock.elapsedTime),
    Math.sin(clock.elapsedTime),
  )
})

<LayerMaterial>
  <customLayer
    ref={ref}     // Imperative instance of CustomLayer. Can be used to animate unifroms
    args={[]}     // Non uniform arguments, i.e. props param on constructor
    color="green" // Uniforms can be set directly
    alpha={0.5}
  />
</LayerMaterial>
```
