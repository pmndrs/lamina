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
import React, { useLayoutEffect, useMemo } from 'react'
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
  LayerMaterialParameters,
  ShaderProps,
} from '../types'
import * as LAYERS from '../vanilla'
import { useEffect } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial: Node<LAYERS.LayerMaterial, typeof LAYERS.LayerMaterial>
      depth_: Node<LAYERS.Depth, typeof LAYERS.Depth>
      color_: Node<LAYERS.Color, typeof LAYERS.Color>
      noise_: Node<LAYERS.Noise, typeof LAYERS.Noise>
      fresnel_: Node<LAYERS.Fresnel, typeof LAYERS.Fresnel>
      gradient_: Node<LAYERS.Gradient, typeof LAYERS.Gradient>
      matcap_: Node<LAYERS.Matcap, typeof LAYERS.Matcap>
      texture_: Node<LAYERS.Texture, typeof LAYERS.Texture>
      displace_: Node<LAYERS.Displace, typeof LAYERS.Displace>
      normal_: Node<LAYERS.Normal, typeof LAYERS.Normal>
      shader_: Node<LAYERS.Shader, typeof LAYERS.Shader>
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
  Shader_: LAYERS.Shader,
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
  const ref = React.useRef<LAYERS.LayerMaterial>(null!)
  const args = useMemo(() => [{ lighting: props.lighting }], [props.lighting]) as [Partial<LayerMaterialParameters>]

  useLayoutEffect(() => {
    const layers: LAYERS.Abstract[] = (ref.current as any).__r3f.objects
    const isSame =
      layers.length === ref.current.layers.length &&
      layers.every((layer, i) => layer.uuid === ref.current.layers[i].uuid)

    if (!isSame) {
      ref.current.layers = [...layers]
      ref.current.refresh()
    }
  }, [children])

  return (
    <layerMaterial args={args} ref={mergeRefs([ref, forwardRef]) as any} {...(props as LayerMaterialParameters)}>
      {children}
    </layerMaterial>
  )
})

const Depth = React.forwardRef<LAYERS.Depth, DepthProps>((props, ref) => {
  return <depth_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<DepthProps & React.RefAttributes<LAYERS.Depth>>

const Color = React.forwardRef<LAYERS.Color, ColorProps>((props, ref) => {
  return <color_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<ColorProps & React.RefAttributes<LAYERS.Color>>

const Noise = React.forwardRef<LAYERS.Noise, NoiseProps>((props, ref) => {
  return <noise_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<NoiseProps & React.RefAttributes<LAYERS.Noise>>

const Fresnel = React.forwardRef<LAYERS.Fresnel, FresnelProps>((props, ref) => {
  return <fresnel_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<FresnelProps & React.RefAttributes<LAYERS.Fresnel>>

const Gradient = React.forwardRef<LAYERS.Gradient, GradientProps>((props, ref) => {
  return <gradient_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<GradientProps & React.RefAttributes<LAYERS.Gradient>>

const Matcap = React.forwardRef<LAYERS.Matcap, MatcapProps>((props, ref) => {
  return <matcap_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<MatcapProps & React.RefAttributes<LAYERS.Matcap>>

const Texture = React.forwardRef<LAYERS.Texture, TextureProps>((props, ref) => {
  return <texture_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<TextureProps & React.RefAttributes<LAYERS.Texture>>

const Displace = React.forwardRef<LAYERS.Displace, DisplaceProps>((props, ref) => {
  return <displace_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<DisplaceProps & React.RefAttributes<LAYERS.Displace>>

const Normal = React.forwardRef<LAYERS.Normal, NormalProps>((props, ref) => {
  return <normal_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<NormalProps & React.RefAttributes<LAYERS.Normal>>

const Shader = React.forwardRef<LAYERS.Shader, ShaderProps>((props, ref) => {
  return <shader_ ref={ref} {...props} />
}) as React.ForwardRefExoticComponent<ShaderProps & React.RefAttributes<LAYERS.Shader>>

export { LayerMaterial, Depth, Color, Noise, Fresnel, Gradient, Matcap, Texture, Displace, Normal, Shader }
