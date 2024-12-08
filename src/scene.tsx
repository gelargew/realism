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
	Lightformer,
	Stats,
	Stage,
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
import { Effects2 } from './effects2'

export default function Scene() {
	return (
		<>
			<Canvas
				shadows
				camera={{ position: [8, 2.5, 8], fov: 35, near: 0.2 }}
				gl={{ antialias: false }}
				flat
				dpr={0.8}
			>
				<color attach="background" args={['#141622']} />
				<Suspense fallback={null}>
					<group position={[0, -0.5, 0]}>
						{/* <Center top>
							<Suzi rotation={[-0.63, 0, 0]} scale={2} />
						</Center> */}

						<Center top position={[0, -5, 18]}>
							<Boxes />
						</Center>
						{/* <directionalLight
							intensity={1}
							position={[-3, 1, -2]}
							castShadow
						/> */}

						<directionalLight
							intensity={0.1}
							position={[3, 1, -2]}
							castShadow
						/>

						<directionalLight
							intensity={0.1}
							position={[-3, 1, 2]}
							castShadow
						/>
					</group>
					<OrbitControls
						minPolarAngle={0}
						maxPolarAngle={Math.PI / 2}
					/>
					{/* <Environment preset="night" environmentIntensity={0.1} /> */}
					<Environment resolution={64}>
						<group>
							<Lightformer
								form="circle"
								intensity={0.2}
								rotation-x={Math.PI / 2}
								position={[0, 0.1, 0]}
								scale={8}
							/>
							<Lightformer
								form="circle"
								intensity={0.2}
								rotation-y={Math.PI / 2}
								position={[2, 2, -1]}
								scale={4}
							/>
							<Lightformer
								form="circle"
								intensity={0.2}
								rotation-y={Math.PI / 2}
								position={[-1, 1, 3]}
								scale={4}
							/>
							{/* <Lightformer
								form="ring"
								intensity={2}
								rotation-y={Math.PI / 2}
								position={[-1, 1, 3]}
								scale={8}
							/> */}
						</group>
					</Environment>
					<Box

						position={[0, -3, 0]}
						args={[55, 54, 5]}
						rotation-x={-Math.PI / 2}
					>
						<meshPhongMaterial
							color="#000000"
							// roughness={0.8}
							// envMapIntensity={0.1}
							// metalness={1}
						/>
					</Box>
					{/* <BakeShadows /> */}
				</Suspense>
				{/* <CustomEffects /> */}
				<Effects2 />
				<Stats />
			</Canvas>

		</>
	)
}
const gridWidth = 55
const gridHeight = 55
const gridSize = gridWidth * gridHeight
const Boxes = () => {
	const { roughness, metalness, normalScale } = useControls({
		roughness: { value: 0.6, min: 0, max: 1 },
		metalness: { value: 1, min: 0, max: 1 },
	})
	return (
		<Instances castShadow receiveShadow>
			<boxGeometry args={[1, 6, 1]} />
			<meshPhysicalMaterial
				color="#000000"
				roughness={roughness}
				metalness={metalness}
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
			<Instance
				castShadow
				receiveShadow
				rotation={[0, Math.PI / 4, 0]}
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
			scale={0.9}
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
