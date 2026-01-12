"use client";
import { Brand } from "./Brand";
import { ArtData, PageData } from "../types/Page";
import { AiChat } from "./AiChat";
import { AiWelcome } from "./AiWelcome";
import Cookies from "js-cookie";
import Image from "next/image";
import { Gallery } from "./Gallery";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

export const Page = ({
  id,
  content,
  excerpt,
  slug,
  title,
  thumbnail,
  art,
  gallery,
}: PageData | ArtData) => {
  const isGuided = Cookies.get("isGuided");
  const html = convertLexicalToHTML({ data: content })
  return (
    <>
      <header
        className={`h-full  flex flex-col justify-between p-4 bg-cover bg-fixed bg-black bg-blend-luminosity relative overflow-hidden`}
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_CMS_URL}${thumbnail || art})`,
        }}
      >
        <div className="bg-linear-to-b from-black/50 to-white w-full h-full mix-blend-multiply absolute top-0 left-0"></div>
        <Brand />
      </header>
      <section>
        
        <div className=" bg-white p-10 text-black">
           {isGuided && (
            <AiWelcome
              message={`Como um guia introduza essa página baseado nesse conteúdo de forma curta: ${title} - ${excerpt}`}
            />
          )}
           <h1 className="text-secondary text-[40px] leading-10 font-bold mb-10">{title}</h1>
          <div className="text-xl text-bold mb-10">{excerpt}</div>
         
          {art && (
            <div className="w-full h-70 relative mb-5">
              <Image
                className="object-contain"
                src={`http://${process.env.NEXT_PUBLIC_CMS_URL}${thumbnail || art}`}
                fill
                alt=""
              />
            </div>
          )}
          <article dangerouslySetInnerHTML={{ __html: html }} />
          {slug === "galeria" && gallery && <Gallery data={gallery} />}
          <AiChat theme="light" placeholder="Quer saber algo mais?" />
        </div>
      </section>
    </>
  );
};
