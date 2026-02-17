import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MemoryCard } from './MemoryCard'
import * as THREE from 'three'
import { easing } from 'maath'

import { memoryImages } from '../memories'

// Generate positions for the "memories"
// We'll arrange them in a cylinder around the user
const MEMORY_COUNT = 50
const RADIUS = 8
const HEIGHT = 10

const memories = Array.from({ length: MEMORY_COUNT }, (_, i) => {
    const theta = (Math.PI * 2 * i) / MEMORY_COUNT
    const x = RADIUS * Math.cos(theta)
    const z = RADIUS * Math.sin(theta)
    // Randomize height a bit, but keep it within bounds
    const y = (Math.random() - 0.5) * HEIGHT * 2
    // Look at center (Face inwards)
    const rotation = [0, -theta - Math.PI / 2, 0]

    // Cycle through the user's images
    const url = memoryImages[i % memoryImages.length] || `https://picsum.photos/seed/${i}/400/600`

    return { position: [x, y, z], rotation, url, id: i }
})

export const Experience = () => {
    const groupRef = useRef()
    const [activeId, setActive] = useState(null)
    const { gl } = useThree()
    const scrollSpeed = useRef(0)

    useEffect(() => {
        const handleWheel = (e) => {
            // Adjust rotation speed based on scroll
            scrollSpeed.current += e.deltaY * 0.0005
        }

        gl.domElement.addEventListener('wheel', handleWheel)
        return () => gl.domElement.removeEventListener('wheel', handleWheel)
    }, [gl])

    useFrame((state, delta) => {
        // Stop rotation when an image is focused
        if (!activeId) {
            // Apply scroll momentum
            // Base rotation + Scroll momentum + Mouse influence (parallax)
            // Mouse x is -1 to 1. We'll add a subtle push based on where the mouse is.
            groupRef.current.rotation.y += delta * 0.02 + scrollSpeed.current + (state.pointer.x * delta * 0.1)

            // Decay scroll speed (friction)
            // 0.98 is much smoother/heavier than 0.95
            scrollSpeed.current *= 0.98
        } else {
            easing.damp(groupRef.current.rotation, 'y', groupRef.current.rotation.y, 0.25, delta)
        }
    })

    return (
        <group ref={groupRef}>
            {memories.map((mem, index) => (
                <MemoryCard
                    key={index}
                    {...mem}
                    isActive={activeId === index}
                    setActive={() => setActive(activeId === index ? null : index)}
                />
            ))}
        </group>
    )
}
