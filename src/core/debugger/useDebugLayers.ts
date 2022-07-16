import { folder, useControls } from 'leva'
import { Schema, StoreType } from 'leva/dist/declarations/src/types'
import { useEffect, useLayoutEffect, useState } from 'react'
import { isBlobUrl, isDataUrl, isTextureSrc, isValidHttpUrl, serializeProp } from '../../utils/Functions'
import { LayerMaterial } from '../../vanilla'

const ignoreList = ['uuid']

export default function useDebugLayers(ref: React.MutableRefObject<LayerMaterial>, store: StoreType) {
  const [opts, set] = useState<Schema>({})

  useControls(opts, { store }, [opts])

  useLayoutEffect(() => {
    if (ref.current?.__lamina__debuggerNeedsUpdate) {
      const layers = ref.current.layers
      const serializedLayers = layers.map((layer) => layer.serialize())

      const o: { [key: string]: any } = {}
      serializedLayers.forEach((layer, layerIndex) => {
        const _o: { [key: string]: any } = {}

        Object.entries(layer.currents).forEach(([k, val]) => {
          const key = `${layerIndex}_${k}`

          if (!ignoreList.includes(k)) {
            const rest = {
              label: k,
              onChange: (v: any) => {
                // @ts-ignore
                ref.current.layers[layerIndex][k] = v
              },
            }

            if (isTextureSrc(val)) {
              _o[key] = {
                image: val,
                ...rest,
              }
            } else {
              _o[key] = {
                value: val,
                ...rest,
              }
            }
          }
        })

        o[`${layer.constructor} [#${layerIndex}]`] = folder(_o, {
          collapsed: true,
        })
      })

      ref.current.__lamina__debuggerNeedsUpdate = false

      set({
        Layers: folder(o),
      })
    }
  }, [ref.current?.__lamina__debuggerNeedsUpdate])
}
