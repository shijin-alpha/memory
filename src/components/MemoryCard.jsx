import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'

export const MemoryCard = ({ url, position, rotation, isActive, setActive, id, ...props }) => {
    const ref = useRef()
    const [hovered, setHover] = useState(false)

    useFrame((state, delta) => {
        // Smoothly scale, colored, etc
        const scale = isActive ? 5 : hovered ? 1.2 : 1
        const grayscale = isActive ? 0 : hovered ? 0 : 0.8

        easing.damp3(ref.current.scale, scale, 0.2, delta)

        if (ref.current.material) {
            easing.damp(ref.current.material, 'grayscale', grayscale, 0.25, delta)
            easing.damp(ref.current.material, 'zoom', 1, 0.25, delta)
        }

        // Active: Move closer to camera target z = -2 (since camera is at 0, looking at -z)
        const targetPos = isActive
            ? [position[0], position[1], -2]
            : position

        // Rotation is always 0 in grid, but keep it flexible
        const targetRot = rotation

        easing.damp3(ref.current.position, targetPos, 0.4, delta)
        easing.dampE(ref.current.rotation, targetRot, 0.4, delta)
    })

    return (
        <group position={position} rotation={rotation} {...props}>
            <Image
                ref={ref}
                url={url}
                transparent
                side={THREE.DoubleSide}
                onPointerOver={() => {
                    setHover(true)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHover(false)
                    document.body.style.cursor = 'auto'
                }}
                onClick={() => {
                    setActive()
                }}
                grayscale={0.8} // Start desaturated
                zoom={1.1} // Start slightly zoomed in
            >
                <planeGeometry args={[1, 1.5]} /> {/* Aspect ratio 2:3 */}
            </Image>
        </group>
    )
}
