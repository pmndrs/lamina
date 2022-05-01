import * as React from 'react'
import * as LAYERS from '../vanilla'

import mergeRefs from 'react-merge-refs'
import { useLoader } from '@react-three/fiber'

import { LayerMaterial } from '.'
import { LaminaLoader } from './Loader'
import { LayerMaterialProps, LayerProps } from '../types'

export function useLamina<T extends LayerProps>(url: string) {
  // @ts-ignore
  const material = useLoader(LaminaLoader, url)

  return material instanceof LAYERS.LayerMaterial
    ? React.forwardRef<LAYERS.LayerMaterial, React.PropsWithChildren<Omit<LayerMaterialProps, 'ref'>>>(
        (props, forwardRef) => {
          const ref = React.useRef<LAYERS.LayerMaterial>(null!)

          return (
            <LayerMaterial ref={mergeRefs([ref, forwardRef])} {...material.serialize().currents} {...props}>
              {material.layers.map((e) => (
                <primitive key={e.uuid} object={e} />
              ))}
              {props.children}
            </LayerMaterial>
          )
        }
      )
    : React.forwardRef<LAYERS.Abstract, T>((props, ref) => {
        return <primitive ref={ref} object={material} {...props} />
      })
}
