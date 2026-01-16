"use client";
import Link from "next/link";
import { NavItem } from "../types/Nav";
import { videoUrl } from "../utils/util.show.video";
import { usePathname } from "next/navigation";

export const NavList = ({ nav, variant = "grid", setShowNav }: { nav: NavItem[]; variant?: "grid" | "list"; setShowNav?: (show: boolean) => void }) => {

  const pathname = usePathname();

  return (

         <div className={`sm:max-w-[1200px] sm:mx-auto ${variant === "grid" ? "grid grid-cols-2 gap-x-5 gap-y-3 mt-4 sm:flex sm:flex-row sm:gap-10" : "flex flex-col sm:flex-row gap-3 mt-4"}`}>
           {nav.map((item, index) => {
            const video = videoUrl(item.url);
            if(pathname === item.url){
              return null;
            }
            return (  
             <div key={index} className={`overflow-hidden ${pathname === "/" ? "basis-1/4" : "basis-1/2"}`}>
               <Link onClick={() => {
                setShowNav?.(false)
               }} className={`relative text-primary flex rounded-2xl border border-white/25 justify-between bg-gradient-to-b  p-4 ${variant === "grid" ? "h-40 sm:h-60 from-black/90 to-black/0" : "h-100 from-black from-5% via-black via-20% to-black/0"}`} href={item.url}>
                {item.label}
                {video && <video src={video} autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover -z-10" />}
                <span className="bg-white text-black rounded-full p-2 w-8 h-8 flex items-center justify-center text-4xl">+</span>
              </Link>
             </div>
            );
          })}
         </div>
  );
};
