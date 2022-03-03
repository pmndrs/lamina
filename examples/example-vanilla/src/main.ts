import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LayerMaterial, Color, Depth, Fresnel } from 'lamina/vanilla'
import './style.css'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.001, 1000)
camera.position.set(2, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.style.width = '100%'
renderer.domElement.style.height = '100%'
document.body.appendChild(renderer.domElement)

const flowerGeometry = new THREE.TorusKnotGeometry(0.4, 0.05, 400, 32, 3, 7)
const flowerMaterial = new LayerMaterial({
  lighting: 'none',
  color: new THREE.Color('#ff4eb8').convertSRGBToLinear(),
  layers: [
    new Depth({
      far: 3,
      origin: [1, 1, 1],
      colorA: new THREE.Color('#ff00e3').convertSRGBToLinear(),
      colorB: new THREE.Color('#00ffff').convertSRGBToLinear(),
      alpha: 0.5,
      mode: 'multiply',
      mapping: 'vector',
    }),
    new Depth({
      name: 'MouseDepth',
      near: 0.25,
      far: 2,
      origin: [-0.9760456268614979, 0.48266696923176067, 0],
      colorA: new THREE.Color(1, 0.7607843137254902, 0).convertSRGBToLinear(),
      alpha: 0.5,
      mode: 'lighten',
      mapping: 'vector',
    }),
    new Fresnel({
      mode: 'softlight',
    }),
  ],
})

const flowerMesh = new THREE.Mesh(flowerGeometry, flowerMaterial)
flowerMesh.rotateY(Math.PI / 2)
flowerMesh.scale.setScalar(2)
scene.add(flowerMesh)

const geometry = new THREE.SphereGeometry(1, 64, 64)
const material = new LayerMaterial({
  lighting: 'none',
  side: THREE.BackSide,
  layers: [
    new Color({
      color: new THREE.Color('#f0aed2').convertSRGBToLinear(),
    }),
    new Depth({
      near: 0,
      far: 300,
      origin: [100, 100, 100],
      colorA: new THREE.Color('#ff0000').convertSRGBToLinear(),
      colorB: new THREE.Color('#00aaff').convertSRGBToLinear(),
      alpha: 0.5,
      mode: 'multiply',
    }),
  ],
})

const mesh = new THREE.Mesh(geometry, material)
mesh.scale.setScalar(100)
scene.add(mesh)

{
  const geometry = new THREE.SphereGeometry(0.2, 64, 64)
  const material = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    // @ts-ignore
    thickness: 10,
    roughness: 0.2,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}

const controls = new OrbitControls(camera, renderer.domElement)

const pLight = new THREE.PointLight()
pLight.position.set(10, 10, 5)
scene.add(pLight)
const pLight2 = new THREE.PointLight(new THREE.Color('#00ffff').convertSRGBToLinear())
pLight2.position.set(-10, -10, -5)
scene.add(pLight2)

const clock = new THREE.Clock()

const depthLayer = flowerMaterial.layers.find((e) => e.name === 'MouseDepth')
const vec = new THREE.Vector3()
window.addEventListener('mousemove', (e) => {
  const m = new THREE.Vector2(
    THREE.MathUtils.mapLinear(e.x / window.innerWidth, 0, 1, 1, -1),
    THREE.MathUtils.mapLinear(e.y / window.innerHeight, 0, 1, 1, -1)
  )

  // @ts-ignore
  depthLayer.origin = vec.set(-m.y, m.x, 0)
})

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  controls.update()

  const delta = clock.getDelta()
  mesh.rotation.x = mesh.rotation.y = mesh.rotation.z += delta
  flowerMesh.rotation.z += delta / 2
}

animate()
