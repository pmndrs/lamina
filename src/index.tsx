import {
  extend,
  Node,
  MeshPhongMaterialProps,
  MeshPhysicalMaterialProps,
  MeshToonMaterialProps,
  MeshBasicMaterialProps,
  MeshLambertMaterialProps,
  MeshStandardMaterialProps,
} from '@react-three/fiber'
import React, { useMemo, useRef, useEffect, useLayoutEffect } from 'react'
import mergeRefs from 'react-merge-refs'
import {
  DepthProps,
  ColorProps,
  LayerMaterialProps,
  NoiseProps,
  FresnelProps,
  GradientProps,
  MatcapProps,
  TextureProps,
  DisplaceProps,
  NormalProps,
} from './types'
import * as LAYERS from './vanilla'
import DebugLayerMaterial from './debug'
import { getLayerMaterialArgs } from './utils/Functions'
import { ColorRepresentation } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial: Node<LAYERS.LayerMaterial, typeof LAYERS.LayerMaterial>
      debuglayerMaterial: Node<typeof DebugLayerMaterial, typeof DebugLayerMaterial>
      depth_: Node<LAYERS.Depth, typeof LAYERS.Depth>
      color_: Node<LAYERS.Color, typeof LAYERS.Color>
      noise_: Node<LAYERS.Noise, typeof LAYERS.Noise>
      fresnel_: Node<LAYERS.Fresnel, typeof LAYERS.Fresnel>
      gradient_: Node<LAYERS.Gradient, typeof LAYERS.Gradient>
      matcap_: Node<LAYERS.Matcap, typeof LAYERS.Matcap>
      texture_: Node<LAYERS.Texture, typeof LAYERS.Texture>
      displace_: Node<LAYERS.Displace, typeof LAYERS.Displace>
      normal_: Node<LAYERS.Normal, typeof LAYERS.Normal>
    }
  }
}

extend({
  LayerMaterial: LAYERS.LayerMaterial,
  Depth_: LAYERS.Depth,
  Color_: LAYERS.Color,
  Noise_: LAYERS.Noise,
  Fresnel_: LAYERS.Fresnel,
  Gradient_: LAYERS.Gradient,
  Matcap_: LAYERS.Matcap,
  Texture_: LAYERS.Texture,
  Displace_: LAYERS.Displace,
  Normal_: LAYERS.Normal,
})

type AllMaterialProps = MeshPhongMaterialProps & //
  MeshPhysicalMaterialProps &
  MeshToonMaterialProps &
  MeshBasicMaterialProps &
  MeshLambertMaterialProps &
  MeshStandardMaterialProps

const LayerMaterial = React.forwardRef<
  LAYERS.LayerMaterial,
  React.PropsWithChildren<LayerMaterialProps & Omit<AllMaterialProps, 'color'>>
>(({ children, ...props }, forwardRef) => {
  const ref = React.useRef<LAYERS.LayerMaterial & { __hasRefreshed: boolean }>(null!)
  const [args, otherProps] = useMemo(() => getLayerMaterialArgs(props), [props])

  useLayoutEffect(() => {
    ref.current.layers = (ref.current as any).__r3f.objects
    // This will fire before all children, allow possible children to refresh again
    ref.current.__hasRefreshed = false
  })

  return (
    <layerMaterial args={[args]} ref={mergeRefs([ref, forwardRef])} {...otherProps}>
      {children}
    </layerMaterial>
  )
})

function getNonUniformArgs(props: any) {
  return [
    {
      mode: props?.mode,
      visible: props?.visible,
      type: props?.type,
      mapping: props?.mapping,
      map: props?.map,
      axes: props?.axes,
    },
  ] as any
}

let hasRefreshed = false
function useRefresh<T>({ mode, visible, type, mapping, map, axes }: any) {
  const ref = useRef<T>()
  useEffect(() => {
    const parent: LAYERS.LayerMaterial & { __hasRefreshed: boolean } = (ref.current as any)?.__r3f?.parent
    // Refresh parent material on mount
    if (parent && parent.__hasRefreshed == false) {
      parent.refresh()
      parent.__hasRefreshed = true
    }
  }, [mode, visible, type, mapping, map, axes])
  return ref
}

const Depth = React.forwardRef<LAYERS.Depth, DepthProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Depth>(props)
  return <depth_ args={getNonUniformArgs(props)} ref={mergeRefs([ref, forwardRef])} {...props} />
}) as React.ForwardRefExoticComponent<DepthProps & React.RefAttributes<LAYERS.Depth>>

const Color = React.forwardRef<LAYERS.Color, ColorProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Color>(props)
  return <color_ ref={mergeRefs([ref, forwardRef])} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<ColorProps & React.RefAttributes<LAYERS.Color>>

const Noise = React.forwardRef<LAYERS.Noise, NoiseProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Noise>(props)
  return <noise_ ref={mergeRefs([ref, forwardRef])} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<NoiseProps & React.RefAttributes<LAYERS.Noise>>

const Fresnel = React.forwardRef<LAYERS.Fresnel, FresnelProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Fresnel>(props)
  return <fresnel_ ref={mergeRefs([ref, forwardRef])} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<FresnelProps & React.RefAttributes<LAYERS.Fresnel>>

const Gradient = React.forwardRef<LAYERS.Gradient, GradientProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Gradient>(props)
  return <gradient_ ref={mergeRefs([ref, forwardRef])} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<GradientProps & React.RefAttributes<LAYERS.Gradient>>

const Matcap = React.forwardRef<LAYERS.Matcap, MatcapProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Matcap>(props)
  return <matcap_ ref={mergeRefs([ref, forwardRef])} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<MatcapProps & React.RefAttributes<LAYERS.Matcap>>

const Texture = React.forwardRef<LAYERS.Texture, TextureProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Texture>(props)
  return <texture_ ref={mergeRefs([ref, forwardRef])} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<TextureProps & React.RefAttributes<LAYERS.Texture>>

const Displace = React.forwardRef<LAYERS.Displace, DisplaceProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Displace>(props)
  return <displace_ ref={mergeRefs([ref, forwardRef])} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<DisplaceProps & React.RefAttributes<LAYERS.Displace>>

const Normal = React.forwardRef<LAYERS.Normal, NormalProps>((props, forwardRef) => {
  const ref = useRefresh<LAYERS.Normal>(props)
  return <normal_ ref={mergeRefs([ref, forwardRef])} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<NormalProps & React.RefAttributes<LAYERS.Normal>>

export { DebugLayerMaterial, LayerMaterial, Depth, Color, Noise, Fresnel, Gradient, Matcap, Texture, Displace, Normal }
