import React, { useMemo, useState } from 'react'
import * as LAYERS from 'lamina'
import useLayerControls from './useLayerControls'
import LayerHud from './LayerHud'

export default function LayerStack() {
  const [layers, setLayers] = useLayerControls()
  return (
    <>
      {Object.entries(layers).map(([name, layer]) => (
        <LayerHud key={name} name={name} layer={layer} setLayers={setLayers} />
      ))}
      <LAYERS.LayerMaterial>
        {Object.entries(layers).map(([name, layer]) => {
          const key = name.split('$')[0]
          const Component = (LAYERS as any)[key]
          const props: {
            [key: string]: {}
          } = {}
          layer.forEach((v: any) => {
            props[v.__constructorKey] = v.value
          })
          console.log(key, props)
          return <Component key={name} {...props} />
        })}
      </LAYERS.LayerMaterial>
    </>
  )
}
