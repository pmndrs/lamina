import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Monkey from './Monkey'
import styled from 'styled-components'
import { Environment, Stats } from '@react-three/drei'
import { Color } from 'three'

export default function App() {
  return (
    <>
      <LevaContainer>
        <Leva titleBar={{ title: 'lamina' }} />
      </LevaContainer>
      <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [5, 5, 5] }}>
        <color attach="background" args={[new Color('#dadada').convertLinearToSRGB()]} />
        <Suspense fallback={null}>
          <Monkey />
        </Suspense>
        <axesHelper args={[5]} />

        <directionalLight intensity={1} castShadow shadow-mapSize-height={1024} shadow-mapSize-width={1024} />

        <ambientLight intensity={0.4} />
      </Canvas>
    </>
  )
}

const LevaContainer = styled.div`
  & > div[class*='leva-c'] {
    left: 10px;
    right: unset;
  }
`
