import { useBox } from '@react-three/cannon'
import { extend, useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import { Depth, Fresnel, Gradient, LayerMaterial } from 'lamina'
import { useRef } from 'react'
import { MathUtils } from 'three'

export default function TextComponent() {
  const depthRef = useRef<any>(null!)
  const depthRef2 = useRef<any>(null!)

  useFrame(({ mouse, viewport }) => {
    const x = MathUtils.lerp(
      depthRef.current.origin.x, //
      (mouse.x * viewport.width) / 2 + 1.27,
      0.05
    )
    const y = MathUtils.lerp(
      depthRef.current.origin.y, //
      (mouse.y * viewport.width) / 2 + 1.27,
      0.05
    )

    depthRef.current.origin.set(x, y, 0)
    depthRef2.current.origin.set(x, y, 0)
  })

  return (
    <group>
      <Text3D bevelSegments={6} font={'/fonts/Roboto_Bold.json'}>
        <LayerMaterial color={'white'} lighting={'physical'} transmission={1} roughness={0.4} thickness={2}>
          <Gradient colorA={'#24fef3'} colorB={'#fc3ba8'} start={-1.6700000000000075} end={12} contrast={4} />
          <Fresnel
            color={'#fefefe'}
            bias={-0.03200000000000001}
            intensity={1.7899999999999956}
            power={2.7299999999999893}
            mode={'softlight'}
          />
          <Depth
            ref={depthRef}
            near={2.2899999999999996}
            far={1.3}
            origin={[1, 0.11099999999999999, 0]}
            colorA={'#ffffff'}
            colorB={'#000000'}
            mode={'add'}
            alpha={0.2}
          />
        </LayerMaterial>
      </Text3D>

      <Text3D bevelSegments={6} font={'/fonts/Roboto_Bold.json'}>
        <LayerMaterial lighting="physical" color={'white'} transmission={1} roughness={0.4} thickness={2}>
          <Gradient colorA={'#ffba00'} colorB={'#00ff1e'} start={-1.6700000000000075} end={12} contrast={4} />
          <Fresnel
            color={'#fefefe'}
            bias={-0.03200000000000001}
            intensity={1.7899999999999956}
            power={2.7299999999999893}
            mode={'softlight'}
          />
          <Depth
            ref={depthRef2}
            near={2.2899999999999996}
            far={1.3}
            origin={[1, 0.11099999999999999, 0]}
            colorA={'#ffffff'}
            colorB={'#000000'}
            mode={'add'}
            alpha={0.2}
          />
        </LayerMaterial>
      </Text3D>
    </group>
  )
}
