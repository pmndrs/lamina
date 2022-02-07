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
import { LayerMaterial, Base, Depth } from 'lamina'

function GradientSphere() {
  return (
    <Sphere>
      <LayerMaterial>
        <Base color="#ffffff" alpha={1} mode="normal" />
        <Depth
          colorA="#810000"
          colorB="#ffd0d0"
          alpha={1}
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
import { LayerMaterial, Base, Depth } from 'lamina/vanilla'

const geometry = new THREE.SphereGeometry(1, 128, 64)
const material = new LayerMaterial({
  layers: [
    new Base({
      color: '#d9d9d9',
      alpha: 1,
      mode: 'normal',
    }),
    new Depth({
      colorA: '#002f4b',
      colorB: '#f2fdff',
      alpha: 1,
      mode: 'multiply',
      near: 0,
      far: 2,
      origin: new THREE.Vector3(1, 1, 1),
    }),
  ],
})

const mesh = new THREE.Mesh(geometry, material)
```

</details>

## Layers

### Built-in layers

Here are the layers that laminia currently provides

| Name      | Function             |
| --------- | -------------------- |
| `Base`    | Flat color           |
| `Depth`   | Depth based gradient |
| `Fresnel` | Fresnel shading (strip or rim-lights) |
| `Noise`   | White, perlin or simplex noise |
| `Normals`   | Visualize vertex normals |
| `Texture`   | Image texture |

### Blendmodes

| Name      | Function             |
| --------- | -------------------- |
| `normal`    | opaque |
| `switch`   | skip layer |
| `add`   | prev layer + current |
| `subtract` | prev layer - current |
| `multiply`   | prev layer * current |
| `divide`   | prev laywer / current |
| `addsub`   | prev layer > 0.5 ? prev layer + current : prev layer - current |
| `lighten`   | lighter pixels only |
| `darken`   | darker pixels only |
| `screen`   | ... |
| `overlay`   | ... |
| `softlight`   | ... |

### Writing your own layers

You can write your own layers by extending the `Abstract` class.

```ts
class CustomLayer extends Abstract {
  // Name of your layer
  name: string = 'CustomLayer'
  // Default blend mode
  mode: BlendMode = 'normal'
  // Give it an ID
  protected uuid: string = Abstract.genID()

  // Define your own uniforms
  uniforms: {
    [key: string]: IUniform<any>
  }
  constructor(props?: CustomLayerProps) {
    super()
    const { customUniform } = props || {}

    // Make your uniforms unique in the layer
    // stack by appending the ID of the layer to it.
    this.uniforms = {
      [`u_${this.uuid}_customUniform`]: {
        value: customUniform ?? defaultValue,
      },

      // We recommend having an alpha  defined
      [`u_${this.uuid}_alpha`]: {
        value: 1,
      },
    }
  }

  // Return a shader chunk that describes your variable
  // in the Fragment shader.
  getFragmentVariables() {
    return /* glsl */ `    
    // Lets assume this is a color
    uniform vec3 u_${this.uuid}_customUniform;
    uniform float u_${this.uuid}_alpha;
`
  }

  // Return an shader chunk with your layer's implementation.
  // Parameter `e` is the result of the previous layer.
  // `sc_blend` is a blending function.
  //
  // vec4 e = vec4(0.);
  // ...
  // e = sc_blend(previousLayer(e), e, prevBlendMode);
  // e = sc_blend(currentLayer(e), e, currentBlendMode);
  // ...
  // gl_FragColor = e;
  //
  // List of blend modes: https://github.com/pmndrs/lamina/blob/7246a43d411dd2d4c069c134a843a3f0bf40623a/src/types.ts#L3
  getFragmentBody(e: string) {
    return /* glsl */ `    
      // Make sure to create unique local variables
      // by appending the UUID to them
      vec3 f_${this.uuid}_color = u_${this.uuid}_customUniform;

     ${e} = ${this.getBlendMode(
      BlendModes[this.mode] as number,
      e,
      `vec4(u_${this.uuid}_color, u_${this.uuid}_alpha)`
    )};
  `
  }

  // Optionals

  // Return a shader chunk that describes your variables
  // in the vertex shader.
  // Mostly used to pass varyings to the Fragment shader
  getVertexVariables(): string {
    return /* glsl */ `
    varying vec2 v_${this.uuid}_uv;
    `
  }

  // Return an shader chunk with your layer's of the vertex shader.
  // Mostly used to assign varyings to values.
  getVertexBody(): string {
    return `
    v_${this.uuid}_uv = uv;
    `
  }

  // Setters and getters for uniforms
  set alpha(v) {
    this.uniforms[`u_${this.uuid}_alpha`].value = v
  }

  get alpha() {
    return this.uniforms[`u_${this.uuid}_alpha`].value
  }

  set customUniform(v) {
    this.uniforms[`u_${this.uuid}_customUniform`].value = v
  }

  get customUniform() {
    return this.uniforms[`u_${this.uuid}_customUniform`].value
  }
  // ...
}
```
