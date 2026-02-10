import { ApiResponse } from "../types/ApiResponse";
import { NavItem } from "../types/Nav";
import { fetchAPI } from "../utils/util.fetch.api";
import { NavList } from "./NavList";
import Image from "next/image";
export const Footer = async ({
  title,
  excerpt,
  showNav,
}: {
  title: string;
  excerpt: string;
  showNav?: boolean;
}) => {
  const nav: ApiResponse<NavItem> = await fetchAPI({
    url: "/nav",
    method: "GET",
  });
  return (
    <footer className="pt-10 pb-30 px-4 flex flex-col gap-10 justify-center w-full">
      {showNav && <div className="w-fit min-w-[100%] sm:min-w-[70%] mx-auto"><NavList nav={nav.docs} variant="list" /></div>}
      <div className="flex justify-center mt-15 -mb-15 w-[200px] sm:w-[200px] h-[100px] relative mx-auto"><Image src="/brand/footer-brand.svg" alt="" fill className="object-contain" /></div>
    </footer>
  );
};
