import { memo, forwardRef, useState, startTransition, useMemo, useContext, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, Center, AccumulativeShadows, RandomizedLight, Environment, useGLTF, CameraControls, Gltf } from '@react-three/drei'
import { EffectComposer, EffectComposerContext, DepthOfField, Bloom } from '@react-three/postprocessing'
import { SSGIEffect, TRAAEffect, MotionBlurEffect, VelocityDepthNormalPass } from 'realism-effects'
import { useControls, button, buttonGroup, folder } from 'leva'

export function RealismEffect({ children }) {
  const { scene, camera, composer } = useContext(EffectComposerContext)

  const options = useControls({
    SSGIEffect: folder(
      // see: https://realism-effects.vercel.app/
      {
        General: folder({
          distance: {
            value: 2.7200000000000104,
            min: 0,
            max: 10
          },
          autoThickness: false,
          thickness: {
            value: 1.2999999999999972,
            min: 0,
            max: 5
          },
          maxRoughness: {
            value: 1,
            min: 0,
            max: 1
          },
          envBlur: {
            value: 0.42,
            min: 0,
            max: 1
          },
          importanceSampling: true,
          maxEnvLuminance: {
            value: 50,
            min: 0,
            max: 100
          }
          // directLightMultiplier: 1
        }),
        'Temporal Resolve': folder({
          blend: {
            value: 0.925,
            min: 0,
            max: 1
          }
        }),
        Denoise: folder({
          denoiseIterations: {
            value: 3,
            min: 0,
            max: 5
          },
          denoiseKernel: {
            value: 3,
            min: 0,
            max: 5
          },
          denoiseDiffuse: {
            value: 40,
            min: 0,
            max: 50
          },
          denoiseSpecular: {
            value: 40,
            min: 0,
            max: 50
          },
          depthPhi: {
            value: 5,
            min: 0,
            max: 15
          },
          normalPhi: {
            value: 28,
            min: 0,
            max: 50
          },
          roughnessPhi: {
            value: 18.75,
            min: 0,
            max: 100
          }
        }),
        Tracing: folder({
          steps: {
            value: 20,
            min: 0,
            max: 256
          },
          refineSteps: {
            value: 4,
            min: 0,
            max: 16
          },
          spp: {
            value: 1,
            min: 0,
            max: 32
          },
          missedRays: false
        }),
        Resolution: folder({
          resolutionScale: {
            value: 1,
            min: 0,
            max: 1
          }
        })
      },
      { collapsed: true }
    )
  })

  const velocityDepthNormalPass = useMemo(() => new VelocityDepthNormalPass(scene, camera), [scene, camera])
  useLayoutEffect(() => {
    composer.addPass(velocityDepthNormalPass)
    return () => {
      composer.removePass(velocityDepthNormalPass)
    }
  }, [velocityDepthNormalPass, composer])

  const ssgiEffect = useMemo(() => new SSGIEffect(scene, camera, velocityDepthNormalPass, options), [scene, camera, velocityDepthNormalPass, options])
  const traaEffect = useMemo(() => new TRAAEffect(scene, camera, velocityDepthNormalPass), [scene, camera, velocityDepthNormalPass])
  const motionBlurEffect = useMemo(() => new MotionBlurEffect(velocityDepthNormalPass), [velocityDepthNormalPass])

  return (
    <>
      <primitive object={ssgiEffect} />
      {/* <primitive object={traaEffect} />
      <primitive object={motionBlurEffect} /> */}
    </>
  )
}