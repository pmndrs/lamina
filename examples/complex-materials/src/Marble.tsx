import { Depth, Fresnel, LayerMaterial } from 'lamina'
import { useLayoutEffect, useState } from 'react'

import { useBox, useSphere, usePlane } from '@react-three/cannon'
import { Box, Plane } from '@react-three/drei'
import { BackSide } from 'three'

export default function Marble({ setLoaded }: { setLoaded: any }) {
  const [number] = useState(200)

  const [ref] = useSphere(() => ({
    args: [0.1],
    mass: 1,
    position: [Math.random() - 0.5, Math.random() * 2 + 4, Math.random() - 0.5],
  }))

  useLayoutEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <group>
      {/* @ts-ignore */}
      <instancedMesh castShadow ref={ref} args={[undefined, undefined, number]}>
        <sphereBufferGeometry args={[0.1, 128, 128]} />

        <LayerMaterial color={'white'} lighting={'physical'}>
          <Depth
            near={0.4854}
            far={0.7661999999999932}
            origin={[-0.4920000000000004, 0.4250000000000003, 0]}
            colorA={'#8baafe'}
            colorB={'#0079f9'}
          />
          <Fresnel color={'#fe0000'} mode={'screen'} />
        </LayerMaterial>
      </instancedMesh>
    </group>
  )
}
