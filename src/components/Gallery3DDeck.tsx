"use client"
import { Image, useProgress } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { GalleryDataItem } from '../types/Gallery'

export const Gallery3DDeck = ({images = []}: {images: GalleryDataItem[]}) => {
  const { active } = useProgress()
  
  // Agora usamos a matemática de wrap contínua, então evitamos estourar memória com 300 items!
  const deckImages = useMemo(() => {
     if(images.length === 0) return []
     return [...images].reverse()
  }, [images])

  const sharedYOffset = useRef(0);
  const targetYOffset = useRef(0);
  const touchY = useRef(0);

  const handleWheel = (e: React.WheelEvent) => {
     targetYOffset.current += e.deltaY * 0.005; 
  }

  const handleTouchStart = (e: React.TouchEvent) => {
     touchY.current = e.touches[0].clientY;
  }

  const handleTouchMove = (e: React.TouchEvent) => {
     const deltaY = touchY.current - e.touches[0].clientY;
     touchY.current = e.touches[0].clientY;
     targetYOffset.current += deltaY * 0.02; // Ajuste sensibilidade do touch mobile
  }

    return (
        <div className="w-full h-full overflow-hidden relative bg-black" onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
          {/* Fundo com padrão */}
          <div className='opacity-30 pointer-events-none w-full h-full absolute top-0 left-0 z-10 bg-[url(/pattern.jpg)] bg-cover sm:bg-contain bg-center mix-blend-overlay'></div>
          
           {/* Câmera posicionada um pouco acima e olhando para baixo */}
           <Canvas camera={{ position: [0, 2, 8], fov: 35 }}>
                <Deck images={deckImages} sharedYOffset={sharedYOffset} targetYOffset={targetYOffset} />
            
            {/* Luzes para dar volume */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[0, 10, 5]} intensity={1} />
        </Canvas>
         {active &&  <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <span className="loader"></span>
        </div>}
        </div>
    )
}

function Deck({ images, sharedYOffset, targetYOffset }: { images: GalleryDataItem[], sharedYOffset: any, targetYOffset: any }) {
    const ref = useRef<THREE.Group>(null)

    // Parâmetros de layout do Deck
    const gap = 1.5; // Distância entre as cartas no eixo Z
    const stackHeight = 0.15; // O quanto cada carta sobe no eixo Y (escadinha)
    
    const dampState = useRef({ y: 0 })

    useFrame((state, delta) => {
        // Suaviza o offset global do Deck contínuo
        easing.damp(dampState.current, 'y', targetYOffset.current, 0.4, delta);
        sharedYOffset.current = dampState.current.y;
    })

    return (
        // O grupo agora fica estático globalmente! Quem se move dinamicamente em loop numérico são as próprias cartas
        <group ref={ref}>
            {images.map((img, i) => (
                <Card 
                    key={i}
                    url={img.art.url} 
                    index={i}
                    slug={img.slug}
                    gap={gap}
                    stackHeight={stackHeight}
                    total={images.length}
                    sharedYOffset={sharedYOffset}
                />
            ))}
        </group>
    )
}

function Card({ url, index, slug, gap, stackHeight, total, sharedYOffset, ...props }: any) {
  const ref = useRef<any>(null)
  const router = useRouter()
  const [hovered, hover] = useState(false)
  const isClickable = useRef(false)
  
  useFrame((state, delta) => {
    if(!ref.current) return

    const scrollOffset = sharedYOffset.current;
    
    // MARGIN_FRONT determina quantas cartas passam da câmera antes de "teletransportarem" para o fundo do baralho
    const MARGIN_FRONT = 4; 
    
    // Matemática pura de Loop Infinito (Garante que a distância relativa da carta ativa sempre transite entre [-MARGIN_FRONT, total-MARGIN_FRONT])
    const distFromActive = ((index - scrollOffset + MARGIN_FRONT) % total + total) % total - MARGIN_FRONT;
    
    // 1. POSICIONAMENTO DINÂMICO DE WRAP
    // Z negativo = mais para o fundo. Y positivo = mais para o topo (fichário)
    // Como a distância relativa é perfeitamente contínua, as cartas reciclam sozinhas como uma esteira!
    const localZ = -distFromActive * gap;
    const localY = distFromActive * stackHeight;
    
    ref.current.position.set(0, localY, localZ)
    
    let targetOpacity = 0
    // Distribuímos e desvanecemos o restante para dar a sensação de gaveta profunda
    const visibilityRange = 20; 
    
    if (distFromActive < -1) {
        // Passou da câmera (caindo fora da tela)
        targetOpacity = 0
    } else if (distFromActive < visibilityRange) {
        // Zona visível interativa
        targetOpacity = 1 - (distFromActive / visibilityRange) 
        if(distFromActive < 0.5 && distFromActive > -0.5) targetOpacity = 1; 
    } else {
        // Muito longe pro fog
        targetOpacity = 0
    }

    targetOpacity = Math.max(0, Math.min(1, targetOpacity))

    isClickable.current = targetOpacity > 0

    easing.damp(ref.current.material, 'opacity', targetOpacity, 0.2, delta)
    
    // Hover effect
    const hoverScale = hovered ? 2 : 1.8
    if (!isClickable.current && hovered) {
      hover(false)
      document.body.style.cursor = 'default'
    }
    easing.damp(ref.current.scale, 'x', hoverScale, 0.5, delta)
    easing.damp(ref.current.scale, 'y', hoverScale, 0.5, delta)

    // Performance skip
    ref.current.visible = ref.current.material.opacity > 0.01
  })

  return (
    <Image 
        ref={ref}
        url={url}
        transparent // Necessário para controlar opacidade
        side={THREE.DoubleSide}
        // Inclinação típica de fichário (-15 graus no eixo X)
        rotation={[-0.25, 0, 0]} 
        scale={[1.5, 1]} // Proporção 3:2 (cartão postal)
        onClick={(e) => { 
          if (!isClickable.current) return;
          e.stopPropagation(); 
          router.push(`/arte/${slug}`) 
        }}
        onPointerOver={(e) => { 
          if (!isClickable.current) return;
          e.stopPropagation(); 
          hover(true); 
          document.body.style.cursor = 'pointer' 
        }}
        onPointerOut={(e) => { 
          if (!isClickable.current) return;
          e.stopPropagation(); 
          hover(false); 
          document.body.style.cursor = 'default' 
        }}
        {...props}
    />
  )
}