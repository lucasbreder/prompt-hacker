"use client"
import { ScrollControls, useScroll, Float, useTexture, Environment, Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { easing } from 'maath'
import { GalleryDataItem } from '../types/Gallery'

export const Gallery3DOrbs = ({images = []}: {images: GalleryDataItem[]}) => {
  const totalItems = 30;
  const arrayPreenchido = Array.from({ length: totalItems }, (_, i) => {
    return images[i % images.length];
  });

  const orbImages = useMemo(() => {
     if(images.length === 0) return []
     return arrayPreenchido
  }, [images])

    return (
        <div className="w-full h-full overflow-hidden bg-black">
           <Canvas camera={{ position: [0, 0, 20], fov: 35 }} gl={{ antialias: true }}>
            {/* Fog para profundidade escura */}
            <fog attach="fog" args={['#000000', 10, 35]} />
            
            {/* Ambiente para reflexos nas esferas (estilo estúdio) */}
            <Environment preset="city" />
            
            {/* Estrelas ao fundo para compor o cenário espacial */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <ScrollControls style={{scrollbarWidth: 'none'}} pages={4} damping={0.2}>
                <OrbScene images={orbImages} />
            </ScrollControls>
            
            <ambientLight intensity={0.2} />
        </Canvas>
        </div>
    )
}

function OrbScene({ images }: { images: GalleryDataItem[] }) {
    const scroll = useScroll()
    const groupRef = useRef<THREE.Group>(null)

    // Distribuição aleatória no espaço
    const positions = useMemo(() => {
        return images.map(() => ({
            x: (Math.random() - 0.5) * 15, 
            y: (Math.random() - 0.5) * 30, // Espalhado verticalmente para scroll
            z: (Math.random() - 0.5) * 15,
            scale: 1 + Math.random() * 1.5, // Variação de tamanho das esferas
        }))
    }, [images])

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Movimento vertical baseado no scroll
            const yOffset = scroll.offset * 30
            easing.damp3(groupRef.current.position, [0, yOffset, 0], 0.5, delta)
            
            // Rotação suave do grupo inteiro para dinamismo
            groupRef.current.rotation.y += delta * 0.05
        }
    })

    return (
        <group ref={groupRef} position={[0, -10, 0]}>
            {images.map((img, i) => (
                <Orb 
                    key={i}
                    url={img.art.url}
                    slug={img.slug}
                    position={[positions[i].x, positions[i].y, positions[i].z]}
                    baseScale={positions[i].scale}
                />
            ))}
        </group>
    )
}

function Orb({ url, slug, position, baseScale, ...props }: any) {
  const ref = useRef<THREE.Mesh>(null)
  const router = useRouter()
  const [hovered, hover] = useState(false)
  
  // Carrega a textura da imagem
  const texture = useTexture(url)

  useFrame((state, delta) => {
    if(!ref.current) return

    // 1. Animação de Hover (Escala)
    const targetScale = hovered ? baseScale * 1.3 : baseScale
    easing.damp(ref.current.scale, 'x', targetScale, 0.3, delta)
    easing.damp(ref.current.scale, 'y', targetScale, 0.3, delta)
    easing.damp(ref.current.scale, 'z', targetScale, 0.3, delta)
    
    // 2. Rotação Constante (Planeta girando)
    // Se estiver em hover, gira mais rápido
    const rotationSpeed = hovered ? 0.8 : 0.2
    ref.current.rotation.y += delta * rotationSpeed
    ref.current.rotation.x += delta * (rotationSpeed * 0.5)
  })

  return (
    <Float 
        speed={1.5} 
        rotationIntensity={1} 
        floatIntensity={2} 
        position={position}
    >
        <mesh 
            ref={ref}
            onClick={() => router.push(`/arte/${slug}`)}
            onPointerOver={(e) => { e.stopPropagation(); hover(true); document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { hover(false); document.body.style.cursor = 'auto' }}
            {...props}
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
  )
}