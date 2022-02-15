import { extend, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { button, LevaPanel, useControls, useCreateStore } from 'leva'
import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import mergeRefs from 'react-merge-refs'
import { DebugSchema, LayerMaterialProps } from 'src/types'
import { LayerMaterial } from '../vanilla'
import { Abstract, LayerMaterial as LayerMaterialType } from '../vanilla'
import { HtmlProps } from '@react-three/drei/web/Html'
import { StoreType } from 'leva/dist/declarations/src/types'
import { Color } from 'three'
import { copyMaterial, downloadMaterial } from '../utils/ExportUtils'

extend({
  LayerMaterial: LayerMaterial,
})

function DynamicLeva({
  name,
  layers,
  store,
  setUpdate,
}: {
  setUpdate: any
  name: string
  layers: DebugSchema[]
  store: StoreType
}) {
  useControls(
    name,
    () => {
      const o: any = {}
      layers.forEach((layer, i: number) => {
        const n = `${layer.label}$${i}`
        o[n] = layer
        o[n].onChange = () => setUpdate([`${name}.${n}`, layer.__constructorKey])
      })
      return o
    },
    { store },
    [layers, name]
  )

  return null
}

function getProps(name: string, value: any) {
  switch (name) {
    case 'color':
    case 'colorA':
    case 'colorB':
      return new Color(value)

    default:
      return value
  }
}

export const DebugLayerMaterial = React.forwardRef(
  ({ children, ...props }: React.PropsWithChildren<LayerMaterialProps>, forwardRef) => {
    const store = useCreateStore()
    const ref = React.useRef<LayerMaterialType>(null!)
    const [layers, setLayers] = useState<{ [name: string]: DebugSchema[] }>({})

    const [update, setUpdate] = useState(['', ''])

    const onBasePropsChange = useCallback((t, v) => {
      // @ts-ignore
      ref.current[t] = v
      ref.current.update()
    }, [])

    useControls(
      {
        Copy: button(() => copyMaterial(ref.current.serialize())),
        Export: button(() => downloadMaterial(ref.current.serialize())),
      },
      { store }
    )

    useControls(
      'Base',
      {
        Color: {
          value: '#' + new Color(props.color).getHexString(),
          onChange: (v) => onBasePropsChange('color', v),
        },
        Alpha: {
          value: props.alpha || 1,
          min: 0,
          max: 1,
          onChange: (v) => onBasePropsChange('alpha', v),
        },
      },
      { store }
    )

    React.useLayoutEffect(() => {
      ref.current.layers = (ref.current as any).__r3f.objects
      ref.current.update()
    }, [children])

    useEffect(() => {
      const layers = ref.current.layers
      const schema: { [name: string]: DebugSchema[] } = {}
      layers.forEach((layer: any, i: number) => {
        schema[`${layer.name}$${i}`] = layer.getSchema()
      })
      setLayers(schema)
    }, [ref.current])

    React.useEffect(() => {
      const data = store.getData()
      const updatedData = data[update[0]]

      if (updatedData) {
        const split = update[0].split('.')
        const index = split[0].split('$')[1]

        const property = update[1]

        // @ts-ignore
        const id = ref.current.layers[index].uuid
        const uniform = ref.current.uniforms[`u_${id}_${property}`]

        let t = ref.current.uniforms

        // @ts-ignore
        ref.current.layers[index][property] = updatedData.value
        if (uniform) {
          // @ts-ignore
          uniform.value = getProps(property, updatedData.value)
        } else {
          ref.current.update()
        }
      }
    }, [update])

    return (
      <>
        {Object.entries(layers).map(([name, layers], i) => (
          <DynamicLeva key={`${name}$${i}`} name={name} layers={layers} store={store} setUpdate={setUpdate} />
        ))}
        <FullScreenHtml>
          <LevaPanel store={store} />
        </FullScreenHtml>
        <layerMaterial ref={mergeRefs([ref, forwardRef])} {...props}>
          {children}
        </layerMaterial>
      </>
    )
  }
)

function FullScreenHtml({ children, ...rest }: React.PropsWithChildren<HtmlProps>) {
  const htmlRef = React.useRef<HTMLDivElement>(null!)

  React.useEffect(() => {
    if (htmlRef.current?.parentElement) {
      htmlRef.current.parentElement!.style.pointerEvents = 'none'
      htmlRef.current.parentElement!.style.width = '100%'
      htmlRef.current.parentElement!.style.height = '100%'
      htmlRef.current.style.width = '100%'
      htmlRef.current.style.height = '100%'

      // @ts-ignore
      htmlRef.current.children[0].style.pointerEvents = 'all'
    }
  }, [htmlRef])

  return (
    <Html ref={htmlRef} center {...rest}>
      {children}
    </Html>
  )
}
