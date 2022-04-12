import { PlaneProps, usePlane } from '@react-three/cannon'

export default function Floor(props: PlaneProps) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -1.3, 0] }))
  return (
    // @ts-ignore
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={[2000, 2000]} />
      <shadowMaterial color="#2114db" />
    </mesh>
  )
}
