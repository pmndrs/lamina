import React, { useMemo } from 'react'
import { Canvas, extend, GroupProps, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'

import { LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer } from 'lamina'
import { Color, MathUtils } from 'three'
import Rig from './Rig'

extend({ LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer })

function Spheres() {
  const viewport = useThree((s) => s.viewport)

  const RandomProps = useMemo<
    (GroupProps & {
      xDist: number
    })[]
  >(
    () =>
      new Array(100).fill(0).map(() => {
        return {
          position: [
            MathUtils.randFloat(-viewport.width, viewport.width), //
            MathUtils.randFloat(-viewport.height, viewport.height),
            MathUtils.randFloat(-20, 5),
          ],
          rotation: [
            MathUtils.randFloat(-10, 10), //
            MathUtils.randFloat(-10, 10),
            MathUtils.randFloat(-20, 10),
          ],
          scale: MathUtils.randFloat(0.05, 1),

          xDist: MathUtils.randFloat(0, 1),
        }
      }),
    [viewport]
  )

  return (
    <>
      {RandomProps.map((props, i) => (
        <group {...props}>
          <Sphere args={[1, 128, 64]} key={'Sphere-' + i}>
            <layerMaterial>
              <baseLayer
                color={new Color('#ffffff')} //
                alpha={1}
                mode="NORMAL"
              />
              <depthLayer
                colorA={new Color('#002f4b')}
                colorB={new Color('#f2fdff')}
                alpha={1}
                mode="MULTIPLY"
                near={0}
                far={2}
                origin={[1, 1, 1]}
              />
              <fresnelLayer
                colorA={new Color('#bffbff')}
                alpha={1}
                mode="SOFTLIGHT"
                intensity={1}
                factor={1}
                scale={1}
                bias={0.1}
              />
              <noiseLayer
                color={new Color('#a3a3a3')} //
                alpha={0.2}
                mode="NORMAL"
                scale={1}
              />
            </layerMaterial>
          </Sphere>
        </group>
      ))}
    </>
  )
}

export default function App() {
  return (
    <Canvas linear flat dpr={[1, 2]} camera={{ fov: 50 }}>
      <color attach="background" args={['#ebebeb']} />
      <Spheres />
      <Rig />
      <OrbitControls />
    </Canvas>
  )
}
