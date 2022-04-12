import { useBox } from '@react-three/cannon'
import { extend, useFrame } from '@react-three/fiber'
import { Depth, Fresnel, Gradient, LayerMaterial } from 'lamina'
import { useRef } from 'react'
import { MathUtils } from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import Roboto from './fonts/Roboto_Bold.json'

extend({ TextGeometry })

const font = new FontLoader().parse(Roboto)
const textOptions = {
  font,
  size: 1,
  height: 0.15,
}

export default function TextComponent() {
  const [ref] = useBox(() => ({ position: [-4.2, -1.27, 0] }))
  const [ref2] = useBox(() => ({ position: [1.5, -1.27, 0] }))

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
      {/* @ts-ignore */}
      <mesh ref={ref} castShadow>
        {/* @ts-ignore */}
        <textGeometry attach="geometry" args={['LAM', textOptions]} />

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
      </mesh>
      <mesh position={[-4.2, -1.27, 0]}>
        {/* @ts-ignore */}
        <textGeometry attach="geometry" args={['LAM', textOptions]} />
        <meshBasicMaterial wireframe />
      </mesh>
      {/* @ts-ignore */}
      <mesh ref={ref2} castShadow>
        {/* @ts-ignore */}
        <textGeometry attach="geometry" args={['INA', textOptions]} />
        {/* @ts-ignore */}
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
      </mesh>
      <mesh position={[1.5, -1.27, 0]}>
        {/* @ts-ignore */}
        <textGeometry attach="geometry" args={['INA', textOptions]} />
        <meshBasicMaterial wireframe />
      </mesh>
    </group>
  )
}
