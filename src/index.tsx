import * as LAYERS from './vanilla'
import { extend, Node } from '@react-three/fiber'
import * as React from 'react'
import mergeRefs from 'react-merge-refs'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial: Node<LAYERS.LayerMaterial, typeof LAYERS.LayerMaterial>
      baseLayer: Node<LAYERS.BaseLayer, typeof LAYERS.BaseLayer>
      depthLayer: Node<LAYERS.DepthLayer, typeof LAYERS.DepthLayer>
      fresnelLayer: Node<LAYERS.FresnelLayer, typeof LAYERS.FresnelLayer>
      noiseLayer: Node<LAYERS.NoiseLayer, typeof LAYERS.NoiseLayer>
    }
  }
}

extend(LAYERS)

export type LayerMaterialProps = JSX.IntrinsicElements['layerMaterial'] & {
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
    <layerMaterial ref={mergeRefs([ref, forwardRef])} {...props}>
      {children}
    </layerMaterial>
  )
})

const Base = React.forwardRef((props: JSX.IntrinsicElements['baseLayer'], forwardRef) => {
  return <baseLayer ref={forwardRef as any} {...props} />
})

const Depth = React.forwardRef((props: JSX.IntrinsicElements['depthLayer'], forwardRef) => {
  return <depthLayer ref={forwardRef as any} {...props} />
})

const Fresnel = React.forwardRef((props: JSX.IntrinsicElements['fresnelLayer'], forwardRef) => {
  return <fresnelLayer ref={forwardRef as any} {...props} />
})

const Noise = React.forwardRef((props: JSX.IntrinsicElements['noiseLayer'], forwardRef) => {
  return <noiseLayer ref={forwardRef as any} {...props} />
})

export { LayerMaterial, Base, Depth, Fresnel, Noise }
