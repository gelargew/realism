import * as THREE from 'three'
import { useRef, useReducer, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Instance, Instances, Lightformer, OrbitControls, Stage, Stats } from '@react-three/drei'

import { easing } from 'maath'
import { Effects2 } from './effects2'
import { useControls } from 'leva'
import { EffectComposer } from '@react-three/postprocessing'
import { RealismEffect } from './realismEffect'

const accents = ['#ff4060', '#ffcc00', '#20ffa0', '#4060ff']
const shuffle = (accent = 0) => [
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: '#000', roughness: 0.1, metalness: 0.1 },
  { color: '#000', roughness: 0.1, metalness: 0.1 },
  { color: '#000', roughness: 0.1, metalness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.3 },
  { color: '#444', roughness: 0.3 },
  { color: '#000', roughness: 0.1 },
  { color: '#000', roughness: 0.2 },
  { color: '#000', roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true, transparent: true, opacity: 0.5 },
  { color: accents[accent], roughness: 0.3, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true }
]

export default function SceneBall() {
  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  const connectors = useMemo(() => shuffle(accent), [accent])
  return (
    <Canvas flat shadows dpr={[1, 1]} gl={{ antialias: false }} camera={{ position: [0, 0, 30], fov: 17.5, near: 10, far: 100 }} >
      <color attach="background" args={['#141622']} />
      <ambientLight intensity={0.5} />
      <OrbitControls />
        {connectors.map((props, i) => (
          <Sphere key={i} {...props} />
        ))}
        <Boxes />
        {/* <Stage /> */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={100}  rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2}  rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2}  rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2}  rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          <Lightformer form="ring"  intensity={80} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[10, 10, 0]} scale={10} />
        </group>
      </Environment>
      <Effects2 />

      <Stats />
    </Canvas>
  )
}

function Sphere({ position, children, vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, accent, color = 'white', ...props }) {

  const pos = useMemo(() => position || [r(10), r(10), r(10)], [])

  return (
    <>

      <mesh castShadow receiveShadow position={pos}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial {...props} />
        {children}
      </mesh>
    </>
  )
}

const gridWidth = 22
const gridHeight = 22
const gridSize = gridWidth * gridHeight
const Boxes = () => {
	const { roughness, metalness, normalScale } = useControls({
		roughness: { value: 0.1, min: 0, max: 1 },
		metalness: { value: 0, min: 0, max: 1 },
	})
	return (
		<Instances  position={[0, 0, 8]}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial
				color="#ffffff"
				// roughness={roughness}
				// metalness={metalness}
				// normalMap={
				// 	new THREE.CanvasTexture(
				// 		new FlakesTexture(),
				// 		THREE.UVMapping,
				// 		THREE.RepeatWrapping,
				// 		THREE.RepeatWrapping
				// 	)
				// }
				// normalScale={[0.01, 0.01]}
			/>

			{Array.from({ length: gridSize }, (_, i) => (
				<Once key={i} index={i} />
			))}
		</Instances>
	)
}

const Once = ({ index }: { index: number }) => {
	return (
		<Instance
			key={index}
			scale={1}
      color={'blue'}
			castShadow
			receiveShadow
			position={[
				(index % gridWidth) - gridWidth / 2,
				Math.random() * 4,
				Math.floor(index / gridHeight) - gridHeight / 2,
			]}
		/>
	)
}