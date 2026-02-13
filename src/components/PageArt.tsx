"use client";
import { ArtData } from "../types/Page";
import { AiChat } from "./AiChat";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { videoUrl } from "../utils/util.show.video";
import { VideoBackground } from "./VídeoBackground";
import Link from "next/link";
import Image from "next/image";
import { Lightbox } from "./Lightbox";

export const PageArt = ({
  content,
  excerpt,
  title,
  author,
  art,
  team,
  nav,
  year,
  platform,
  axis,
  showNav,
  art_process,
  author_note
}: ArtData) => {
  const pathname = usePathname();
  const video = videoUrl(pathname);
  const [showChatFixed, setShowChatFixed] = useState(false);
  const [isChatAtBottom, setIsChatAtBottom] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
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
        className={`h-150 flex flex-col justify-between p-4 bg-cover bg-fixed bg-blend-luminosity relative overflow-hidden bg-center`}
        style={{
          backgroundImage: `url(${art?.url})`,
        }}
      >
        {!video && <div className="opacity-60 w-full h-full bg-[url('/pattern.jpg')] mix-blend-multiply absolute top-0 left-0"></div>}
        <div className="bg-linear-to-b from-black/60 to-black/0 w-full h-full mix-blend-multiply absolute top-0 left-0"></div>
        {video && <VideoBackground videoSrc={video} />}

      </header>
      <section className="bg-[#FCF9F7] pb-50">

        <div className="max-w-[980px] mx-auto">
          <div className="flex flex-col sm:flex-row gap-10 py-10 px-5 text-black">
            <div className="sm:basis-5/12 sm:min-w-[250px] bg-white p-7 border border-[#EAEAEA] max-h-fit sm:sticky top-10 self-start">
              <div className="pb-7 border-b border-[#EAEAEA]"><Link href="/"><Image src="/brand/brand-art.svg" alt="" width={236} height={64} /></Link></div>
              <h1 className="text-secondary text-left text-[30px] leading-10 font-bold pt-5 mb-2">{title}</h1>
              {year && <div className="font-normal text-[16px] leading-3 mb-5 text-[#AFAFAF]">({year})</div>}
              {author && <div className="text-xl text-[#AFAFAF]">Por <span className="font-bold text-lg pb-3 text-black">{author}</span></div>}
              <div className="mt-5 pt-5 border-t border-[#EAEAEA] flex flex-col gap-5">
                {platform && <div className="text-xl">
                  <div className="text-secondary font-bold">Plataformas</div>
                  <div className="flex flex-wrap gap-2">
                    {platform.map((item: string, index: number) => (
                      <span key={index} className="font-extralight text-sm px-2 py-1 rounded-full bg-[#FCF9F7] border border-[#EAEAEA]">{item}</span>
                    ))}
                  </div>
                </div>}
                {axis && <div className="text-xl">
                  <div className="text-secondary font-bold">Eixo</div>
                  <div className="flex flex-wrap gap-2">
                    {axis.map((item: string, index: number) => (
                      <span key={index} className="font-extralight text-sm px-2 py-1 rounded-full bg-[#FCF9F7] border border-[#EAEAEA]">{item}</span>
                    ))}
                  </div>
                </div>}
              </div>
            </div>
            <div className="sm:basis-9/12">
              <div className="text-[25px] leading-8 font-bold mb-10 text-secondary">{excerpt}</div>


              <article className={`article ${art ? "article-art" : ""}`} dangerouslySetInnerHTML={{ __html: content }} />
              {art && (
                <>

                  <div className="w-full w-full relative mt-5" style={{ aspectRatio: art.width / art.height }}>
                    <Image
                      className="object-cover"
                      src={art?.url}
                      fill
                      alt=""
                    />
                  </div>
                  {art?.caption && <div className="text-center bg-[#EDEDED] py-5 px-3 text-[14px]">{art?.caption}</div>}
                  <div className="sm:flex sm:flex-col">
                    {team && <div className="sm:w-5/12 italic font-bold mt-10 text-[14px] sm:self-end">EQUIPE:</div>}
                    {team && <div className="sm:w-5/12 italic text-[14px] sm:self-end">{team}</div>}
                    {/* <div className="text-secondary mt-10"><Link href="/"> {"<"} Voltar a Galeria</Link></div> */}
                  </div>
                </>
              )}
            </div>

          </div>
          <h3 className="text-secondary text-[25px] leading-10 font-bold pt-5 mb-3 px-5 sm:px-0">Processo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 px-5 sm:px-0">

            {art_process?.map((item, index) => (
              <div
                key={item.id}
                className="text-center basis-1/2 text-[14px] relative cursor-pointer group overflow-hidden"
                style={{ aspectRatio: item.width / item.height }}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  src={item?.url}
                  fill
                  alt=""
                />
                {item.caption && (
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <p className="text-white text-sm font-light leading-snug text-center line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedImageIndex !== null && art_process && (
            <Lightbox
              images={art_process}
              initialIndex={selectedImageIndex}
              onClose={() => setSelectedImageIndex(null)}
            />
          )}
          {author_note && <div className="text-black bg-primary py-15 px-12 sm:px-30 mt-10 italic text-[20px] rounded-2xl mb-10 mx-5 sm:mx-0 relative">
            <Image className="absolute top-5 left-5" src="/icons/quote.svg" alt="" width={38} height={30} />
            <div className="text-sm font-bold mb-5"> - {author}</div>
            <div>"{author_note}"</div>
          </div>}
          <div ref={chatContainer} className="relative">
            <AiChat theme="light" isFixed={showChatFixed} isAtBottom={isChatAtBottom} />
          </div>
        </div>

      </section>
    </>
  );
};
