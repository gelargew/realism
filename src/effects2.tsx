import { useThree, useFrame } from '@react-three/fiber'
import { EffectComposer, RenderPass, EffectPass, FXAAEffect, ToneMappingEffect } from 'postprocessing'
import { useEffect, useState } from 'react'
import { SSGIEffect, VelocityDepthNormalPass } from './ssgi'
import { folder, useControls } from 'leva'

export function Effects2() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const [composer] = useState(() => new EffectComposer(gl, { multisampling: 0 }))
  const {
    steps,
    refineSteps,
    spp,
    resolutionScale,
    missedRays,
    distance,
    thickness,
    denoiseIterations,
    denoiseKernel,
    denoiseDiffuse,
    denoiseSpecular,
    radius,
    phi,
    lumaPhi,
    depthPhi,
    normalPhi,
    roughnessPhi,
    specularPhi,
    envBlur
  } = useControls({
    SSGI: folder({
      steps: 20,
      refineSteps: 4,
      spp: 1,
      resolutionScale: 1,
      missedRays: false,
      distance: 5.98,
      thickness: 2.83,
      denoiseIterations: 4,
      denoiseKernel: 7,
      denoiseDiffuse: 25,
      denoiseSpecular: 25.54,
      radius: 8,
      phi: 0.576,
      lumaPhi: 20.652,
      depthPhi: 23.37,
      normalPhi: 26.087,
      roughnessPhi: 18.478,
      specularPhi: 7.1,
      envBlur: 0.8
    })
  })

  useEffect(() => composer.setSize(size.width, size.height), [composer, size])
  useEffect(() => {
    const config = {
      importanceSampling: true,
      steps,
      refineSteps,
      spp,
      resolutionScale,
      missedRays,
      distance,
      thickness,
      denoiseIterations,
      denoiseKernel,
      denoiseDiffuse,
      denoiseSpecular,
      radius,
      phi,
      lumaPhi,
      depthPhi,
      normalPhi,
      roughnessPhi,
      specularPhi,
      envBlur
    }

    const renderPass = new RenderPass(scene, camera)
    const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)
    composer.addPass(renderPass)
    composer.addPass(velocityDepthNormalPass)
    composer.addPass(new EffectPass(camera, new SSGIEffect(composer, scene, camera, { ...config, velocityDepthNormalPass })))
    composer.addPass(new EffectPass(camera, new FXAAEffect(), new ToneMappingEffect()))

    return () => {
      composer.removeAllPasses()
    }
  }, [composer, camera, scene, steps, refineSteps, spp, resolutionScale, missedRays, distance, thickness, denoiseIterations, denoiseKernel, denoiseDiffuse, denoiseSpecular, radius, phi, lumaPhi, depthPhi, normalPhi, roughnessPhi, specularPhi, envBlur])

  useFrame((state, delta) => {
    gl.autoClear = true
    composer.render(delta)
  }, 1)
}
