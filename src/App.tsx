import * as THREE from 'three'
import { Suspense, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import {
	Center,
	AccumulativeShadows,
	RandomizedLight,
	OrbitControls,
	Environment,
	useGLTF,
	SpotLight,
	Circle,
	Box,
	BakeShadows,
	Instances,
	Instance,
} from '@react-three/drei'
import { FlakesTexture } from 'three-stdlib'
import {
	EffectComposer,
	LensFlare,
	N8AO,
} from '@react-three/postprocessing'
import { Leva, useControls } from 'leva'
import { ao } from 'three/examples/jsm/tsl/display/GTAONode.js'
import { CustomEffects } from './effects'

export default function App() {

	return (
		<>
			<Canvas
				shadows
				camera={{ position: [8, 2.5, 8], fov: 35, near: 0.2 }}
			>
				<Suspense fallback={null}>
					<group position={[0, -0.5, 0]}>
						{/* <Center top>
							<Suzi rotation={[-0.63, 0, 0]} scale={2} />
						</Center> */}

						<Center top position={[0, 0, 18]}>
							<Boxes />
						</Center>

						<directionalLight
							intensity={1}
							position={[-3, 1, -2]}
							castShadow
						/>

						<directionalLight
							intensity={1}
							position={[3, 1, -2]}
							castShadow
						/>

						<directionalLight
							intensity={1}
							position={[-3, 1, 2]}
							castShadow
						/>
					</group>
					<OrbitControls
						minPolarAngle={0}
						maxPolarAngle={Math.PI / 2}
					/>
					<Environment preset="city" environmentIntensity={0.1} />
					<Box
						receiveShadow
						position={[0, -3, 0]}
						args={[55, 54, 5]}
						rotation-x={-Math.PI / 2}
					>
						<meshPhysicalMaterial
							color="#000000"
							roughness={0.8}
							envMapIntensity={0.1}
							metalness={1}
						/>
					</Box>
					{/* <BakeShadows /> */}
				</Suspense>
				<CustomEffects />
			</Canvas>
			<Leva />
		</>
	)
}
const gridWidth = 55
const gridHeight = 55
const gridSize = gridWidth * gridHeight
const Boxes = () => {

  const {roughness, metalness, normalScale} = useControls({
    roughness: { value: 0, min: 0, max: 1 },
    metalness: { value: 1, min: 0, max: 1 },
  })
	return (
		<Instances castShadow receiveShadow>
			<boxGeometry args={[1, 1, 1]} />
			<meshPhysicalMaterial
				color="#000000"
				roughness={roughness}
				metalness={metalness}
				normalMap={
					new THREE.CanvasTexture(
						new FlakesTexture(),
						THREE.UVMapping,
						THREE.RepeatWrapping,
						THREE.RepeatWrapping
					)
				}
				normalScale={[0.01, 0.01]}
			/>
			<Instance castShadow rotation={[0, Math.PI / 4, 0]} />
			{Array.from({ length: gridSize }, (_, i) => (
				<Once key={i} index={i} />
			))}
		</Instances>
	)
}

const Once = ({index}: {index:number}) => {

  return (				<Instance
    key={index}
    scale={0.9}
    castShadow
    receiveShadow
    position={[
      (index % gridWidth) - gridWidth / 2,
      Math.random() * 4,
      Math.floor(index / gridHeight) - gridHeight / 2,
    ]}
  />)

}

function Suzi(props: any) {
	const { scene, materials } = useGLTF(
		'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-high-poly/model.gltf'
	)
	useLayoutEffect(() => {
		scene.traverse(
			(obj) =>
				obj.isMesh && (obj.receiveShadow = obj.castShadow = true)
		)
		materials.default.color.set('orange')
		materials.default.roughness = 0
		materials.default.normalMap = new THREE.CanvasTexture(
			new FlakesTexture(),
			THREE.UVMapping,
			THREE.RepeatWrapping,
			THREE.RepeatWrapping
		)
		materials.default.normalMap.repeat.set(40, 40)
		materials.default.normalScale.set(0.1, 0.1)
	})
	return <primitive object={scene} {...props} />
}
