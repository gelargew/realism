// Original concept by Tom Bogner @dastom on Dribble: https://dribbble.com/shots/6767548-The-Three-Graces-Concept

import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import {
    useGLTF,
    SoftShadows,
    Html,
    CameraControls,
    Torus,
    TorusKnot,
    Instance,
    Instances,
    Box,
} from '@react-three/drei'
import { easing, geometry } from 'maath'
import { folder, useControls } from 'leva'
import * as THREE from 'three'

extend(geometry)

export default function SceneLambert() {
    const {
        showModel,
        color,
        pos1,
        intensity1,
        color1,
        pos2,
        intensity2,
        color2,
        near,
        far,
        fogColor,
        sColor,
        sIntensity,
        penumbra,
        angle,
        decay,
        distance,
    } = useControls({
        showModel: true,
        color: '#444',
        spotlight: folder({
            sColor: '#ffffff',
            sIntensity: 40,
            penumbra: 0.5,
            angle: 0.5,
            decay: 1,
            distance: 50,
        }),
        pointLight1: folder({
            pos1: {
                x: -5,
                y: 5,
                z: 5,
            },
            intensity1: 40,
            color1: '#ffffff',
        }),
        pointLight2: folder({
            pos2: {
                x: 5,
                y: 5,
                z: -5,
            },
            intensity2: 40,
            color2: '#ffffff',
        }),
        fog: folder({
            near: 0,
            far: 55,
            fogColor: '#000000',
        }),
    })

    return (
        <Canvas
            shadows='basic'
            eventPrefix='client'
            camera={{ position: [4, 8, 8], fov: 33, far: 120 }}
        >
            {/* <ambientLight intensity={2} /> */}
            <fog attach='fog' args={[fogColor, near, far]} />
            <pointLight
                position={[pos1.x, pos1.y, pos1.z]}
                intensity={intensity1}
                color={color1}
                power={20}
            />
            <pointLight
                position={[pos2.x, pos2.y, pos2.z]}
                intensity={intensity2}
                color={color2}
            />
            {/* {torus && (
                <TorusKnot receiveShadow castShadow>
                    <meshLambertMaterial transparent color={'#ffcc00'} />
                </TorusKnot>
            )} */}

            <Boxes color={color} />
            {showModel && (
                <Suspense fallback={null}>
                    <Model position={[0, -5.5, 3]} rotation={[0, -0.2, 0]} />
                </Suspense>
            )}

            <Light
                color={sColor}
                intensity={sIntensity}
                {...{ penumbra, angle, decay, distance }}
            />
            <SoftShadows samples={3} />
            <CameraControls
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                minAzimuthAngle={-Math.PI / 2}
                maxAzimuthAngle={Math.PI / 2}
            />
        </Canvas>
    )
}

/*
Auto-generated by: https://github.com/react-spring/gltfjsx
Author: 3DLadnik (https://sketchfab.com/3DLadnik)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/3d-printable-the-three-graces-58e0ae19e2984b86883edc41bf43415a
Title: 3D Printable The Three Graces
*/
function Model(props) {
    const group = useRef()
    const light = useRef()
    const { nodes } = useGLTF('/graces-draco.glb')
    useFrame((state, delta) => {
        easing.dampE(
            group.current.rotation,
            [0, -state.pointer.x * (Math.PI / 10), 0],
            1.5,
            delta,
        )
        easing.damp3(
            group.current.position,
            [0, -5.5, 1 - Math.abs(state.pointer.x)],
            1,
            delta,
        )
        // easing.damp3(
        //     light.current.position,
        //     [state.pointer.x * 12, 0, 8 + state.pointer.y * 4],
        //     0.2,
        //     delta,
        // )
    })
    return (
        <group ref={group} {...props}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Node_3.geometry}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={0.2}
                dispose={null}
            >
                <meshLambertMaterial color='#404044' />
            </mesh>
        </group>
    )
}
const Light = (props: any) => {
    const light = useRef()
    useFrame((state, delta) => {
        // easing.dampE(group.current.rotation, [0, -state.pointer.x * (Math.PI / 10), 0], 1.5, delta)
        // easing.damp3(group.current.position, [0, -5.5, 1 - Math.abs(state.pointer.x)], 1, delta)
        easing.damp3(
            light.current.position,
            [state.pointer.x * 12, 3, 8 + state.pointer.y * 4],
            0.2,
            delta,
        )
    })
    return (
        <group>
            <spotLight
                angle={0.5}
                penumbra={0.5}
                ref={light}
                castShadow
                intensity={44}
                shadow-mapSize={1024}
                shadow-bias={-0.001}
                {...props}
            >
                <orthographicCamera
                    attach='shadow-camera'
                    args={[-10, 10, -10, 10, 0.1, 50]}
                />
            </spotLight>
        </group>
    )
}

