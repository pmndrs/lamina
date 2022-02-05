import React from 'react'
import { Color, Vector3 } from 'three'
import { Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { LayerMaterial, Base, Depth, Fresnel, Noise } from 'lamina'

export default function TextMesh() {
  const viewport = useThree((s) => s.viewport)
  return (
    <Text scale={viewport.width * 2}>
      lamina
      <LayerMaterial>
        <Base color={new Color('#ffffff')} alpha={1} mode="normal" />
        <Depth
          colorA={new Color('#810000')}
          colorB={new Color('#ffd0d0')}
          alpha={1}
          mode="multiply"
          near={0}
          far={2}
          origin={new Vector3(1, 1, 1)}
        />
        <Fresnel color={new Color('#bffbff')} alpha={1} mode="softlight" power={1} intensity={1} bias={0.1} />
        <Noise colorA={new Color('#a3a3a3')} alpha={0.5} mode="normal" scale={1} />
      </LayerMaterial>
    </Text>
  )
}
