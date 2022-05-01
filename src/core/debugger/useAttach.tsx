import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { LevaPanel } from 'leva'
import { LayerMaterial } from '../../vanilla'
import { StoreType } from 'leva/dist/declarations/src/types'

export default function useAttach(ref: React.MutableRefObject<LayerMaterial>, store: StoreType) {
  React.useLayoutEffect(() => {
    let root = document.body.querySelector('#root')
    if (!root) {
      root = document.createElement('div')
      root.id = 'root'
      document.body.appendChild(root)
    }
    const div = document.createElement('div')

    if (root) {
      root.appendChild(div)
      const levaRoot = createRoot(div)
      levaRoot.render(
        <LevaPanel
          titleBar={{
            title: ref.current.name,
          }}
          store={store}
        />
      )
    }

    return () => {
      div.remove()
    }
  }, [])
}
