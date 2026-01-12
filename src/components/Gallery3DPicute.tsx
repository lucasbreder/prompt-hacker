// https://cydstumpel.nl/
"use client"
import { DeviceOrientationControls, Image, ScrollControls, useScroll } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export const Gallery3DPicute = () => {
    return (
         <Canvas style={{overflow: 'hidden'}} camera={{ fov: 10, zoom: 1.5 }}>
            <ScrollControls pages={4} infinite>
                <Rig rotation={[0, 0, 0]}>
                    <Carousel rotation={[0, 0, 0]}/>
                </Rig>
            </ScrollControls>
            <ambientLight intensity={0.1} />
            <directionalLight />
            <DeviceOrientationControls />
        </Canvas>
    )
}
// Helper to calculate auto-rotation with initial fast spin that decays
const getAutoRotation = (t: number) => {
    // Constant speed component
    const constant = t * 0.1
    // Fast initial spin component: starts fast, decays over time
    // 5 is the boost amount, 0.5 is decay rate
    const boost = 5 * (1 - Math.exp(-t * 0.5))
    return constant + boost
}


function Rig(props:any) {
    const ref = useRef<THREE.Group>(null)
    const scroll = useScroll()
   useFrame((state:any, delta:any) => {
   if(ref.current){
        // Adds a light automatic rotation (state.clock.elapsedTime * 0.1) combined with scroll interaction
        ref.current.rotation.y = (-scroll.offset * (Math.PI * 2)) + getAutoRotation(state.clock.elapsedTime) // Rotate contents
        state.events.update() // Raycasts every frame rather than on pointer-move
        easing.damp(state.camera, 'zoom', 1, 2, delta) // Zoom out from 1.5 (set initially)
        state.camera.updateProjectionMatrix()
        
        easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 8, 16], 0.3, delta) // Move camera
        state.camera.lookAt(0, 0, 0) // Look at center
        state.camera.rotation.z = -0.8
   }
  })
  return <group ref={ref} {...props} />
}

function Carousel({ radius = 1.2, count = 20, ...props }:any) {
  return (
    <group {...props}>
      {Array.from({ length: count }, (_, i) => (
        <Card
          key={i}
          url={`https://res.cloudinary.com/ddjuftfy2/image/upload/f_webp,c_fill,q_auto/memphis/large/bba3f01c0f7468ee9e643f7b56786360.jpg`}
          radius={radius}
          angle={(i / count) * Math.PI * 2}
          rotation={[0, 0, -.8]}
        />
      ))}
    </group>
  )
}

function Card({ url, angle, radius, ...props }:any) {
  const ref = useRef<THREE.Mesh>(null)
  const scroll = useScroll()
  const [hovered, hover] = useState(false)
  
  // Track the current radius for animation. Starts at 0.
  // Using a ref-like object for maath to mutate
  const [data] = useState({ currentRadius: 0 })

  const pointerOver = (e:any) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  useFrame((state:any, delta:any) => {
    if(ref.current){
        // Animate radius from 0 to target (radius prop) smoothly over ~2 seconds
        easing.damp(data, 'currentRadius', radius, .5, delta) 

        // Update position based on animated radius and angle
        ref.current.position.set(
            Math.sin(angle) * data.currentRadius,
            0,
            Math.cos(angle) * data.currentRadius
        )

        ref.current.rotation.y = (scroll.offset * (Math.PI * 2)) - getAutoRotation(state.clock.elapsedTime)
    }
  })
  return (
    <Image ref={ref} url={url} scale={.5} transparent side={THREE.DoubleSide} {...props}/>
  )
}
