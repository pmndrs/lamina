import * as React from 'react'
import * as THREE from 'three'

import { createRoot } from 'react-dom/client'

import { AllMaterialProps } from 'three-custom-shader-material/types'
import { LaminaMaterialFile, LayerMaterialProps } from '../../types'

import { LayerMaterial as LayerMaterialType } from '../../vanilla'
import { button, LevaPanel, useControls, useCreateStore } from 'leva'
import { useRef } from 'react'
import mergeRefs from 'react-merge-refs'
import { downloadObjectAsJson, serializedLayersToJSX } from '../../utils/ExportUtils'
import useExports from './useExports'
import useAttach from './useAttach'

export const LaminaDebugger = React.forwardRef<
  LayerMaterialType,
  React.PropsWithChildren<LayerMaterialProps & Omit<AllMaterialProps, 'color'>>
>(({ children, ...props }, forwardRef) => {
  const ref = useRef<LayerMaterialType>(null!)
  const store = useCreateStore()

  useExports(ref, store)
  useAttach(ref, store)

  if (!Array.isArray(children)) {
    return <>{React.cloneElement(children as React.ReactElement<any>, { ref: mergeRefs([forwardRef, ref]) })}</>
  } else {
    throw new Error('Lamina Debugger must contain only one <LayerMaterial /> as child.')
  }
})
