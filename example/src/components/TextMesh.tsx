import React from 'react'
import { Text } from '@react-three/drei'
import { extend, useThree } from '@react-three/fiber'

import { Color } from 'three'
import { LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer } from 'lamina'

extend({ LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer })

export default function TextMesh() {
  const viewport = useThree((s) => s.viewport)
  return (
    <Text scale={viewport.width * 2}>
      lamina
      <layerMaterial>
        <baseLayer
          color={new Color('#ffffff')} //
          alpha={1}
          mode="NORMAL"
        />
        <depthLayer
          colorA={new Color('#810000')}
          colorB={new Color('#ffd0d0')}
          alpha={1}
          mode="MULTIPLY"
          near={0}
          far={2}
          origin={[1, 1, 1]}
        />
        <fresnelLayer
          color={new Color('#bffbff')}
          alpha={1}
          mode="SOFTLIGHT"
          intensity={1}
          factor={1}
          scale={1}
          bias={0.1}
        />
        <noiseLayer
          color={new Color('#a3a3a3')} //
          alpha={0.5}
          mode="NORMAL"
          scale={1}
        />
      </layerMaterial>
    </Text>
  )
}
