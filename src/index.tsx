import * as React from 'react'
import { extend, Node } from '@react-three/fiber'
import mergeRefs from 'react-merge-refs'
import * as LAYERS from './vanilla'

import { DebugLayerMaterial } from './helpers/Debug'
import { LayerMaterialProps } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial: Node<LAYERS.LayerMaterial, typeof LAYERS.LayerMaterial>
      color_: Node<LAYERS.Color, typeof LAYERS.Color>
      depth_: Node<LAYERS.Depth, typeof LAYERS.Depth>
      fresnel_: Node<LAYERS.Fresnel, typeof LAYERS.Fresnel>
      noise_: Node<LAYERS.Noise, typeof LAYERS.Noise>
      normals_: Node<LAYERS.Normals, typeof LAYERS.Normals>
      texture_: Node<LAYERS.Texture, typeof LAYERS.Texture>
    }
  }
}

extend({
  LayerMaterial: LAYERS.LayerMaterial,
  Color_: LAYERS.Color,
  Depth_: LAYERS.Depth,
  Fresnel_: LAYERS.Fresnel,
  Noise_: LAYERS.Noise,
  Normals_: LAYERS.Normals,
  Texture_: LAYERS.Texture,
})

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

const Color = React.forwardRef((props: JSX.IntrinsicElements['color_'], forwardRef) => {
  return <color_ ref={forwardRef as any} {...props} />
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

export { LayerMaterial, DebugLayerMaterial, Color, Depth, Fresnel, Noise, Normals, Texture }
