import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MemoryCard } from './MemoryCard'
import * as THREE from 'three'
import { easing } from 'maath'

import { memoryImages } from '../memories'

// Generate positions for the "memories"
// We'll arrange them in a cylinder around the user
// Collage/Scatter layout settings
const MEMORY_COUNT = 50

const memories = Array.from({ length: MEMORY_COUNT }, (_, i) => {
    // Randomize position "free will"
    // Spread X wide: -15 to 15
    const x = (Math.random() - 0.5) * 30
    // Spread Y tall: -20 to 20 (or more to fit them all without too much overlap)
    const y = (Math.random() - 0.5) * 60
    // Random Z depth: -12 to -8 (around -10)
    const z = -10 + (Math.random() - 0.5) * 4

    // Slight random rotation for "mixed" feel, but mostly facing forward
    const rotation = [
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.1
    ]

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
        // Stop movement when an image is focused
        if (activeId === null) {
            // Apply scroll momentum to Y position
            // Mouse x can still tilt slightly for parallax if desired, or removed.
            // Let's keep a subtle mouse parallax on rotation, but main scroll is Position Y.

            groupRef.current.position.y += scrollSpeed.current * delta * 5 // Speed factor

            // Decay scroll speed
            scrollSpeed.current *= 0.95

            // Optional: localized mouse parallax
            easing.dampE(groupRef.current.rotation, [state.pointer.y * 0.1, state.pointer.x * 0.1, 0], 0.25, delta)
        } else {
            // If active, we might want to center the group on the active item?
            // Or just stop moving.
            // If we stop moving, the item might be off-screen if we scrolled.
            // For "straight center align correctly", we probably want the Active item to be in center.
            // The Active item is at memories[activeId].position.
            // We want (GroupPos + ItemPos) = (0,0,0) (or roughly center screen).
            // So GroupTarget = -ItemPos.

            const activeMem = memories[activeId]
            const targetY = -activeMem.position[1]
            const targetX = -activeMem.position[0]

            easing.damp3(groupRef.current.position, [targetX, targetY, 0], 0.25, delta)
            easing.dampE(groupRef.current.rotation, [0, 0, 0], 0.25, delta)
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
