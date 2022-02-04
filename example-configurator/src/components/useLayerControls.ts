import { button, useControls } from 'leva'
import { useState } from 'react'
import { BlendModes } from '../../../src/types'
import { LayerProperties } from './properties'
import InitialMaterial from './InitialMaterial.json'

export default function useLayerControls() {
  const [layers, setLayers] = useState<{
    [key: string]: any
  }>(InitialMaterial)

  const [i, setI] = useState(Object.keys(InitialMaterial).length + 1)

  useControls(
    {
      Load: {
        image: undefined,
        onChange: async (e) => {
          if (e) {
            try {
              const a = await (await fetch(e)).json()
              setLayers(a)
            } catch (error) {
              alert('Failed to load')
            }
          }
        },
      },
    },
    []
  )

  useControls(
    {
      Name: {
        value: 'Ducky',
      },
      Export: button((get) => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(layers))
        const dlAnchorElem = document.createElement('a')
        dlAnchorElem.setAttribute('href', dataStr)
        dlAnchorElem.setAttribute('download', `${get('Name')}.lamina`)
        dlAnchorElem.click()
      }),
    },
    [layers]
  )

  useControls(
    'Layers',
    {
      Type: {
        options: Object.keys(LayerProperties),
        value: 'Base',
      },
      Add: button((get) => {
        const key = get('Layers.Type')
        // @ts-ignore
        const value = LayerProperties[key]

        setLayers((s) => ({
          ...s,
          [`${key}$${i}`]: value,
        }))
        setI((s) => s + 1)
      }),
    },
    [i]
  )

  return [layers, setLayers]
}
