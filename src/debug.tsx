import { extend } from '@react-three/fiber'
import { button, LevaPanel, useControls, useCreateStore } from 'leva'
import { DataItem, StoreType } from 'leva/dist/declarations/src/types'
import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import mergeRefs from 'react-merge-refs'
import { getLayerMaterialArgs, getUniform } from './utils/Functions'
import { serializedLayersToJSX } from './utils/ExportUtils'
import * as LAYERS from './vanilla'
import { Color, TextureLoader } from 'three'
import { LayerMaterialProps, ShadingTypes } from './types'

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

    const { Lighting } = useControls(
      'Base',
      {
        Color: {
          value: '#' + new Color(ref.current?.baseColor || props?.color || 'white').getHexString(),
          onChange: (v) => {
            ref.current.uniforms[`u_lamina_color`].value = getUniform(v)
            ref.current.uniformsNeedUpdate = true
            ref.current['baseColor'] = v
          },
        },
        Alpha: {
          value: ref.current?.alpha || props?.alpha || 1,
          min: 0,
          max: 1,
          onChange: (v) => {
            ref.current.uniforms[`u_lamina_alpha`].value = getUniform(v)
            ref.current.uniformsNeedUpdate = true
            ref.current['alpha'] = v
            ref.current.needsUpdate = true
          },
        },
        Lighting: {
          value: ref.current?.lighting || props?.lighting || 'basic',
          options: Object.keys(ShadingTypes),
        },
      },
      { store }
    )
    const [args, otherProps] = useMemo(() => getLayerMaterialArgs({ ...props, lighting: Lighting }), [props, Lighting])

    React.useEffect(() => {
      const layers = ref.current.layers

      const schema: { [name: string]: any[] } = {}
      layers.forEach((layer: any, i: number) => {
        if (layer.getSchema) schema[`${layer.name} ~${i}`] = layer.getSchema()
      })

      setLayers(schema)
    }, [children])

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
            layer.buildShaders(layer.constructor)
            ref.current.refresh()
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
      ref.current.layers = (ref.current as any).__r3f.objects
      ref.current.refresh()
    }, [children, args])

    React.useLayoutEffect(() => {
      const root = document.body.querySelector('#root')
      const div = document.createElement('div')

      if (root) {
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

      return () => {
        div.remove()
      }
    }, [props.name])

    return (
      <>
        {Object.entries(layers).map(([name, layers], i) => (
          <DynamicLeva key={`${name} ~${i}`} name={name} layers={layers} store={store} setUpdate={setPath} />
        ))}
        <layerMaterial args={[args]} ref={mergeRefs([ref, forwardRef])} {...otherProps}>
          {children}
        </layerMaterial>
      </>
    )
  }
)

export default DebugLayerMaterial
