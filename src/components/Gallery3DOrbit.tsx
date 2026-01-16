"use client"
import { DeviceOrientationControls, Image, ScrollControls, useScroll } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { GalleryDataItem } from '../types/Gallery'
import { useRouter } from 'next/navigation'

export const Gallery3DOrbit = ({images = []}: {images: GalleryDataItem[]}) => {
  const arrayPreenchido = Array.from({ length: 20 }, (_, i) => {
    return images[i % images.length];
  });
    return (
        <div className="w-full h-full overflow-hidden">
          <div className='opacity-50 pointer-events-none w-full h-full absolute top-0 left-0 z-10 bg-[url(/pattern.jpg)] bg-cover sm:bg-contain bg-center mix-blend-multiply'></div>
           <Canvas camera={{ fov: 10, zoom: 1.5 }}>
            <ScrollControls style={{scrollbarWidth: 'none'}} enabled pages={2} infinite>
                <Rig rotation={[0, 0, 0]}>
                    <Carousel count={arrayPreenchido.length} images={arrayPreenchido}/>
                </Rig>
            </ScrollControls>
            <ambientLight intensity={0.1} />
            <directionalLight />
            <DeviceOrientationControls />
        </Canvas>
        </div>
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

function Carousel({ radius = 1.2, count, images, ...props }:{radius?: number, count: number, images: GalleryDataItem[]}) {
  return (
    <group {...props}>
      {images.map((image, i) => (
        <Card
          key={i}
          url={image.art.url}
          radius={radius}
          angle={(i / count) * Math.PI * 2}
          rotation={[0, 0, -.8]}
          slug={image.slug}
        />
      ))}
    </group>
  )
}

function Card({ url, angle, radius, slug, ...props }:any) {
  const ref = useRef<THREE.Mesh>(null)
  const scroll = useScroll()
  const [hovered, hover] = useState(false)
  
  // Track the current radius for animation. Starts at 0.
  // Using a ref-like object for maath to mutate
  const [data] = useState({ currentRadius: 0 })

  const pointerOver = (e:any) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  const router = useRouter()
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

// Calculate global rotation (same as in Rig but need local access)
        const globalRotation = (-scroll.offset * (Math.PI * 2)) + getAutoRotation(state.clock.elapsedTime)
        
        // Calculate the effective angle of this card in world space
        // angle is the card's position in the carousel (0 to 2PI)
        // globalRotation rotates the whole carousel
        const effectiveAngle = angle + globalRotation
        
        // Calculate "depth" based on cosine of effective angle. 
        // cos(0) = 1 (front), cos(PI) = -1 (back)
        // We want scale to be max at front, min at back
        const depth = Math.cos(effectiveAngle)
        
        // Base scale .5, vary by some factor
        // Range of depth is [-1, 1]
        // Let's say we want scale to go from 0.2 (back) to 0.5 (front)
        // depth -1 -> 0.2
        // depth 1 -> 0.5
        // formula: scale = 0.35 + 0.15 * depth
        const scale = 0.5 + 0.13 * depth

        ref.current.scale.set(scale, scale, scale)

        ref.current.rotation.y = (scroll.offset * (Math.PI * 2)) - getAutoRotation(state.clock.elapsedTime)
    }
  })
  return (
    <Image onClick={() => router.push(`/arte/${slug}`)} ref={ref} url={url} scale={.5} transparent side={THREE.DoubleSide} {...props}/>
  )
}
