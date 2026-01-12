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
    <div className="absolute bottom-8 left-0 w-full">
      <div
        className={`
          flex
          justify-center
          items-center
          bg-primary
          rounded-full 
          transition-all 
          duration-300
          w-12
          ml-5
          h-12`}
        onClick={() => {
          setShowNav(true);
        }}
      >
        <Image src="/icons/nav.svg" width={24} height={18} alt="Menu" />
      </div>
      <div onClick={() => setShowNav(false)} className={`transition-all duration-300 w-full h-full bg-black/50 fixed top-0 left-0 z-10 ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}`}></div>
      <div className={`z-20 bg-gradient-to-b from-black/75 to-black/90 w-full rounded-t-4xl px-4 pb-4 pt-10 absolute -bottom-8 border border-white/25 backdrop-blur-lg transition-all duration-300 ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}`}  style={{
          boxShadow: "rgba(255, 255, 255, 0.2) 0px 20px 80px inset",
        }}>
         <div>
          <h2 className="text-[20px] leading-6">Linguagem e IA Generativa como Campo de Disputa</h2>
          <p className="text-white mt-3 text-[14px]">Uma análise profunda da competição entre a linguagem natural e a IA generativa, revelando suas complexidades e o futuro da tecnologia.</p>
         </div>
         <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-4">
           {nav.map((item, index) => {
            return (
             <div key={index} className="basis-1/2 border border-white/25 rounded-2xl h-40 overflow-hidden">
               <Link className="flex justify-between bg-gradient-to-b from-black/75 to-black/0 p-4 items-center" href={item.url}>
                {item.label}
                <span className="bg-white text-black rounded-full p-2 w-8 h-8 flex items-center justify-center text-4xl">+</span>
              </Link>
             </div>
            );
          })}
         </div>
        </div>
    </div>
  );
};
