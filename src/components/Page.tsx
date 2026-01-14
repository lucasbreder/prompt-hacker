"use client";
import { Brand } from "./Brand";
import { ArtData, PageData } from "../types/Page";
import { AiChat } from "./AiChat";
import { AiWelcome } from "./AiWelcome";
import Cookies from "js-cookie";
import Image from "next/image";
import { Gallery } from "./Gallery";
import { usePathname } from "next/navigation";
import { videoUrl } from "../utils/util.show.video";
import { VideoBackground } from "./VídeoBackground";
import Link from "next/link";

export const Page = ({
  id,
  content,
  excerpt,
  slug,
  title,
  thumbnail,
  art,
  team,
  gallery,
}: PageData | ArtData) => {
  const isGuided = Cookies.get("isGuided");
  const pathname = usePathname();
  const video = videoUrl(pathname);

  return (
    <>
      <header
        className={`h-full flex flex-col justify-between p-4 bg-cover bg-fixed  bg-blend-luminosity relative overflow-hidden`}
        style={{
          backgroundImage: `url(${thumbnail || art?.url})`,
        }}
      >
        
        <div className="bg-linear-to-b from-black/60 to-black/0 w-full h-full mix-blend-multiply absolute top-0 left-0"></div>
        {video && <VideoBackground videoSrc={video} />}
        <Brand />
      </header>
      <section className="bg-white sm:px-[20%]">
        
        <div className="flex flex-col sm:flex-row gap-10 bg-white py-10 px-5 text-black">
          <div className="sm:basis-3/12">
             {isGuided && (
            <AiWelcome
              message={`Como um guia introduza essa página baseado nesse conteúdo de forma curta: ${title} - ${excerpt}`}
            />
          )}
           <h1 className="text-secondary text-[40px] leading-10 font-bold mb-5 ">{title}</h1>
          </div>
         <div className="sm:basis-9/12">
           <div className="text-[25px] leading-8 font-bold mb-10">{excerpt}</div>
         
         
          <article className="article" dangerouslySetInnerHTML={{ __html: content }} />
           {art && (
            <>
            
            <div className="w-full h-70 relative mt-5">
              <Image
                className="object-cover"
                src={`${thumbnail || art.url}`}
                fill
                alt=""
              />
            </div>
            {art.caption && <div className="text-center bg-[#EDEDED] py-5 px-3 text-[14px]">{art.caption}</div>}
            <div className="sm:flex sm:flex-col">
              <div className="sm:w-5/12 italic font-bold mt-10 text-[14px] sm:self-end">EQUIPE:</div>
              <div className="sm:w-5/12 italic text-[14px] sm:self-end">{team}</div>
              <div className="text-secondary mt-10 -mb-20"><Link href="/"> {"<"} Voltar a Galeria</Link></div>
            </div>
             </>
          )}
         </div>
       
        </div>
           <div className="pt-20 sm:pt-50 pb-30 sm:pb-30 px-4">
          <AiChat theme="light" />
          </div>
      </section>
    </>
  );
};
