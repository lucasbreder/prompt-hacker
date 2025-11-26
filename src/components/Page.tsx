"use client";
import { Brand } from "./Brand";
import { ArtData, PageData } from "../types/Page";
import { AiChat } from "./AiChat";
import { AiWelcome } from "./AiWelcome";
import Cookies from "js-cookie";
import Image from "next/image";
import { Gallery } from "./Gallery";

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
  return (
    <>
      <header
        className={`h-full  flex flex-col justify-between p-10 bg-cover bg-fixed bg-black bg-blend-luminosity relative overflow-hidden`}
        style={{
          backgroundImage: `url(http://localhost:3000${thumbnail || art})`,
        }}
      >
        <div className="bg-linear-to-b from-black/50 to-white w-full h-full mix-blend-multiply absolute top-0 left-0"></div>
        <Brand />
        <div>
          <h1 className="text-primary text-5xl font-bold mb-10">{title}</h1>
          <div className="text-xl">{excerpt}</div>
        </div>
      </header>
      <section className="">
        <div className=" bg-white p-10 text-black">
          {isGuided && (
            <AiWelcome
              message={`Como um guia introduza essa página baseado nesse conteúdo de forma curta: ${title} - ${excerpt}`}
            />
          )}
          {art && (
            <div className="w-full h-70 relative mb-5">
              <Image
                className="object-contain"
                src={`http://localhost:3000${thumbnail || art}`}
                fill
                alt=""
              />
            </div>
          )}
          <article dangerouslySetInnerHTML={{ __html: content }} />
          {slug === "galeria" && gallery && <Gallery data={gallery} />}
          <AiChat theme="light" placeholder="Quer saber algo mais?" />
        </div>
      </section>
    </>
  );
};
