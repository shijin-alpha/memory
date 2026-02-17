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

        // Active: Move closer to center (same angle), Height 0, Rotate to face center
        // Original radius ~8. Target radius ~4? Or maybe closer ~2 for "in your face".
        // We divide x/z by 4 to bring it to radius 2.
        const targetPos = isActive
            ? [position[0] / 3, 0, position[2] / 3] // Pull to radius ~2.5, Height 0
            : position

        // If active, look at center (which is where camera is)
        // Original rotation matches this largely, but let's ensure it.
        const targetRot = isActive ? rotation : rotation

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
