import * as React from 'react'
import * as THREE from 'three'
import { extend, ReactThreeFiber, applyProps } from '@react-three/fiber'
import mergeRefs from 'react-merge-refs'
import { useControls, folder } from 'leva'
import * as LAYERS from './vanilla'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial: ReactThreeFiber.Node<LAYERS.LayerMaterial, typeof LAYERS.LayerMaterial>
      base_: ReactThreeFiber.Node<LAYERS.Base, typeof LAYERS.Base>
      depth_: ReactThreeFiber.Node<LAYERS.Depth, typeof LAYERS.Depth>
      fresnel_: ReactThreeFiber.Node<LAYERS.Fresnel, typeof LAYERS.Fresnel>
      noise_: ReactThreeFiber.Node<LAYERS.Noise, typeof LAYERS.Noise>
      normals_: ReactThreeFiber.Node<LAYERS.Normals, typeof LAYERS.Normals>
      texture_: ReactThreeFiber.Node<LAYERS.Normals, typeof LAYERS.Texture>
    }
  }
}

extend({
  LayerMaterial: LAYERS.LayerMaterial,
  Base_: LAYERS.Base,
  Depth_: LAYERS.Depth,
  Fresnel_: LAYERS.Fresnel,
  Noise_: LAYERS.Noise,
  Normals_: LAYERS.Normals,
  Texture_: LAYERS.Texture,
})

export type LayerMaterialProps = JSX.IntrinsicElements['layerMaterial'] & {
  children?: React.ReactNode
}

const LayerMaterial = React.forwardRef(({ children, ...props }: LayerMaterialProps, forwardRef) => {
  const ref = React.useRef<LAYERS.LayerMaterial>(null!)
  React.useLayoutEffect(() => {
    ref.current.layers = (ref.current as any).__r3f.objects
    ref.current.update()
  }, [children])

  return (
    <layerMaterial ref={mergeRefs([ref, forwardRef])} {...props}>
      {children}
    </layerMaterial>
  )
})

const Base = React.forwardRef((props: JSX.IntrinsicElements['base_'], forwardRef) => {
  return <base_ ref={forwardRef as any} {...props} />
})

const Depth = React.forwardRef((props: JSX.IntrinsicElements['depth_'], forwardRef) => {
  return <depth_ ref={forwardRef as any} {...props} />
})

const Fresnel = React.forwardRef((props: JSX.IntrinsicElements['fresnel_'], forwardRef) => {
  return <fresnel_ ref={forwardRef as any} {...props} />
})

const Noise = React.forwardRef((props: JSX.IntrinsicElements['noise_'], forwardRef) => {
  return <noise_ ref={forwardRef as any} {...props} />
})

const Normals = React.forwardRef((props: JSX.IntrinsicElements['normals_'], forwardRef) => {
  return <normals_ ref={forwardRef as any} {...props} />
})
const Texture = React.forwardRef((props: JSX.IntrinsicElements['texture_'], forwardRef) => {
  return <texture_ ref={forwardRef as any} {...props} />
})

const modes = [
  'normal',
  'add',
  'subtract',
  'multiply',
  'addsub',
  'lighten',
  'darken',
  'switch',
  'divide',
  'overlay',
  'screen',
  'softlight',
]

function getProps(name: string, value: any) {
  switch (name) {
    case 'color':
    case 'colorA':
    case 'colorB':
      return { value: '#' + value.getHexString() }
    case 'near':
    case 'far':
      return { value, min: 0, max: Math.max(10, value * 10) }
    case 'alpha':
    case 'bias':
      return { value, min: 0, max: 1 }
    case 'intensity':
    case 'power':
      return { value, min: 0, max: 10 }
    default:
      return { value }
  }
}

function DebugLayer({ layer }: { layer: LAYERS.Abstract }) {
  const { name, mode, uniforms } = layer
  const props: { [key: string]: any } = {}
  Object.entries(uniforms).forEach(([key, uniform]) => {
    const split = key.split('_')
    const name = split[split.length - 1]
    props[name] = {
      ...getProps(name, uniform.value),
      transient: true,
      onChange: (value: any) => {
        if (uniform.value instanceof THREE.Color) {
          uniform.value.set(value)
        } else {
          applyProps(layer as any, { [`uniforms-${key}-value`]: value })
        }
      },
    }
  })

  useControls({
    [name]: folder({
      mode: {
        value: mode,
        options: modes,
        transient: true,
        onChange: (value, path, ctx) => {
          layer.mode = value
          (layer as any).__r3f?.parent?.update()
        },
      },
      ...props,
    }),
  })
  return null
}

function DebugLayerMaterial(props: LayerMaterialProps) {
  const ref = React.useRef<LAYERS.LayerMaterial>(null!)
  const [layers, setLayers] = React.useState<LAYERS.Abstract[]>([])
  React.useLayoutEffect(() => {
    setLayers((ref.current as any).__r3f.objects)
  }, [props.children])
  return (
    <>
      {layers.map((layer) => (
        <DebugLayer key={layer.uuid} layer={layer} />
      ))}
      <LayerMaterial ref={ref} {...props} />
    </>
  )
}

export { DebugLayerMaterial, LayerMaterial, Base, Depth, Fresnel, Noise, Normals, Texture }
