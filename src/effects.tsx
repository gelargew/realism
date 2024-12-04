import { Circle } from '@react-three/drei'
import {
	ChromaticAberration,
	DepthOfField,
	EffectComposer,
	GodRays,
	N8AO,
	Noise,
	SSAO,
	Vignette,
} from '@react-three/postprocessing'
import { folder, useControls } from 'leva'
import { BlendFunction } from 'postprocessing'
import { forwardRef, Suspense, useRef, useState } from 'react'
import { Mesh } from 'three'
import { depth } from 'three/webgpu'

const BLENDS = BlendFunction

export const CustomEffects = () => {
	const {
		aoRadius,
		distanceFalloff,
		intensity,
		screenSpaceRadius,
		halfRes,
		focalLength,
		focusDistance,
		bokehScale,
		cOffset,
		eskil,
		vOffset,
		darkness,
	} = useControls({
		ambientOcclusion: folder({
			aoRadius: { value: 500, min: 0, max: 1000 },
			distanceFalloff: { value: 0.2, min: 0, max: 1 },
			intensity: { value: 6, min: 0, max: 10 },
			screenSpaceRadius: true,
			halfRes: true,
		}),
		depthOfField: folder({
			focusDistance: { value: 0, min: 0, max: 1 },
			focalLength: { value: 0.02, min: 0, max: 1 },
			bokehScale: { value: 2, min: 0, max: 10 },
		}),
		chromaticAberation: folder({
			cOffset: {
				value: {
					x: 0.001,
					y: 0.001,
				},
				step: 0.001,
			},
		}),
		vignette: folder({
			eskil: false,
			vOffset: { value: 0.5, min: 0, max: 1 },
			darkness: { value: 1, min: 0, max: 1 },
		}),
	})
	return (
		<Suspense fallback={null}>
			<EffectComposer enableNormalPass>
				<N8AO
					aoRadius={aoRadius}
					distanceFalloff={distanceFalloff}
					intensity={intensity}
					screenSpaceRadius={screenSpaceRadius}
					halfRes={halfRes}
				/>
				<DepthOfField
					focalLength={focalLength}
					focusDistance={focusDistance}
					bokehScale={bokehScale}
				/>
				<ChromaticAberration
					offset={cOffset} // color offset
				/>
				<Noise
					premultiply // enables or disables noise premultiplication
					blendFunction={BlendFunction.ADD}
				/>
				<Vignette
					eskil={eskil}
					offset={vOffset}
					darkness={darkness}
				/>
				<SSAO
					blendFunction={BlendFunction.MULTIPLY} // blend mode
					samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
					rings={4} // amount of rings in the occlusion sampling pattern
					distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
					distanceFalloff={0.0} // distance falloff. min: 0, max: 1
					rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
					rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
					luminanceInfluence={0.9} // how much the luminance of the scene influences the ambient occlusion
					radius={20} // occlusion sampling radius
					bias={0.5} // occlusion bias
				/>
			</EffectComposer>
		</Suspense>
	)
}

const Sun = forwardRef(function Sun(props, forwardRef) {
	const { value: sunColor } = useControls('sun color', {
		value: '#FF0000',
	})

	return (
		<Circle
			args={[10, 10]}
			ref={forwardRef}
			position={[0, 0, -16]}
			{...props}
		>
			<meshBasicMaterial color={sunColor} />
		</Circle>
	)
})
