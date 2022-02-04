import React, { useMemo, useState } from 'react'
import { LayerMaterial } from 'lamina'
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

      <LayerMaterial>
        {Object.entries(layers).map(([name, layer]) => {
          const Layer = LAYERS[name]
          return <Layer {/* props ??? */} />
        })}
      </LayerMaterial>
    </>
  )
}
