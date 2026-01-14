"use client";
import Image from "next/image";
import { useState } from "react";
import { NavItem } from "../types/Nav";
import { AiChat } from "./AiChat";
import { NavList } from "./NavList";
import { usePathname } from "next/navigation";

export const NavDetail = ({ nav, variant = "grid", showNavInit = false, showChat = true }: { nav: NavItem[]; variant?: "grid" | "list", showNavInit?: boolean, showChat?: boolean }) => {
  const [showNav, setShowNav] = useState(showNavInit);
  const pathname = usePathname();

  return (
    <div className="absolute bottom-8 left-0 w-full">
      <div className={`flex flex-row gap-5 items-center ${pathname === '/' ? "justify-between" : "justify-center"} px-4`}>
        <div
        className={`
          mt-3
          flex
          justify-center
          items-center
          bg-primary
          rounded-full 
          transition-all 
          duration-300
          min-w-12
          h-12`}
        onClick={() => {
          setShowNav(true);
        }}
      >
        <Image src="/icons/nav.svg" width={26} height={18} alt="Menu" />
      </div>
       {showChat && <div className="basis-full sm:basis-3/12"><AiChat theme="light" /></div>}
      </div>
      <div onClick={() => setShowNav(false)} className={`transition-all duration-300 w-full h-full bg-black/50 fixed top-0 left-0 z-10 ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}`}></div>
      <div className={`z-20 bg-gradient-to-b from-black/75 to-black/90 w-full rounded-t-4xl px-4 pb-4 pt-10 fixed bottom-0 border border-white/25 backdrop-blur-lg transition-all duration-300 ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}`}  style={{
          boxShadow: "rgba(255, 255, 255, 0.2) 0px 20px 80px inset",
        }}>
         <div>
          <h2 className="text-[20px] leading-6">Linguagem e IA Generativa como Campo de Disputa</h2>
          <p className="text-white mt-3 text-[14px]">Uma análise profunda da competição entre a linguagem natural e a IA generativa, revelando suas complexidades e o futuro da tecnologia.</p>
         </div>
         <NavList nav={nav} variant={variant} setShowNav={setShowNav}/>
        </div>
    </div>
  );
};
