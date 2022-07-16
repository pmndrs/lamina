import * as React from 'react'
import { AllMaterialProps } from 'three-custom-shader-material'
import { LayerMaterialProps } from '../../types'
import { LayerMaterial as LayerMaterialType } from '../../vanilla'
import { useCreateStore } from 'leva'
import { useRef } from 'react'
import mergeRefs from 'react-merge-refs'
import useExports from './useExports'
import useAttach from './useAttach'
import useDebugBaseMaterial from './useDebugLayers'
import useDebugLayers from './useDebugLayers'

export const LaminaDebugger = React.forwardRef<
  LayerMaterialType,
  React.PropsWithChildren<LayerMaterialProps & Omit<AllMaterialProps, 'color'>>
>(({ children, ...props }, forwardRef) => {
  const ref = useRef<LayerMaterialType>(null!)
  const store = useCreateStore()

  useExports(ref, store)
  useAttach(ref, store)
  // useDebugBaseMaterial(ref, store)
  useDebugLayers(ref, store)

  if (!Array.isArray(children)) {
    return <>{React.cloneElement(children as React.ReactElement<any>, { ref: mergeRefs([forwardRef, ref]) })}</>
  } else {
    throw new Error('Lamina Debugger must contain only one <LayerMaterial /> as child.')
  }
})
