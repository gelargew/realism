import { Leva } from 'leva'
import Scene from './scene'
import SceneBall from './scene2'
import SceneLambert from './lambert/lambert'
import { Suspense } from 'react'

export default function Page() {
    return (
        <>
 <Leva />
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    position: 'relative',
                    zIndex: 1
                }}
            >

                <Suspense fallback={null}>
                    {/* // <Scene /> */}
                    {/* <SceneBall /> */}



                    <SceneLambert />
                </Suspense>
            </div>
        </>
    )
}
