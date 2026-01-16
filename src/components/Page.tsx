"use client";
import { Brand } from "./Brand";
import { ArtData, PageData } from "../types/Page";
import { AiChat } from "./AiChat";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { videoUrl } from "../utils/util.show.video";
import { VideoBackground } from "./VídeoBackground";
import Link from "next/link";
import { NavDetail } from "./NavDetail";

export const Page = ({
  content,
  excerpt,
  title,
  thumbnail,
  art,
  team,
  nav,
  showNav
}: PageData | ArtData) => {
  const pathname = usePathname();
  const video = videoUrl(pathname);
  const [showChatFixed, setShowChatFixed] = useState(false);
  const [isChatAtBottom, setIsChatAtBottom] = useState(false);
  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Mostrar chat apenas quando comecar a scrollar
      setShowChatFixed(scrollY > 0);

      // Mudar para absolute quando chegar na posição do chatContainer (com offset para ser um pouco antes)
      if (chatContainer.current) {
        const containerTop = chatContainer.current.getBoundingClientRect().top + scrollY;
        setIsChatAtBottom(scrollY + windowHeight >= containerTop + 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`h-full flex flex-col justify-between p-4 bg-cover bg-fixed bg-blend-luminosity relative overflow-hidden`}
        style={{
          backgroundImage: `url(${thumbnail || art?.url})`,
        }}
      >
        {!video && <div className="opacity-60 w-full h-full bg-[url('/pattern.jpg')] mix-blend-multiply absolute top-0 left-0"></div>}
        <div className="bg-linear-to-b from-black/60 to-black/0 w-full h-full mix-blend-multiply absolute top-0 left-0"></div>
        {video && <VideoBackground videoSrc={video} />}
        <Brand />
      </header>
      <section className="bg-white sm:px-[20%] pb-50">
        
        <div className="flex flex-col sm:flex-row gap-10 bg-white py-10 px-5 text-black">
          <div className="sm:basis-3/12">
           <h1 className="text-secondary text-[40px] leading-10 font-bold mb-5 ">{title}</h1>
          </div>
         <div className="sm:basis-9/12">
           <div className="text-[25px] leading-8 font-bold mb-10">{excerpt}</div>
         
         
          <article className={`article ${art ? "article-art" : ""}`} dangerouslySetInnerHTML={{ __html: content }} />
           {art && (
            <>
            
            {/* <div className="w-full h-70 relative mt-5">
              <Image
                className="object-cover"
                src={`${thumbnail || art.url}`}
                fill
                alt=""
              />
            </div>
            {art.caption && <div className="text-center bg-[#EDEDED] py-5 px-3 text-[14px]">{art.caption}</div>} */}
            <div className="sm:flex sm:flex-col">
              {team && <div className="sm:w-5/12 italic font-bold mt-10 text-[14px] sm:self-end">EQUIPE:</div>}
              {team && <div className="sm:w-5/12 italic text-[14px] sm:self-end">{team}</div>}
              <div className="text-secondary mt-10"><Link href="/"> {"<"} Voltar a Galeria</Link></div>
            </div>
             </>
          )}
         </div>
       
        </div>
        <div ref={chatContainer} className="relative">
            <AiChat theme="light" isFixed={showChatFixed} isAtBottom={isChatAtBottom} />
           </div>
        {showNav && nav && <div className="relative w-full mt-30 mb-10">
          <NavDetail nav={nav.docs} showChat={false}/>
        </div>}
       
      </section>
    </>
  );
};
