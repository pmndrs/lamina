import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'

import Rig from './components/Rig'
import Spheres from './components/Spheres'
import { Leva } from 'leva'

export default function App() {
  return (
    <>
      <Leva collapsed titleBar={{ title: 'Layers' }} />

      <Canvas linear flat dpr={[1, 2]} camera={{ fov: 50 }}>
        <color attach="background" args={['#ebebeb']} />
        <Spheres />
        <Rig />

        {/* <Text scale={30}>
          ABCD
          <meshBasicMaterial />
        </Text>

        <gridHelper /> */}
      </Canvas>
    </>
  )
}
