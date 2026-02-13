"use client";
import Image from "next/image";
import { useState } from "react";
import { NavItem } from "../types/Nav";
import { AiChat } from "./AiChat";
import { NavList } from "./NavList";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const NavDetail = ({ nav, variant = "grid", showNavInit = false, showChat = true }: { nav: NavItem[]; variant?: "grid" | "list", showNavInit?: boolean, showChat?: boolean }) => {
  const [showNav, setShowNav] = useState(showNavInit);
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className={`flex flex-row gap-5 items-center ${pathname === '/' ? "justify-between" : "justify-center"}`}>
        <div
          className={`
          cursor-pointer
          flex
          justify-center
          items-center
          bg-transparent
          border-primary
          border-2
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
      </div>
      <div onClick={() => setShowNav(false)} className={`transition-all duration-300 w-full h-full bg-black/50 fixed top-0 left-0 z-10 ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
  

      <div className={`fixed -bottom-px left-1/2 translate-x-[-50%] z-90 bg-linear-to-b from-black/75 to-black/90 w-full sm:w-[1200px] sm:mx-auto rounded-t-4xl px-6 pb-6 sm:p-8 pt-10 border border-white/25 backdrop-blur-lg transition-all duration-300 ${showNav ? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{
        boxShadow: "rgba(255, 255, 255, 0.3) 0px 0px 200px inset",
      }}>
              <div onClick={() => setShowNav(false)} className="cursor-pointer absolute top-3 sm:top-5 right-5 w-6 h-6 rounded-full flex items-center justify-center text-sm text  -primary z-20">
          <Image src="/icons/close.svg" width={18} height={18} alt="Close" />
        </div>
        <div>
          <h2 className="text-[20px] leading-6">Linguagem e IA Generativa como Campo de Disputa</h2>
          <p className="text-white mt-3 text-[14px]">Uma análise profunda da competição entre a linguagem natural e a IA generativa, revelando suas complexidades e o futuro da tecnologia. <br /><Link className="text-primary underline" href="/projeto">{"< "}Leia Mais{" >"}</Link></p>
        </div>
        <NavList nav={nav} variant={variant} setShowNav={setShowNav} />
      </div>
    </div>
  );
};
