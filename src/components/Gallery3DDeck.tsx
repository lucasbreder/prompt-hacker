"use client"
import { Image, ScrollControls, useScroll, useProgress } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'
import { GalleryDataItem } from '../types/Gallery'

export const Gallery3DDeck = ({images = []}: {images: GalleryDataItem[]}) => {
  const { active } = useProgress()
  // Aumentamos o array para dar a sensação de "pilha infinita" ao scrolar
  const totalItems = 30;
  const arrayPreenchido = Array.from({ length: totalItems }, (_, i) => {
    return images[i % images.length];
  });

  const deckImages = useMemo(() => {
     if(images.length === 0) return []
     return arrayPreenchido
  }, [images])

    return (
        <div className="w-full h-full overflow-hidden relative bg-black">
          {/* Fundo com padrão */}
          <div className='opacity-30 pointer-events-none w-full h-full absolute top-0 left-0 z-10 bg-[url(/pattern.jpg)] bg-cover sm:bg-contain bg-center mix-blend-overlay'></div>
          
           {/* Câmera posicionada um pouco acima e olhando para baixo para dar o efeito de "gaveta de arquivo" */}
           <Canvas camera={{ position: [0, 2, 8], fov: 35 }}>
            {/* Pages controla o tamanho da área de scroll. Quanto maior, mais lento o scroll */}
            <ScrollControls style={{scrollbarWidth: 'none'}} pages={4} damping={0.2}>
                <Deck images={deckImages} />
            </ScrollControls>
            
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

function Deck({ images }: { images: GalleryDataItem[] }) {
    const ref = useRef<THREE.Group>(null)
    const scroll = useScroll()

    // Parâmetros de layout do Deck
    const gap = 1.2; // Distância entre as cartas no eixo Z
    const stackHeight = 0.15; // O quanto cada carta sobe no eixo Y (escadinha)
    
    useFrame((state, delta) => {
        // O offset vai de 0 a 1. Multiplicamos pelo número de imagens para saber qual é o "índice ativo"
        // ex: se temos 30 imagens e scroll está na metade, o target é 15.
        // O damping suaviza esse valor para o movimento ser fluido.
        const scrollOffset = (1 - scroll.offset) * (images.length - 1)
        
        // Movemos o grupo inteiro para frente/trás baseado no scroll
        // Isso faz com que a carta "ativa" venha para perto da câmera (z=0)
        if(ref.current) {
             // O grupo move positivamente no Z para trazer as cartas de fundo para frente
             const targetZ = scrollOffset * gap;
             const targetY = -(scrollOffset * stackHeight); // Compensa a subida para manter o centro
             
             easing.damp3(ref.current.position, [0, targetY, targetZ], 0.3, delta)
        }
    })

    return (
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
                />
            ))}
        </group>
    )
}

function Card({ url, index, slug, gap, stackHeight, total, ...props }: any) {
  const ref = useRef<any>(null)
  const router = useRouter()
  const [hovered, hover] = useState(false)
  const scroll = useScroll()
  
  useFrame((state, delta) => {
    if(!ref.current) return

    // 1. POSICIONAMENTO ESTÁTICO DENTRO DO GRUPO
    // Cada carta tem sua posição fixa na "fila". O grupo pai é que se move.
    // Z negativo = mais para o fundo. Y positivo = mais para o topo (fichário)
    const initialZ = -index * gap
    const initialY = index * stackHeight
    
    ref.current.position.set(0, initialY, initialZ)

    // 2. CÁLCULO DE OPACIDADE E VISIBILIDADE (EFEITO FOG)
    // Precisamos saber onde esta carta está em relação ao scroll atual
    // scroll.offset * (total - 1) nos dá o índice flutuante atual (ex: 5.4)
    const currentScrollIndex = (1 - scroll.offset) * (total - 1)
    
    // Distância relativa desta carta para a carta ativa
    const distFromActive = index - currentScrollIndex
    
    // Lógica visual:
    // Se dist < -1: A carta já passou (saiu da tela pela frente), fica transparente
    // Se dist == 0: É a carta ativa, opacidade 1
    // Se dist > 5: Está muito lá no fundo, começa a desaparecer (fog)
    
    let targetOpacity = 0
    let targetScale = 1
    
    if (distFromActive < -1) {
        // Passou da câmera
        targetOpacity = 0
    } else if (distFromActive < 5) {
        // Zona visível (as 5 primeiras cartas)
        // Quanto mais perto do 0, mais opaco.
        targetOpacity = 1 - (distFromActive / 5) // Degrada suavemente
        // Pequeno boost de opacidade para a carta ativa
        if(distFromActive < 0.5 && distFromActive > -0.5) targetOpacity = 1; 
    } else {
        // Muito longe
        targetOpacity = 0
    }

    // Clamp da opacidade entre 0 e 1
    targetOpacity = Math.max(0, Math.min(1, targetOpacity))

    // Aplica opacidade suavemente
    easing.damp(ref.current.material, 'opacity', targetOpacity, 0.2, delta)
    
    // Hover effect
    const hoverScale = hovered ? 2 : 1.8
    easing.damp(ref.current.scale, 'x', hoverScale, 0.5, delta)
    easing.damp(ref.current.scale, 'y', hoverScale, 0.5, delta)

    // Otimização: Se opacidade for quase 0, desliga visibilidade para o renderizador ignorar
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
        onClick={() => router.push(`/arte/${slug}`)}
        onPointerOver={(e) => { e.stopPropagation(); hover(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { hover(false); document.body.style.cursor = 'default' }}
        {...props}
    />
  )
}