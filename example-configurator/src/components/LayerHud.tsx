import { button, useControls } from 'leva'

export default function LayerHud({ name, layer, setLayers }: any) {
  useControls(
    name.split('$')[0] + ': Layer ' + name.split('$')[1],
    () => {
      const o: {
        [key: string]: {}
      } = {}
      layer.forEach((v: any, i: number) => {
        o[`${v.label}_${i}`] = {
          ...v,
          onChange: (_v: any) => {
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
