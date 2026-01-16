import { ApiResponse } from "../types/ApiResponse";
import { NavItem } from "../types/Nav";
import { fetchAPI } from "../utils/util.fetch.api";
import { NavList } from "./NavList";
import Image from "next/image";
export const Footer = async ({
  title,
  excerpt,
}: {
  title: string;
  excerpt: string;
}) => {
    const nav: ApiResponse<NavItem> = await fetchAPI({
      url: "/nav?where[type][equals]=principal&sort=id",
      method: "GET",
    });
  return (
    <footer className="pt-10 pb-30 px-4 flex flex-col gap-10 justify-center w-full">
      <div className="flex justify-center mt-15 -mb-15 w-[300px] sm:w-[400px] h-[100px] relative mx-auto"><Image src="/brand/footer-brand.svg" alt="" fill className="object-contain"/></div>
    </footer>
  );
};
