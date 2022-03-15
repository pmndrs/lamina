import { Sphere } from '@react-three/drei'
import { GroupProps, useFrame } from '@react-three/fiber'
import { Color, DebugLayerMaterial, Depth, Displace, Fresnel, LayerMaterial, Noise } from 'lamina'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MathUtils, Mesh, Vector2, Vector3 } from 'three'
import { useSpring } from '@react-spring/three'
import { Displace as DisplaceType } from 'lamina/vanilla'
import { DisplaceProps } from 'lamina/types'
import { Triplet, useSphere } from '@react-three/cannon'

export default function Marble() {
  const [number] = useState(200)

  const [ref, { at }] = useSphere(() => ({
    args: [0.1],
    mass: 1,
    position: [Math.random() - 0.5, Math.random() * 2 + 2, Math.random() - 0.5],
  }))
  return (
    <group>
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
