import { folder, useControls } from 'leva'
import { Schema, StoreType } from 'leva/dist/declarations/src/types'
import { useLayoutEffect, useState } from 'react'
import { serializeProp } from '../../utils/Functions'
import { LayerMaterial } from '../../vanilla'

const ignoreInBaseMaterial = ['uuid']

export default function useDebugBaseMaterial(ref: React.MutableRefObject<LayerMaterial>, store: StoreType) {
  const [opts, set] = useState<Schema>({})

  useControls(opts, { store }, [opts])

  useLayoutEffect(() => {
    const baseProps = ref.current.serialize()
    console.log(baseProps)

    const o: { [key: string]: any } = {}
    Object.entries(baseProps.currents).forEach(([key, val]) => {
      if (!ignoreInBaseMaterial.includes(key)) {
        o[key] = {
          value: val,
        }
      }
    })

    set({
      Base: folder(o),
    })
  }, [])
}
