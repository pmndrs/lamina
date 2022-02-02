import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

import { Leva } from 'leva'
import Duck from './components/Duck'
import { Bounds, OrbitControls } from '@react-three/drei'
import Primitives from './components/Primitives'

export default function App() {
  return (
    <>
      <Leva titleBar={{ title: 'lamina' }} />

      <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [5, 5, 5] }}>
        <color attach="background" args={['#111111']} />
        <Suspense fallback={null}>
          <Duck />
          {/* <Primitives /> */}
          <OrbitControls />
        </Suspense>

        <axesHelper args={[3]} />
        {/* <gridHelper /> */}
      </Canvas>
    </>
  )
}
