import React, { useLayoutEffect, useRef, useState } from 'react'
import { Box, Center, RoundedBox, Sphere, TorusKnot } from '@react-three/drei'
import LayerStack from './LayerStack'
import { Box3 } from 'three'

export default function Primitives() {
  const refs = useRef<any>([])
  const [boxes, setBoxes] = useState()

  useLayoutEffect(() => {
    console.log(refs)
    setBoxes(
      refs.current.map((ref: any) => {
        const bbox = new Box3().setFromObject(ref)
        return [bbox.min, bbox.max]
      })
    )
  }, [])

  return (
    <Center>
      <group>
        <Box
          ref={(r) => void (r && refs.current.push(r))}
          position={[-3, 0, 0]}
          rotation-z={Math.PI / 8}
          rotation-x={Math.PI / 4}
        >
          <LayerStack
            options={{
              Gradient: {
                a: boxes?.[0]?.[0],
                b: boxes?.[0]?.[1],
              },
            }}
          />
        </Box>
        <Sphere
          ref={(r) => void (r && refs.current.push(r))}
          position={[3, 0, 0]}
          rotation-z={Math.PI / 8}
          rotation-x={Math.PI / 4}
        >
          <LayerStack
            options={{
              Gradient: {
                a: boxes?.[1]?.[0],
                b: boxes?.[1]?.[1],
              },
            }}
          />
        </Sphere>
        <TorusKnot
          ref={(r) => void (r && refs.current.push(r))} //
          scale={0.5}
          position={[0, 7, 0]}
        >
          <LayerStack
            options={{
              Gradient: {
                a: boxes?.[2]?.[0],
                b: boxes?.[2]?.[1],
              },
            }}
          />
        </TorusKnot>
      </group>
    </Center>
  )
}
