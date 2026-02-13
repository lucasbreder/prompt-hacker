"use client"
import { Image, ScrollControls, useScroll, Float } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { easing } from 'maath'
import { GalleryDataItem } from '../types/Gallery'

export const Gallery3DFloat = ({images = []}: {images: GalleryDataItem[]}) => {
  // Aumentamos a quantidade de itens repetindo o array para criar uma nuvem densa
  const totalItems = 40;
  const arrayPreenchido = Array.from({ length: totalItems }, (_, i) => {
    return images[i % images.length];
  });

  const cloudImages = useMemo(() => {
     if(images.length === 0) return []
     return arrayPreenchido
  }, [images])

    return (
        <div className="w-full h-full overflow-hidden bg-[#101010]">
          {/* Fundo escuro para destacar a profundidade */}
          <div className='opacity-20 pointer-events-none w-full h-full absolute top-0 left-0 z-10 bg-[url(/pattern.jpg)] bg-cover sm:bg-contain bg-center mix-blend-overlay'></div>
          
           <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            {/* Adiciona fog para que as imagens muito ao fundo desapareçam suavemente */}
            <fog attach="fog" args={['#101010', 5, 25]} />
            
            <ScrollControls style={{scrollbarWidth: 'none'}} pages={2} damping={0.2}>
                <CloudScene images={cloudImages} />
            </ScrollControls>
            
            <ambientLight intensity={1} />
        </Canvas>
        </div>
    )
}

function CloudScene({ images }: { images: GalleryDataItem[] }) {
    const scroll = useScroll()
    const groupRef = useRef<THREE.Group>(null)

    // Pré-calcula posições aleatórias para evitar recálculos a cada render
    // x: horizontal, y: vertical (altura da nuvem), z: profundidade
    const positions = useMemo(() => {
        return images.map(() => ({
            x: (Math.random() - 0.5) * 12,   // Espalha largura (-6 a 6)
            y: (Math.random() - 0.5) * 30,   // Espalha altura (-15 a 15) - área de scroll
            z: (Math.random() - 0.5) * 10,   // Espalha profundidade (-5 a 5)
            scale: 1 + Math.random() * 1.1,  // Variação sutil de tamanho base
            rotation: (Math.random() - 0.5) * 0.3 // Leve rotação inicial
        }))
    }, [images])

    useFrame((state, delta) => {
        if (groupRef.current) {
            // O Scroll move a nuvem inteira no eixo Y
            // O range vai de positivo (topo) a negativo (fundo)
            const yOffset = scroll.offset * 25 // 25 é a altura navegável
            
            // Movemos o grupo para cima conforme o scroll desce
            easing.damp3(groupRef.current.position, [0, yOffset, 0], 0.5, delta)
            
            // Efeito de Parallax do Mouse: move a câmera levemente baseada no mouse
            // Isso aumenta a sensação de profundidade 3D
            easing.damp3(state.camera.position, [state.pointer.x * 2, state.pointer.y * 2, 15], 0.3, delta)
            state.camera.lookAt(0, 0, 0)
        }
    })

    return (
        // Começamos o grupo mais para baixo (-10) para o scroll subir ele
        <group ref={groupRef} position={[0, -10, 0]}>
            {images.map((img, i) => (
                <FloatCard 
                    key={i}
                    url={img.art.url}
                    slug={img.slug}
                    position={[positions[i].x, positions[i].y, positions[i].z]}
                    baseScale={positions[i].scale}
                    baseRotation={positions[i].rotation}
                />
            ))}
        </group>
    )
}

function FloatCard({ url, slug, position, baseScale, baseRotation, ...props }: any) {
  const ref = useRef<any>(null)
  const router = useRouter()
  const [hovered, hover] = useState(false)
  
  useFrame((state, delta) => {
    if(!ref.current) return

    // Animação de escala no Hover
    const targetScale = hovered ? baseScale * 1.2 : baseScale
    easing.damp(ref.current.scale, 'x', targetScale, 0.2, delta)
    easing.damp(ref.current.scale, 'y', targetScale, 0.2, delta)
    
    // Animação de opacidade baseada na distância (opcional, reforça profundidade)
    // Itens muito longe ficam um pouco mais transparentes se desejar
    // ref.current.material.opacity = ...
  })

  return (
    // O componente Float cuida da animação suave de "flutuar"
    // speed: velocidade da animação
    // rotationIntensity: quanto ele gira enquanto flutua
    // floatIntensity: quanto ele sobe e desce/lados
    <Float 
        speed={2} 
        rotationIntensity={0.5} 
        floatIntensity={1} 
        position={position} // A posição base fixa distribuída aleatoriamente
    >
        <Image 
            ref={ref}
            url={url}
            transparent
            side={THREE.DoubleSide}
            scale={[2, 2.5]} // Tamanho base do cartão
            rotation={[0, 0, baseRotation]} // Rotação aleatória sutil
            onClick={() => router.push(`/arte/${slug}`)}
            onPointerOver={(e) => (e.stopPropagation(), hover(true), document.body.style.cursor = 'pointer')}
            onPointerOut={() => (hover(false), document.body.style.cursor = 'default')}
            {...props}
        />
    </Float>
  )
}