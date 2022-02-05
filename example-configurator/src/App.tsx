import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, OrbitControls } from '@react-three/drei'
import { Leva } from 'leva'
import Monkey from './components/Monkey'
import Primitives from './components/Primitives'

export default function App() {
  return (
    <>
      <Leva titleBar={{ title: 'lamina' }} />
      <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [5, 5, 5] }}>
        <color attach="background" args={['#dadada']} />
        <Suspense fallback={null}>
          <Monkey />
          {/* <Primitives /> */}
          <OrbitControls />
        </Suspense>
        <axesHelper args={[5]} />
        {/* <gridHelper /> */}
      </Canvas>
    </>
  )
}
