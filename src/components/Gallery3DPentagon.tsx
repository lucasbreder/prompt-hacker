"use client"
import { DeviceOrientationControls, Image, ScrollControls, useScroll, useProgress } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { GalleryDataItem } from '../types/Gallery'

export const Gallery3DPentagon = ({images = []}: {images: GalleryDataItem[]}) => {
  const { active } = useProgress()
  const arrayPreenchido = Array.from({ length: 20 }, (_, i) => {
    return images[i % images.length];
  });

  const pentagonImages = useMemo(() => {
     if(images.length === 0) return []
     const shuffled = [...arrayPreenchido].sort(() => 0.5 - Math.random());
     return shuffled.slice(0, 5); 
  }, [images])

    return (
        <div className="w-full h-full overflow-hidden">
          <div className='opacity-50 pointer-events-none w-full h-full absolute top-0 left-0 z-10 bg-[url(/pattern.jpg)] bg-cover sm:bg-contain bg-center mix-blend-multiply'></div>
           <Canvas camera={{ position: [0, 0, 10], fov: 15 }}> 
            <ScrollControls style={{scrollbarWidth: 'none'}} enabled pages={4} infinite>
                <Rig>
                    <Carousel radius={.5} count={pentagonImages.length} images={pentagonImages}/>
                </Rig>
            </ScrollControls>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 5]} />
        </Canvas>
         {active &&  <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <span className="loader"></span>
        </div>}
        </div>
    )
}

// Rotação automática
const getAutoRotation = (t: number) => {
    return t * 0.1
}

function Rig({ children, ...props }: any) {
    const ref = useRef<THREE.Group>(null)
    const scroll = useScroll()
    
    useFrame((state, delta) => {
        if(ref.current && state.events.update){
            // ROTAÇÃO NO EIXO Z (Gira a roda inteira)
            const rotationZ = (-scroll.offset * (Math.PI * 2)) - getAutoRotation(state.clock.elapsedTime)
            ref.current.rotation.z = rotationZ

            state.events.update()
            
            easing.damp3(state.camera.position, [0, 0, 12], 0.3, delta)
            state.camera.lookAt(0, 0, 0)
        }
    })
    return <group ref={ref} {...props}>{children}</group>
}

function Carousel({ radius = 1.3, count, images, ...props }:{radius?: number, count: number, images: GalleryDataItem[]}) {
  return (
    <group {...props}>
      {images.map((image, i) => (
        <Card
          key={i}
          url={image.art.url}
          radius={radius}
          angle={(i / count) * Math.PI * 2}
          slug={image.slug}
        />
      ))}
    </group>
  )
}

function Card({ url, angle, radius, slug, ...props }:any) {
  const ref = useRef<THREE.Mesh>(null)
  // const scroll = useScroll() // Não precisamos mais do scroll aqui
  const router = useRouter()
  
  const [data] = useState({ currentRadius: 0 })

  useFrame((state, delta) => {
    if(ref.current){
        // Anima o raio abrindo
        easing.damp(data, 'currentRadius', radius, 0.5, delta) 
          easing.damp(ref.current.material, 'radius', 0.05, delta)
        // POSICIONAMENTO APENAS EM X E Y
        ref.current.position.set(
            Math.cos(angle) * data.currentRadius,
            Math.sin(angle) * data.currentRadius,
            0
        )

        // --- MUDANÇA AQUI ---
        // Removemos o cálculo de rotação dinâmica (globalRotation) que existia aqui.
        // A rotação agora é estática e passada via props no componente Image abaixo.
      
    }
  })

  // Calcula a rotação fixa necessária para que o topo aponte para o centro
  // É o ângulo da posição + 90 graus (PI/2)
  const rotationZBase = angle + (Math.PI / 2);

  return (
    <Image 
        ref={ref} 
        url={url} 
        scale={[0.4, 0.4]} 
        // --- MUDANÇA AQUI ---
        // Aplicamos a rotação estática no eixo Z.
        // Como este componente está dentro do "Rig", ele girará junto com a roda,
        // mantendo essa orientação relativa ao centro.
        rotation={[0, 0, rotationZBase]}
        transparent 
        side={THREE.DoubleSide} 
        onClick={() => router.push(`/arte/${slug}`)}
        onPointerOver={(e) => {document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
        {...props}
    />
  )
}