import * as LAYERS from './vanilla'
import { extend, Node } from '@react-three/fiber'
import * as React from 'react'
import mergeRefs from 'react-merge-refs'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial_: Node<LAYERS.LayerMaterial, typeof LAYERS.LayerMaterial>
      base_: Node<LAYERS.Base, typeof LAYERS.Base>
      depth_: Node<LAYERS.Depth, typeof LAYERS.Depth>
      fresnel_: Node<LAYERS.Fresnel, typeof LAYERS.Fresnel>
      noise_: Node<LAYERS.Noise, typeof LAYERS.Noise>
    }
  }
}

extend(LAYERS)

export type LayerMaterialProps = JSX.IntrinsicElements['layerMaterial_'] & {
  children?: React.ReactNode
}

const LayerMaterial = React.forwardRef(({ children, ...props }: LayerMaterialProps, forwardRef) => {
  const ref = React.useRef<LAYERS.LayerMaterial>(null!)
  React.useLayoutEffect(() => {
    Object.assign(ref.current, LAYERS.LayerMaterial.constructShader({ layers: (ref.current as any).__r3f.objects }))
    ref.current.uniformsNeedUpdate = true
    ref.current.needsUpdate = true
  }, [children])

  return (
    <layerMaterial_ ref={mergeRefs([ref, forwardRef])} {...props}>
      {children}
    </layerMaterial_>
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

export { LayerMaterial, Base, Depth, Fresnel, Noise }
