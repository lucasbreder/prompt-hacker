"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "./Brand";
import { Nav2 } from "./Nav2";
import { NavItem } from "../types/Nav";
import { AiChat } from "./AiChat";

export const NavDetail = ({ nav }: { nav: NavItem[] }) => {
  const [showNav, setShowNav] = useState(false);
  const [showParent, setShowParent] = useState(false);

  return (
    <>
      {showNav && (
        <div
          className="absolute top-10 right-10 w-6 h-6 border rounded-full flex items-center justify-center text-sm z-30"
          onClick={() => {
            setShowNav(false);
          }}
        >
          x
        </div>
      )}
      <div
        className={` 
            border
             border-white/40
            px-7
            py-5
            rounded-2xl 
            ${showParent ? "" : "backdrop-blur-lg"}
            transition-all 
            duration-300 
            absolute 
            bottom-10
            left-5 
            w-[calc(100%-40px)]
            ${showNav ? "h-[calc(100%-56px)] py-12" : "h-17"}`}
        onClick={() => {
          setShowNav(true);
        }}
        style={{
          boxShadow: "rgba(255, 255, 255, 0.3) 75px 20px 80px inset",
        }}
      >
        {showNav && (
          <div className="flex flex-col justify-between h-[calc(100%-80px)]">
            <div className="mb-30">
              <Brand />
            </div>
            <div className="text-primary text-xl mb-5 leading-6">
              Linguagem e IA Generativa como Campo de Disputa
            </div>
            <div className="mb-20 leading-5">
              Uma análise profunda da competição entre a linguagem natural e a
              IA generativa, revelando suas complexidades e o futuro da
              tecnologia.
              <Link className="text-primary underline ml-2" href={"#"}>
                DOWNLOAD
              </Link>
            </div>
            <div>
              <Nav2 nav={nav} />
            </div>
          </div>
        )}
        <div
          className={`flex justify-between absolute bottom-0 left-5 w-[calc(100%-40px)] py-5 ${
            showNav ? "border-t border-white/40" : "border-none"
          }`}
        >
          <div className="text-lg w-full">
            {!showNav && "Encontre tudo aqui"}
            {showNav && <AiChat setShowParent={setShowParent} />}
          </div>
          {!showNav && (
            <Image src="/icons/nav.svg" width={24} height={18} alt="Menu" />
          )}
        </div>
      </div>
    </>
  );
};
