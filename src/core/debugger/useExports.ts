import * as React from 'react'
import { button, useControls } from 'leva'
import { downloadObjectAsJson, serializedLayersToJSX } from '../../utils/ExportUtils'
import { LayerMaterial } from '../../vanilla'
import { LaminaMaterialFile } from '../../types'
import { StoreType } from 'leva/dist/declarations/src/types'

export default function useExports(ref: React.MutableRefObject<LayerMaterial>, store: StoreType) {
  useControls(
    {
      'Copy JSX': button(() => {
        const serialized = ref.current.layers.map((l) => l.serialize())
        const jsx = serializedLayersToJSX(serialized, ref.current.serialize())
        navigator.clipboard.writeText(jsx)
      }),
      Export: button(() => {
        const serialized = ref.current.layers.map((l) => l.serialize())
        const serializedBase = ref.current.serialize()
        const file: LaminaMaterialFile = {
          metadata: {
            version: 1,
            type: 'mat',
          },
          base: serializedBase,
          layers: serialized,
        }
        downloadObjectAsJson(file, serializedBase.currents?.name)
      }),
    },
    { store }
  )
}
