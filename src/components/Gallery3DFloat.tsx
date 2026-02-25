"use client"
import { Image, ScrollControls, useScroll, Float, useProgress } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { easing } from 'maath'
import { GalleryDataItem } from '../types/Gallery'

export const Gallery3DFloat = ({images = []}: {images: GalleryDataItem[]}) => {
  const { active } = useProgress()
  
  // A quantidade de itens se mantém para o loop
  const totalItems = 30; 
  
  // A área de distribuição (HEIGHT), como no Orb. Aumentada para 120 para espalhar os cards.
  const areaHeight = 120;

  const cloudImages = useMemo(() => {
     if(images.length === 0) return []
     return Array.from({ length: totalItems }, (_, i) => images[i % images.length])
  }, [images])

  // Refs de estado de Y para o scroll customizado infinito
  const sharedYOffset = useRef(0);
  const targetYOffset = useRef(0);

  // Interceptador global do mouse wheel sobre a galeria (Igual ao do Orb)
  const handleWheel = (e: React.WheelEvent) => {
     targetYOffset.current += e.deltaY * 0.02; // A mesma velocidade balanceada
  }

    return (
        <div className="w-full h-full overflow-hidden bg-[#101010]" onWheel={handleWheel}>
          {/* Fundo escuro para destacar a profundidade */}
          <div className='opacity-20 pointer-events-none w-full h-full absolute top-0 left-0 z-10 bg-[url(/pattern.jpg)] bg-cover sm:bg-contain bg-center mix-blend-overlay'></div>
          
           <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            {/* Adiciona fog para que as imagens muito ao fundo desapareçam suavemente */}
            <fog attach="fog" args={['#101010', 5, 25]} />
            
            <CloudScene images={cloudImages} areaHeight={areaHeight} sharedYOffset={sharedYOffset} targetYOffset={targetYOffset} />
            
            <ambientLight intensity={1} />
        </Canvas>
        {active &&  <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
          <span className="loader"></span>
        </div>}
        </div>
    )
}

function CloudScene({ images, areaHeight, sharedYOffset, targetYOffset }: { images: GalleryDataItem[], areaHeight: number, sharedYOffset: any, targetYOffset: any }) {
    const groupRef = useRef<THREE.Group>(null)

    // Pré-calcula posições aleatórias
    const positions = useMemo(() => {
        return images.map(() => ({
            x: (Math.random() - 0.5) * 12,   // Espalha largura (-6 a 6)
            y: (Math.random() - 0.5) * areaHeight, // Espalha altura no ciclo todo
            z: (Math.random() - 0.5) * 10,   // Espalha profundidade (-5 a 5)
            scale: 1 + Math.random() * 0.8,  // Variação de tamanho base sutil
            rotation: (Math.random() - 0.5) * 0.3 // Leve rotação inicial
        }))
    }, [images, areaHeight])

    // Math object state for dampening scroll offset
    const dampState = useRef({ y: 0 })

    useFrame((state, delta) => {
        // Suaviza a transição do scroll roda do mouse da mesma forma
        easing.damp(dampState.current, 'y', targetYOffset.current, 0.4, delta);
        sharedYOffset.current = dampState.current.y;

        if (groupRef.current) {
            // Efeito de Parallax do Mouse original mantido e suavizado
            easing.damp3(state.camera.position, [state.pointer.x * 2, state.pointer.y * 2, 15], 0.3, delta)
            state.camera.lookAt(0, 0, 0)
        }
    })

    return (
        <group ref={groupRef}>
            {images.map((img, i) => (
                <FloatCard 
                    key={i}
                    url={img.art.url}
                    slug={img.slug}
                    initialPosition={[positions[i].x, positions[i].y, positions[i].z]}
                    baseScale={positions[i].scale}
                    baseRotation={positions[i].rotation}
                    height={areaHeight}
                    sharedYOffset={sharedYOffset}
                />
            ))}
        </group>
    )
}

function FloatCard({ url, slug, initialPosition, baseScale, baseRotation, height, sharedYOffset, ...props }: any) {
  const ref = useRef<any>(null)
  const imageRef = useRef<any>(null) // Ref para a imagem interna
  const router = useRouter()
  const [hovered, hover] = useState(false)
  
  useFrame((state, delta) => {
    if(!ref.current || !imageRef.current) return

    // Utiliza o Y suave calculado externamente para infinito
    const yOffset = sharedYOffset.current;
    // initialPosition[1] => y original
    const initialY = initialPosition[1]
    
    // Matemática pura de wrap loop
    const halfHeight = height / 2;
    const wrappedY = ((initialY + yOffset + halfHeight) % height + height) % height - halfHeight;
    
    ref.current.position.set(initialPosition[0], wrappedY, initialPosition[2])

    // Animação de escala no Hover (aplicada à imagem interna)
    const targetScale = hovered ? baseScale * 1.2 : baseScale
    easing.damp(imageRef.current.scale, 'x', targetScale * 2, 0.2, delta)
    easing.damp(imageRef.current.scale, 'y', targetScale * 2.5, 0.2, delta)
  })

  return (
    // O grupo base recebe a posição Y infinita (Wrap numérico)
    <group ref={ref}>
        {/* O Float aplica o movimento orgânico (Flutuante local) independentemente */}
        <Float 
            speed={2} 
            rotationIntensity={0.5} 
            floatIntensity={1} 
        >
            <Image 
                ref={imageRef}
                url={url}
                transparent
                side={THREE.DoubleSide}
                scale={[2, 2.5]} // Tolerancia multiplicada no useFrame
                rotation={[0, 0, baseRotation]} // Rotação aleatória sutil
                onClick={(e: any) => { e.stopPropagation(); router.push(`/arte/${slug}`) }}
                onPointerOver={(e: any) => { e.stopPropagation(); hover(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={(e: any) => { e.stopPropagation(); hover(false); document.body.style.cursor = 'default' }}
                {...props}
            />
        </Float>
    </group>
  )
}