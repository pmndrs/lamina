import { ElementProps, extend, ThreeElement } from '@react-three/fiber'
import React, { useImperativeHandle, useMemo } from 'react'
import {
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
} from 'three'
import DebugLayerMaterial from './debug'
import {
  ColorProps,
  DepthProps,
  DisplaceProps,
  FresnelProps,
  GradientProps,
  LayerMaterialProps,
  MatcapProps,
  NoiseProps,
  NormalProps,
  TextureProps,
} from './types'
import { getLayerMaterialArgs } from './utils/Functions'
import * as LAYERS from './vanilla'

declare module '@react-three/fiber' {
  interface ThreeElements {
    layerMaterial: ThreeElement<typeof LAYERS.LayerMaterial>
    depth_: ThreeElement<typeof LAYERS.Depth>
    color_: ThreeElement<typeof LAYERS.Color>
    noise_: ThreeElement<typeof LAYERS.Noise>
    fresnel_: ThreeElement<typeof LAYERS.Fresnel>
    gradient_: ThreeElement<typeof LAYERS.Gradient>
    matcap_: ThreeElement<typeof LAYERS.Matcap>
    texture_: ThreeElement<typeof LAYERS.Texture>
    displace_: ThreeElement<typeof LAYERS.Displace>
    normal_: ThreeElement<typeof LAYERS.Normal>
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

export type AllMaterialProps = ElementProps<typeof MeshPhongMaterial> & //
  ElementProps<typeof MeshPhysicalMaterial> &
  ElementProps<typeof MeshToonMaterial> &
  ElementProps<typeof MeshBasicMaterial> &
  ElementProps<typeof MeshLambertMaterial> &
  ElementProps<typeof MeshStandardMaterial>

const LayerMaterial = React.forwardRef<
  LAYERS.LayerMaterial,
  React.PropsWithChildren<LayerMaterialProps & Omit<AllMaterialProps, 'color'>>
>(({ children, ...props }, forwardRef) => {
  const ref = React.useRef<LAYERS.LayerMaterial>(null!)
  useImperativeHandle(forwardRef, () => ref.current)

  React.useLayoutEffect(() => {
    ref.current.layers = (ref.current as any).__r3f.children?.map((l: any) => l.object)
    ref.current.refresh()
  }, [children])

  const [args, otherProps] = useMemo(() => getLayerMaterialArgs(props), [props])

  return (
    <layerMaterial args={[args]} ref={ref} {...otherProps}>
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

const Depth = React.forwardRef<LAYERS.Depth, DepthProps>((props, forwardRef) => {
  //@ts-ignore
  return <depth_ args={getNonUniformArgs(props)} ref={forwardRef} {...props} />
}) as React.ForwardRefExoticComponent<DepthProps & React.RefAttributes<LAYERS.Depth>>

const Color = React.forwardRef<LAYERS.Color, ColorProps>((props, ref) => {
  //@ts-ignore
  return <color_ ref={ref} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<ColorProps & React.RefAttributes<LAYERS.Color>>

const Noise = React.forwardRef<LAYERS.Noise, NoiseProps>((props, ref) => {
  //@ts-ignore
  return <noise_ ref={ref} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<NoiseProps & React.RefAttributes<LAYERS.Noise>>

const Fresnel = React.forwardRef<LAYERS.Fresnel, FresnelProps>((props, ref) => {
  //@ts-ignore
  return <fresnel_ ref={ref} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<FresnelProps & React.RefAttributes<LAYERS.Fresnel>>

const Gradient = React.forwardRef<LAYERS.Gradient, GradientProps>((props, ref) => {
  //@ts-ignore
  return <gradient_ ref={ref} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<GradientProps & React.RefAttributes<LAYERS.Gradient>>

const Matcap = React.forwardRef<LAYERS.Matcap, MatcapProps>((props, ref) => {
  //@ts-ignore
  return <matcap_ ref={ref} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<MatcapProps & React.RefAttributes<LAYERS.Matcap>>

const Texture = React.forwardRef<LAYERS.Texture, TextureProps>((props, ref) => {
  //@ts-ignore
  return <texture_ ref={ref} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<TextureProps & React.RefAttributes<LAYERS.Texture>>

const Displace = React.forwardRef<LAYERS.Displace, DisplaceProps>((props, ref) => {
  //@ts-ignore
  return <displace_ ref={ref} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<DisplaceProps & React.RefAttributes<LAYERS.Displace>>

const Normal = React.forwardRef<LAYERS.Normal, NormalProps>((props, ref) => {
  //@ts-ignore
  return <normal_ ref={ref} args={getNonUniformArgs(props)} {...props} />
}) as React.ForwardRefExoticComponent<NormalProps & React.RefAttributes<LAYERS.Normal>>

export { Color, DebugLayerMaterial, Depth, Displace, Fresnel, Gradient, LayerMaterial, Matcap, Noise, Normal, Texture }
