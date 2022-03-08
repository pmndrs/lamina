import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Box, OrbitControls } from '@react-three/drei'
import { InstancedMesh, MathUtils, Object3D } from 'three'
import { Color, Displace, LayerMaterial } from 'lamina'

const obj = new Object3D()
function InstancedPlane() {
  const ref = useRef<InstancedMesh>(null!)
  const n = useMemo(() => 3000, [])

  useEffect(() => {
    for (let i = 0; i < n; i++) {
      obj.position.set(MathUtils.randFloat(-5, 5), MathUtils.randFloat(-5, 5), MathUtils.randFloat(-5, 5))
      obj.updateMatrix()

      ref.current.setMatrixAt(i, obj.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [n])

  return (
    <instancedMesh ref={ref} args={[null!, null!, n]}>
      <sphereGeometry args={[0.1, 64, 64]} />
      <LayerMaterial shading="phong">
        <Color color={'blue'} />
        <Displace strength={0.1} scale={10} mapping="world" />
      </LayerMaterial>
    </instancedMesh>
  )
}

function App() {
  return (
    <>
      <Canvas>
        <InstancedPlane />

        <OrbitControls />
        <pointLight castShadow position={[10, 10, 5]} />
        <ambientLight intensity={0.4} />
      </Canvas>
    </>
  )
}

export default App
