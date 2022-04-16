import { Canvas } from '@react-three/fiber'
import { Environment, Sphere } from '@react-three/drei'
import { Suspense } from 'react'
import { Color, Gradient, LayerMaterial } from 'lamina'
import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'

function Thing() {
  const [state, set] = useState('blue')

  return (
    <Sphere
      onPointerEnter={() => set('red')} //
      onPointerLeave={() => set('blue')}
    >
      <LayerMaterial lighting="physical">
        <Gradient axes="x" contrast={4} colorA={state} />
      </LayerMaterial>
    </Sphere>
  )
}

export default function App() {
  return (
    <Canvas
      camera={{
        position: [2, 2, 2],
      }}
    >
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>

      <Thing />

      <gridHelper />
      <OrbitControls />
    </Canvas>
  )
}