function Annotation({ children, ...props }) {
    return (
        <Html {...props} transform occlude='blending'>
            <div className='annotation' onClick={() => console.log('.')}>
                {children}
            </div>
        </Html>
    )
}

const gridWidth = 44
const gridHeight = 44
const gridSize = gridWidth * gridHeight
const Boxes = ({ color = '#444' }) => {
    const ref = useRef<any>()
    const pointerPosition = useRef(new THREE.Vector3(0, 0, 0))
    const smooth = useRef(new THREE.Vector3(0, 0, 0))

    useFrame(() => {
        smooth.current.lerp(pointerPosition.current, 0.1)
    })

    return (
        <Instances
            ref={ref}
            onPointerMove={e => {
                pointerPosition.current.set(e.point.x, e.point.y, e.point.z + 4)
            }}
            receiveShadow
            castShadow
            position={[0, -7, 0]}
        >
            <boxGeometry args={[1, 8, 1]} />
            <meshLambertMaterial color={color} />
            {Array.from({ length: gridSize }, (_, i) => (
                <Once key={i} index={i} pointerPosition={smooth.current} />
            ))}
        </Instances>
    )
}

const Once = ({
    index,
    pointerPosition,
}: {
    index: number
    pointerPosition: THREE.Vector3
}) => {
    const ref = useRef<any>()

    // Individualized parameters for each box
    const boxParams = useMemo(
        () => ({
            initialY: Math.random() * 2,
            animationRange: 0.5 + Math.random() * 0.5, // Vary between 0.5 and 1
            animationSpeed: 0.5 + Math.random(), // Vary between 0.5 and 1.5
            frequencyOffset: Math.random() * Math.PI * 2, // Random phase offset
        }),
        [],
    )

    useFrame(state => {
        if (!ref.current) return

        const t = state.clock.getElapsedTime()

        // Calculate distance from pointer
        const boxPosition = ref.current.position
        const distanceToPointer = Math.sqrt(
            Math.pow(boxPosition.x - pointerPosition.x, 2) +
                Math.pow(boxPosition.z - pointerPosition.z, 2),
        )

        // Calculate proximity factor (closer to 1 when near pointer, 0 when far)
        const proximityFactor = Math.max(0, 1 - distanceToPointer / 5)

        // Reduce animation range and lower height near pointer
        const animationReductionFactor = 1 - proximityFactor * 0.9
        const heightReductionFactor = 1 - proximityFactor

        // Create vertical offset with reduced range near pointer
        const verticalOffset =
            Math.sin(t * boxParams.animationSpeed + boxParams.frequencyOffset) *
            boxParams.animationRange *
            animationReductionFactor

        // Calculate final y position
        const finalY =
            boxParams.initialY +
            verticalOffset +
            heightReductionFactor * boxParams.initialY * 0.9

        // Update y position
        ref.current.position.y = finalY

        // // Color interpolation (from dark gray to white)
        // const whiteColor = new THREE.Color(1, 1, 1)
        // const interpolatedColor = boxParams.baseColor.clone().lerp(whiteColor, proximityFactor * 0.8)

        // // Update instance color
        // ref.current.color.copy(interpolatedColor)
    })

    return (
        <Instance
            onClick={e => console.log(e.object.position, pointerPosition)}
            ref={ref}
            key={index}
            scale={1}
            castShadow
            receiveShadow
            color={'#fff'}
            position={[
                (index % gridWidth) - gridWidth / 2,
                boxParams.initialY,
                Math.floor(index / gridHeight) - gridHeight / 4,
            ]}
        />
    )
}
