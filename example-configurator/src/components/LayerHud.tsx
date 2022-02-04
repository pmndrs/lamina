import { button, useControls } from 'leva'
import { useMemo } from 'react'
import { Texture, TextureLoader } from 'three'

export default function LayerHud({ name, layer, setLayers, layers }: any) {
  const loader = useMemo(() => new TextureLoader(), [])

  useControls(
    name.split('$')[0] + ': Layer ' + name.split('$')[1],
    () => {
      const o: {
        [key: string]: {}
      } = {}
      layer.forEach((v: any, i: number) => {
        o[`${v.label}_${i}`] = {
          ...v,
          onChange: async (_v: any) => {
            if (_v && layers[name][i].__constructorKey == 'map') {
              const t = await loader.loadAsync(_v)
              setLayers((layers: any) => {
                const cloneLayer = { ...layers }
                cloneLayer[name][i].value = t
                return cloneLayer
              })

              return
            }

            setLayers((layers: any) => {
              const cloneLayer = { ...layers }
              cloneLayer[name][i].value = _v
              return cloneLayer
            })
          },
        }
      })

      o['Delete'] = button(() => {
        setLayers((layers: any) => {
          const cloneLayer = { ...layers }
          delete cloneLayer[name]
          return cloneLayer
        })
      })
      return o
    },
    [layer]
  )

  return null
}
