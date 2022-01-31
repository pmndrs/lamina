import React, { useMemo } from 'react'
import { extend, GroupProps, useThree } from '@react-three/fiber'
import { Color, MathUtils } from 'three'
import { Sphere } from '@react-three/drei'
import { LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer } from 'lamina'
import { useControls } from 'leva'
import { LayerBlendMode, SC_BLEND_MODES } from '../../../src/types'
import useSphereControls from './useSphereControls'

extend({ LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer })

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

  const {
    GradientStrength,
    GradientBlendMode,
    GradientColorA,
    GradientColorB,

    GrainBlendMode,
    GrainColor,
    GrainStrength,

    FresnalBlendMode,
    FresnalColor,
    FresnalStrength,

    BaseStrength,
    BaseColor,
    BaseBlendMode,
  } = useSphereControls()

  return (
    <>
      {RandomProps.map((props, i) => (
        <group {...props} key={'Sphere-' + i}>
          <Sphere args={[1, 128, 64]}>
            <layerMaterial>
              <baseLayer
                color={BaseColor} //
                alpha={BaseStrength}
                mode={BaseBlendMode as LayerBlendMode}
              />
              <depthLayer
                colorA={GradientColorA}
                colorB={GradientColorB}
                alpha={GradientStrength}
                mode={GradientBlendMode as LayerBlendMode}
                near={0}
                far={2}
                origin={[1, 1, 1]}
              />
              <fresnelLayer
                color={FresnalColor}
                alpha={1}
                mode={FresnalBlendMode as LayerBlendMode}
                intensity={FresnalStrength * 2}
                factor={1}
                scale={1}
                bias={0.1}
              />
              <noiseLayer
                color={GrainColor} //
                alpha={GrainStrength}
                mode={GrainBlendMode as LayerBlendMode}
                scale={1}
              />
            </layerMaterial>
          </Sphere>
        </group>
      ))}
    </>
  )
}
