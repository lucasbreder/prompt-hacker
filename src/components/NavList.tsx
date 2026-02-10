"use client";
import Link from "next/link";
import { NavItem } from "../types/Nav";
import { videoUrl } from "../utils/util.show.video";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const NavList = ({ nav, variant = "grid", setShowNav }: { nav: NavItem[]; variant?: "grid" | "list"; setShowNav?: (show: boolean) => void }) => {

  const pathname = usePathname();

  return (
    <div className="min-w-[100%] max-w-fit sm:max-w-[100%] mx-auto">
      <div className={`sm:max-w-[1200px] sm:mx-auto ${variant === "grid" ? " grid grid-cols-2 gap-x-5 gap-y-3 mt-4 sm:flex sm:flex-row sm:gap-5" : "flex flex-col sm:flex-row gap-3 mt-4"}`}>
        {nav.map((item, index) => {
          const video = videoUrl(item.url);
          if (pathname === item.url && pathname !== "/") {
            return null;
          }
          return (
            <div key={index} className={`overflow-hidden sm ${pathname === "/" ? "basis-1/4" : "basis-1/2"}`}>
              <Link onClick={() => {
                setShowNav?.(false)
              }} className={`overflow-hidden relative text-primary flex rounded-2xl border border-white/25 justify-between bg-gradient-to-b  p-4 ${variant === "grid" ? "h-40 sm:h-60 from-5% from-20% from-black/100 to-black/0" : "h-85 from-black from-5% via-black via-20% to-black/0"}`} href={item.url}>
                {item.label}
                {video && <video src={video} autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover -z-10" />}
                <span className="bg-white text-black rounded-full p-2 w-8 h-8 flex items-center justify-center text-4xl">+</span>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-2 mt-5 border border-white/20 rounded-2xl p-4 opacity-100 relative opacity-0 sm:max-w-[1200px] sm:mx-auto ">
        <div className="flex flex-col items-center gap-2 bg-[url(/nav-bg.png)] bg-linear-to-b from-black/75 to-black/90 bg-blend-multiply bg-cover bg-position-[center_top_20rem] absolute top-0 left-0 w-full h-full -z-10 opacity-10"></div>
        <p className="text-primary text-[20px]">Participe do projeto</p>
        <p className="text-white flex flex-col justify-center items-center sm:flex-row gap-2 text-center">Entre em contato via:
          <Link className="flex items-center gap-2" href="#"><Image src="/icons/instagram.svg" width={15} height={15} alt="Instagram" /> @‌xpto</Link> ou
          <Link className="flex items-center gap-2" href="#"><Image src="/icons/mail.svg" width={15} height={15} alt="Mail" /> email@email.com</Link>
        </p>
      </div>
    </div >
  );
};
