import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'

import { LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer } from '@react-three/lamina'

export default function App() {
  return (
    <Canvas linear flat dpr={[1, 2]} camera={{ fov: 50 }}>
      <Sphere>
        <layerMaterial>
          <baseLayer
            color={'#ff00ff'} //
            alpha={1}
            mode="NORMAL"
          />
        </layerMaterial>
      </Sphere>
      <OrbitControls makeDefault autoRotate />
    </Canvas>
  )
}
