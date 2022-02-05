import React, { useMemo } from 'react'
import { MathUtils, Vector3 } from 'three'
import { GroupProps, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { LayerMaterial, Base, Depth, Fresnel, Noise, DebugLayerMaterial } from 'lamina'
import { BlendMode } from '../../../src/types'

export default function Spheres() {
  const viewport = useThree((s) => s.viewport)
  const RandomProps = useMemo<GroupProps[]>(
    () =>
      new Array(30).fill(0).map(() => {
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
        }
      }),
    [viewport]
  )

  return (
    <>
      {RandomProps.map((props, i) => (
        <group {...props} key={'Sphere-' + i}>
          <Sphere args={[1, 128, 64]}>
            <DebugLayerMaterial>
              <Base color={'#ffffff'} />
              <Depth
                colorA={'#005182'}
                colorB={'#d4f8ff'}
                mode="multiply"
                near={0}
                far={2}
                origin={new Vector3(1, 1, 1)}
              />
              <Fresnel color={'ffffff'} alpha={1} mode="softlight" power={2} intensity={1} bias={0.1} />
            </DebugLayerMaterial>
          </Sphere>
        </group>
      ))}
    </>
  )
}
