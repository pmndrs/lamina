import { extend } from '@react-three/fiber'
import { button, LevaPanel, useControls, useCreateStore } from 'leva'
import { DataItem, StoreType } from 'leva/dist/declarations/src/types'
import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import mergeRefs from 'react-merge-refs'
import { getLayerMaterialArgs, getUniform } from './utils/Functions'
import { serializedLayersToJSX } from './utils/ExportUtils'
import * as LAYERS from './vanilla'
import { Color, TextureLoader } from 'three'
import { LayerMaterialProps } from './types'

extend({
  LayerMaterial: LAYERS.LayerMaterial,
})

function DynamicLeva({
  name,
  layers,
  store,
  setUpdate,
}: {
  setUpdate: any
  name: string
  layers: any[]
  store: StoreType
}) {
  useControls(
    name,
    () => {
      const o: any = {}
      layers.forEach((layer, i: number) => {
        const n = `${layer.label} ~${i}`
        o[n] = layer
        o[n].onChange = () => setUpdate([`${name}.${n}`, layer.label])
      })
      return o
    },
    { store },
    [layers, name]
  )

  return null
}

const DebugLayerMaterial = React.forwardRef<LAYERS.LayerMaterial, React.PropsWithChildren<LayerMaterialProps>>(
  ({ children, ...props }, forwardRef) => {
    const ref = React.useRef<
      LAYERS.LayerMaterial & {
        [key: string]: any
      }
    >(null!)
    const store = useCreateStore()
    const [layers, setLayers] = React.useState<{ [name: string]: any[] }>({})
    const [path, setPath] = React.useState(['', ''])
    const textureLoader = useMemo(() => new TextureLoader(), [])

    const onBasePropsChange = React.useCallback((t, v) => {
      ref.current.uniforms[`u_lamina_${t}`].value = getUniform(v)
      ref.current.uniformsNeedUpdate = true
      if (t === 'alpha') ref.current.transparent = Boolean(v !== undefined && v < 1)

      ref.current[t] = v
    }, [])

    const p = useMemo(() => getLayerMaterialArgs(props), [])

    useControls(
      {
        'Copy JSX': button(() => {
          const serialized = ref.current.layers.map((l) => l.serialize())
          const jsx = serializedLayersToJSX(serialized, ref.current.serialize())
          navigator.clipboard.writeText(jsx)
        }),
      },
      { store }
    )

    useControls(
      'Base',
      {
        Color: {
          value: '#' + new Color(ref.current?.color || props?.color || 'white').getHexString(),
          onChange: (v) => onBasePropsChange('color', v),
        },
        Alpha: {
          value: ref.current?.alpha || props?.alpha || 1,
          min: 0,
          max: 1,
          onChange: (v) => onBasePropsChange('alpha', v),
        },
      },
      { store }
    )

    React.useEffect(() => {
      const layers = ref.current.layers
      const schema: { [name: string]: any[] } = {}
      layers.forEach((layer: any, i: number) => {
        if (layer.getSchema) schema[`${layer.name} ~${i}`] = layer.getSchema()
      })
      setLayers(schema)
    }, [ref.current, children, props.layers])

    React.useEffect(() => {
      const data = store.getData()
      const updatedData = data[path[0]] as DataItem & {
        value: any
      }

      if (updatedData) {
        const split = path[0].split('.')
        const index = parseInt(split[0].split(' ~')[1])

        const property = path[1]

        const id = ref.current.layers[index].uuid
        const uniform = ref.current.uniforms[`u_${id}_${property}`]

        const layer = ref.current.layers[index] as LAYERS.Abstract & {
          [key: string]: any
        }

        if (property !== 'map') {
          layer[property] = updatedData.value

          if (uniform) {
            uniform.value = getUniform(updatedData.value)
          } else {
            ref.current.layers[index].buildShaders(ref.current.layers[index].constructor)

            ref.current.update()
          }
        } else {
          ;(async () => {
            try {
              if (updatedData.value) {
                const t = await textureLoader.loadAsync(updatedData.value)
                layer[property] = t
                uniform.value = t
              } else {
                layer[property] = undefined
                uniform.value = undefined
              }
            } catch (error) {
              console.error(error)
            }
          })()
        }
      }
    }, [path])

    React.useLayoutEffect(() => {
      ref.current.layers = props.layers as LAYERS.Abstract[]
      ref.current.update()
    }, [props.layers])

    React.useLayoutEffect(() => {
      ref.current.layers = (ref.current as any).__r3f.objects
      ref.current.update()
    }, [children])

    React.useLayoutEffect(() => {
      const root = document.body.querySelector('#root')
      if (root) {
        const div = document.createElement('div')
        root.appendChild(div)
        ReactDOM.render(
          ReactDOM.createPortal(
            <LevaPanel
              titleBar={{
                title: props.name || ref.current.name,
              }}
              store={store}
            />,
            div
          ),
          div
        )
      }
    }, [props.name])

    return (
      <>
        {Object.entries(layers).map(([name, layers], i) => (
          <DynamicLeva key={`${name} ~${i}`} name={name} layers={layers} store={store} setUpdate={setPath} />
        ))}
        <layerMaterial args={p} ref={mergeRefs([ref, forwardRef])} {...props}>
          {children}
        </layerMaterial>
      </>
    )
  }
)

export default DebugLayerMaterial
