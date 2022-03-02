import * as THREE from 'three'
import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Plane, Box, Stats } from '@react-three/drei'
import { LayerMaterial, DebugLayerMaterial, Depth, Color, Fresnel } from 'lamina'
import { useControls } from 'leva'
import { Vector3 } from 'three'

export default function App() {
  const props = {
    base: '#ff4eb8',
    colorA: '#00ffff',
    colorB: '#ff00e3'
  }
  return (
    <>
      <Stats />
      <Canvas shadows dpr={[1, 2]} camera={{ position: [2, 0, 0], fov: 80, near: 0.001 }}>
        <Suspense fallback={null}>
          <Bg {...props} />
          <Flower {...props} />
          <mesh>
            <sphereGeometry args={[0.2, 64, 64]} />
            <meshPhysicalMaterial transmission={1} thickness={10} roughness={0.2} />
          </mesh>
          <OrbitControls />
          <pointLight castShadow position={[10, 10, 5]} />
          <pointLight castShadow position={[-10, -10, -5]} color={props.colorA} />

          <ambientLight intensity={0.4} />
          {/* <Environment preset="warehouse" /> */}
        </Suspense>
      </Canvas>
    </>
  )
}

function Bg({ base, colorA, colorB }) {
  const mesh = useRef()
  useFrame((state, delta) => {
    mesh.current.rotation.x = mesh.current.rotation.y = mesh.current.rotation.z += delta
  })
  return (
    <mesh ref={mesh} scale={100}>
      <sphereGeometry args={[1, 64, 64]} />
      <LayerMaterial attach="material" side={THREE.BackSide} lighting="none">
        <Color color="#b02ed2" alpha={1} mode="normal" />
        <Depth colorA="#ff0000" colorB="#00aaff" alpha={0.5} mode="multiply" near={0} far={300} origin={[100, 100, 100]} />
      </LayerMaterial>
    </mesh>
  )
}

const vec = new Vector3(0, 0, 0)
function Flower({ base, colorA, colorB }) {
  const mesh = useRef()
  const depth = useRef()
  useFrame((state, delta) => {
    // mesh.current.rotation.z += delta / 2
    // depth.current.origin = vec.set(-state.mouse.y, state.mouse.x, 0)
  })
  return (
    <mesh castShadow receiveShadow rotation-y={Math.PI / 2} scale={[2, 2, 2]} ref={mesh}>
      <torusKnotGeometry args={[0.4, 0.05, 400, 32, 3, 7]} />
      <LayerMaterial color="#ff4eb8" lighting={'none'} name={'Flower'}>
        <Depth
          far={3} //
          origin={[1, 1, 1]}
          colorA="#ff00e3"
          colorB="#00ffff"
          alpha={0.5}
          mode={'multiply'}
          mapping={'vector'}
        />
        <Depth
          ref={depth}
          near={0.25}
          far={2}
          origin={[-0.9760456268614979, 0.48266696923176067, 0]}
          colorA={[1, 0.7607843137254902, 0]}
          alpha={0.5}
          mode={'lighten'}
          mapping={'vector'}
        />
        <Fresnel mode={'softlight'} />
      </LayerMaterial>
    </mesh>
  )
}
