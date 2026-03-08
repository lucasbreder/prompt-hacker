import Image from "next/image"
import { useMemo, useState } from "react"
import { useGetInteractions } from "../hooks/getInteractions"

export const AiInteractions = ({showChat}: {showChat: boolean}) => {

    const [showInfo, setShowInfo] = useState(false)
    const {data: interactions} = useGetInteractions()
    const totalInteractions = interactions ? Number(interactions) : 0

    const nextTree = useMemo(() => {
        return totalInteractions + (10 - (totalInteractions % 10))
    }, [interactions])

    const treesPlanted = useMemo(() => {
        return Math.floor(totalInteractions / 10)
    }, [interactions])

    const progress = useMemo(() => {
        return (totalInteractions % 10) * 10
    }, [interactions])

    return (
       
  <div
    className={` flex-col gap-5 py-5 pb-10 my-5 px-10 text-sm ${showChat ? "opacity-100 overflow-auto" : "opacity-0 h-0 overflow-hidden"} relative hidden sm:flex`}
    style={{
      borderLeft: "1px solid transparent",
      borderImage: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent) 1",
    }}
  >
     <div className="hidden sm:block absolute bottom-0 right-0 cursor-pointer">
        <Image src="/icons/info.svg" width={20} height={20} alt="" onClick={() => {
            setShowInfo(!showInfo)
        }} />
       
    </div>
     <div className={`${showInfo ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} bg-white text-black flex-col justify-center items-center p-4 rounded-2xl fixed bottom-45 text-center gap-3 w-90 z-20 transition-all duration-300 flex`}>
             <Image src="/icons/tree.svg" width={30} height={30} alt="" />
            <div className="font-bold">Cada interação neste chat ajuda a plantar uma nova árvore.</div>
            <div className="font-light">Usamos tecnologia com responsabilidade para compensar o impacto da IA.</div>
        </div>
    <div className="flex flex-col items-center">
        <span className="font-light">Interações:</span>
        <span className="font-bold">{totalInteractions}</span>
    </div>
        <div className="flex flex-col items-center">
        <div className="font-light">Próxima Árvore:</div>
        
        <div className="font-bold">{nextTree}</div>
        <div className="w-full bg-gray-800 h-1 overflow-hidden rounded-full">
        <div className="bg-primary h-1 font-bold" style={{
            width: `${progress}%`,
        }}></div>
        </div>
    </div>
        <div className="flex flex-col items-center">
        <div className="font-light">Árvores Plantadas:</div>
        <div className="font-bold">{treesPlanted}</div>
    </div>
    
    </div>
    )
}