import React from 'react'
import { Box, Center, RoundedBox, Sphere, TorusKnot } from '@react-three/drei'
import LayerStack from './LayerStack'

export default function Primitives() {
  return (
    <Center>
      <group>
        <Box position={[-3, 0, 0]} rotation-z={Math.PI / 8} rotation-x={Math.PI / 4}>
          <LayerStack />
        </Box>
        <Sphere position={[3, 0, 0]} rotation-z={Math.PI / 8} rotation-x={Math.PI / 4}>
          <LayerStack />
        </Sphere>
        <TorusKnot scale={0.5} position={[0, 5, 0]}>
          <LayerStack />
        </TorusKnot>
      </group>
    </Center>
  )
}
