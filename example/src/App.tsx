import React from 'react'
import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'

import { LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer } from 'lamina'
import { Color } from 'three'

extend({ LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer })

export default function App() {
  return (
    <Canvas linear flat dpr={[1, 2]} camera={{ fov: 50 }}>
      <Sphere>
        <layerMaterial>
          <baseLayer
            color={new Color('#ff00ff')} //
            alpha={1}
            mode="NORMAL"
          />
          <depthLayer
            colorA={new Color('#00FFA9')}
            colorB={new Color('#FF0094')}
            alpha={1}
            mode="NORMAL"
            near={2}
            far={6}
            origin={[4, 0, 1]}
          />
        </layerMaterial>
      </Sphere>
      <OrbitControls makeDefault autoRotate />
    </Canvas>
  )
}
