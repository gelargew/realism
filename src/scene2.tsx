import * as THREE from 'three'
import { useRef, useReducer, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
	Box,
	Environment,
	Instance,
	Instances,
	Lightformer,
	OrbitControls,
	Stage,
	Stats,
} from '@react-three/drei'

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
	{
		color: accents[accent],
		roughness: 0.1,
		accent: true,
		transparent: true,
		opacity: 0.5,
	},
	{ color: accents[accent], roughness: 0.3, accent: true },
	{ color: accents[accent], roughness: 0.1, accent: true },
]

export default function SceneBall() {
	const [accent, click] = useReducer(
		(state) => ++state % accents.length,
		0
	)
	const connectors = useMemo(() => shuffle(accent), [accent])
	return (
		<Canvas
			flat
			shadows
			dpr={[1, 1]}
			gl={{ antialias: false }}
			camera={{ position: [16, 10, 11], fov: 22, near: 1, far: 100 }}
		>
			<color attach="background" args={['#141622']} />
			<ambientLight intensity={0.5} />
			<OrbitControls />
      {/* <pointLight position={[0, 5, 0]} intensity={2} castShadow /> */}
			<Boxes />
			{/* <Stage /> */}
			<Environment resolution={64} background>
				<group>
					{/* <Lightformer
						form="circle"
						intensity={100}
						rotation-x={Math.PI / 2}
						position={[0, 5, -9]}
						scale={2}
					/> */}
					<Lightformer
						form="circle"
						intensity={2}
						position={[-0.2, 0, -0.2]}
						scale={2}

					/>
					<Lightformer
						form="circle"
						intensity={2}
						position={[0.2, 0, 0.2]}
						scale={2}

					/>
					<Lightformer
						form="circle"
						intensity={1}
						position={[0, 0.2, 0]}
						scale={1}
            // color={'#999'}
					/>
          					<Lightformer
						form="circle"
						intensity={1}
						position={[0, -0.2, 0]}
						scale={1}
            // color={'#999'}
					/>
					<Lightformer
						form="circle"
						intensity={2}
						position={[1, 1, -1]}
						scale={2}
					/>
					<Lightformer
						form="circle"
						intensity={2}
						position={[-1, -1, 1]}
						scale={2}
					/>
				</group>
			</Environment>
			<Effects2 />

			<Stats />
		</Canvas>
	)
}

function Sphere({
	position,
	children,
	vec = new THREE.Vector3(),
	scale,
	r = THREE.MathUtils.randFloatSpread,
	accent,
	color = 'white',
	...props
}) {
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

const gridWidth = 44
const gridHeight = 44
const gridSize = gridWidth * gridHeight
const Boxes = () => {
	const { roughness, metalness, normalScale } = useControls({
		roughness: { value: 0.4, min: 0, max: 1 },
		metalness: { value: 1, min: 0, max: 1 },
	})
	return (
		// <Instances  position={[0, 0, 8]}>
		// 	<boxGeometry args={[1, 1, 1]} />
		// 	<meshStandardMaterial
		// 		color="#ffffff"
		// 		roughness={roughness}
		// 		metalness={metalness}
		// 		normalMap={
		// 			new THREE.CanvasTexture(
		// 				new FlakesTexture(),
		// 				THREE.UVMapping,
		// 				THREE.RepeatWrapping,
		// 				THREE.RepeatWrapping
		// 			)
		// 		}
		// 		normalScale={[0.01, 0.01]}
		// 	/>

		// </Instances>
		<>
			<group position={[0, -7, 8]}>
				{Array.from({ length: gridSize }, (_, i) => (
					// <Once key={i} index={i} />
					<Box
						castShadow
						receiveShadow
						args={[1, 8, 1]}
						position={[
							(i % gridWidth) - gridWidth / 2,
							Math.random() * 4,
							Math.floor(i / gridHeight) - gridHeight / 2,
						]}
					>
						<meshStandardMaterial
							color="#212121"
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
					</Box>
				))}
			</group>
		</>
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
