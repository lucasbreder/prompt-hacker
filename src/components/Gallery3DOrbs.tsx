"use client"
import { ScrollControls, useScroll, Float, useTexture, Environment, useProgress } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { easing } from 'maath'
import { GalleryDataItem } from '../types/Gallery'

export const Gallery3DOrbs = ({images = []}: {images: GalleryDataItem[]}) => {
  const { active } = useProgress()
  const totalItems = 30;
  const arrayPreenchido = Array.from({ length: totalItems }, (_, i) => {
    return images[i % images.length];
  });

  const orbImages = useMemo(() => {
     if(images.length === 0) return []
     return arrayPreenchido
  }, [images])

  // Refs de estado de Y para o scroll customizado (sem bugs de limite Drei)
  const sharedYOffset = useRef(0);
  const targetYOffset = useRef(0);

  // Interceptador global do mouse wheel sobre a galeria
  const handleWheel = (e: React.WheelEvent) => {
     // Movimenta o alvo inversamente do delta nativo para rolar para baixo carregar mais para cimax
     targetYOffset.current += e.deltaY * 0.02; 
  }

    return (
        <div className="w-full h-full overflow-hidden bg-black" onWheel={handleWheel}>
           <Canvas camera={{ position: [0, 0, 20], fov: 35 }} gl={{ antialias: true }}>
            {/* Fog para profundidade escura */}
            <fog attach="fog" args={['#000000', 10, 35]} />
            
            {/* Ambiente para reflexos nas esferas (estilo estúdio) */}
            <Environment preset="city" />
            
            <OrbScene images={orbImages} sharedYOffset={sharedYOffset} targetYOffset={targetYOffset} />
            
            <ambientLight intensity={0.2} />
        </Canvas>
       {active &&  <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <span className="loader"></span>
        </div>}
        </div>
    )
}

function OrbScene({ images, sharedYOffset, targetYOffset }: { images: GalleryDataItem[], sharedYOffset: any, targetYOffset: any }) {
    const groupRef = useRef<THREE.Group>(null)
    const HEIGHT = 60; // Altura total para distribuição e loop das esferas

    // Distribuição inicial aleatória
    const positions = useMemo(() => {
        return images.map(() => ({
            x: (Math.random() - 0.5) * 15, 
            y: (Math.random() - 0.5) * HEIGHT, 
            z: (Math.random() - 0.5) * 15,
            scale: 1 + Math.random() * 1.2, 
        }))
    }, [images])

    // Math object state for dampening scroll offset
    const dampState = useRef({ y: 0 })

    useFrame((state, delta) => {
        // Suaviza a transição do scroll roda do mouse!
        easing.damp(dampState.current, 'y', targetYOffset.current, 0.4, delta);
        sharedYOffset.current = dampState.current.y;

        if (groupRef.current) {
            // Rotação suave do grupo inteiro para dinamismo
            groupRef.current.rotation.y += delta * 0.05
        }
    })

    return (
        <group ref={groupRef}>
            {images.map((img, i) => (
                <Orb 
                    key={i}
                    url={img.art.url}
                    slug={img.slug}
                    initialPosition={[positions[i].x, positions[i].y, positions[i].z]}
                    baseScale={positions[i].scale}
                    height={HEIGHT}
                    sharedYOffset={sharedYOffset}
                />
            ))}
        </group>
    )
}

function Orb({ url, slug, initialPosition, baseScale, height, sharedYOffset, ...props }: any) {
  const ref = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const router = useRouter()
  const [hovered, hover] = useState(false)
  
  // Carrega a textura da imagem
  const texture = useTexture(url)

  useFrame((state, delta) => {
    if(!ref.current || !meshRef.current) return

    // Utiliza o Y suave deslocado (Scroll infinito puro numérico!)
    const yOffset = sharedYOffset.current;
    const initialY = initialPosition[1]
    
    // Mantém a esfera de volta no final do grupo (wrap) super seguro
    // Sem % maliciosos sobre decimais curtos de offset
    const halfHeight = height / 2;
    const wrappedY = ((initialY + yOffset + halfHeight) % height + height) % height - halfHeight;
    
    ref.current.position.set(initialPosition[0], wrappedY, initialPosition[2])

    // 1. Animação de Hover (Escala). O easing é aplicado ao mesh interno.
    const targetScale = hovered ? baseScale * 1.3 : baseScale
    easing.damp3(meshRef.current.scale, [targetScale, targetScale, targetScale], 0.3, delta)
    
    // 2. Rotação Constante (Planeta girando)
    const rotationSpeed = hovered ? 0.8 : 0.2
    meshRef.current.rotation.y += delta * rotationSpeed
    meshRef.current.rotation.x += delta * (rotationSpeed * 0.5)
  })

  return (
    <group ref={ref} {...props}>
        <Float 
            speed={1.5} 
            rotationIntensity={1} 
            floatIntensity={2} 
        >
            <mesh 
                ref={meshRef}
                onClick={() => router.push(`/arte/${slug}`)}
                onPointerOver={(e) => { e.stopPropagation(); hover(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { hover(false); document.body.style.cursor = 'default' }}
            >
                {/* Geometria Esférica */}
                <sphereGeometry args={[1, 64, 64]} />
                
                {/* Material Físico para aparência de "Bola de Gude" ou Planeta */}
                <meshStandardMaterial 
                    map={texture as any} 
                    roughness={0.2} // Pouca rugosidade para brilhar
                    metalness={0.1} 
                    envMapIntensity={1} // Intensidade do reflexo do ambiente
                />
            </mesh>
        </Float>
    </group>
  )
}