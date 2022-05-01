import { Canvas } from '@react-three/fiber'
import { Environment, Sphere } from '@react-three/drei'
import { Suspense } from 'react'
import { Color, Depth, Gradient, LayerMaterial, Shader } from 'lamina'
import { useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Stats } from '@react-three/drei'

function Thing() {
  const [state, set] = useState(0)

  return (
    <Sphere
      onPointerEnter={() => set(1)} //
      onPointerLeave={() => set(0)}
    >
      <LayerMaterial lighting="physical" roughness={0}>
        <Color color="red" />
        <Shader
          fragment={`
            uniform vec3 u_color;
            uniform float u_alpha;

            void main() {
              return vec4(u_color, u_alpha);
            }  
          `}
          u_color={new THREE.Color('blue')}
          u_alpha={state}
          mode="divide"
        />
      </LayerMaterial>
    </Sphere>
  )
}

export default function App() {
  return (
    <>
      <Stats />
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
    </>
  )
}
