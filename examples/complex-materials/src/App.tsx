import React, { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Center,
  Cone,
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  RoundedBox,
  Sphere,
  Torus,
} from '@react-three/drei'
import Helmet from './Helmet'
import { Color, DebugLayerMaterial, Fresnel, LayerMaterial, Noise } from 'lamina'
import { MathUtils } from 'three'
import Blob from './Blob'
import Marble from './Marble'
import { Physics } from '@react-three/cannon'
import Floor from './Floor'
import TextComponent from './Text'
import Tag from './Tag'
import Lighting from './Lighting'

function FresnelLayer() {
  return (
    <>
      <Fresnel
        color={'#9e7c68'} //
        bias={-0.015}
        power={3}
        intensity={1.43}
        factor={0.83}
        mode="screen"
        alpha={1}
      />
    </>
  )
}

function App() {
  return (
    <>
      <Canvas
        orthographic
        shadows
        camera={{
          position: [-674.32, 401.86, 878.18],
          near: -10000,
          far: 10000,
          zoom: 1.5 * 100,
        }}
      >
        <color args={['#2114db']} attach="background" />

        <Suspense fallback={null}>
          <Physics>
            <Helmet />
            <Floor />
            <Marble />

            <TextComponent />
          </Physics>

          <Blob position={[-2, -0.5, -3]} />
          <Blob position={[-2, 1.5, 0]} />
          <Blob position={[2, 0.8, 1]} />
          <Blob position={[-2, -0.2, 4]} />
          <Blob position={[2, 1, -2]} />
        </Suspense>
        <Lighting />

        <gridHelper args={[200, 100, '#1100ff', '#1100ff']} position={[0, -1.26, 0]} />
        <gridHelper args={[200, 1000, '#1100ff', '#1100ff']} position={[0, -1.27, 0]} />
        {/* <axesHelper /> */}
        <OrbitControls enablePan={false} minZoom={90} maxPolarAngle={Math.PI / 2 - 0.1} minPolarAngle={0} />
      </Canvas>
      <Tag />
    </>
  )
}

export default App
