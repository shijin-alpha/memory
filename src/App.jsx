import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Sparkles } from '@react-three/drei'
// import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Experience } from './components/Experience'

function App() {
    return (
        <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
            <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
                <fog attach="fog" args={['#111', 5, 20]} />
                <ambientLight intensity={0.5} />

                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <Sparkles count={100} scale={12} size={4} speed={0.4} opacity={0.5} color="#fff" />
                    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Experience />
                    </Float>
                    {/* <EffectComposer>
                        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={0.5} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer> */}
                </Suspense>

                <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
            </Canvas>

            {/* UI Overlay */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                textAlign: 'center',
                color: 'white',
                mixBlendMode: 'difference'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '100',
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    margin: 0,
                    opacity: 0.8
                }}>
                    Memories
                </h1>
                <p style={{
                    fontSize: '1rem',
                    letterSpacing: '0.2em',
                    opacity: 0.6,
                    marginTop: '1rem'
                }}>
                    Explore the moments
                </p>
            </div>
        </div>
    )
}

export default App
