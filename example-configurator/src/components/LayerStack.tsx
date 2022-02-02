import React, { useMemo, useState } from 'react'
import { extend } from '@react-three/fiber'
import { Color } from 'three'
import { LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer } from 'lamina'
import useLayerControls from './useLayerControls'
import LayerHud from './LayerHud'
import { AbstractLayer } from 'lamina'

extend({ LayerMaterial, BaseLayer, DepthLayer, FresnelLayer, NoiseLayer })

const layerMap: {
  [key: string]: any
} = {
  Color: BaseLayer,
  Depth: DepthLayer,
  Fresnel: FresnelLayer,
  Noise: NoiseLayer,
}

export default function LayerStack() {
  const [layers, setLayers] = useLayerControls()

  const layersArray = useMemo<AbstractLayer[]>(() => {
    return Object.entries(layers).map(([name, layer]) => {
      const key = name.split('$')[0]
      const Component = layerMap[key]

      const o: {
        [key: string]: {}
      } = {}
      layer.forEach((v: any) => {
        o[v.__constructorKey] = v.value
      })

      return new Component(o) as AbstractLayer
    })
  }, [layers])

  return (
    <>
      {Object.entries(layers).map(([name, layer]) => (
        <LayerHud key={name} name={name} layer={layer} setLayers={setLayers} />
      ))}

      <layerMaterial
        args={[
          {
            layers: layersArray,
          },
        ]}
      />
    </>
  )
}
