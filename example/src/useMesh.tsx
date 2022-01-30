import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

export default function useMesh(limit: number) {
  // @ts-ignore
  const { nodes } = useGLTF(`/mesh.glb`)

  const meshes: THREE.Mesh[] = useMemo(
    () =>
      Object.values(nodes)
        .filter((o: any) => o.isMesh)
        .splice(0, limit) as any,
    [limit, nodes]
  )

  return meshes
}

useGLTF.preload(`/mesh.glb`)
