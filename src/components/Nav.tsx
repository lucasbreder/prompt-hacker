import Link from "next/link";
import { ApiResponse } from "../types/ApiResponse";
import { NavItem } from "../types/Nav";
import { fetchAPI } from "../utils/util.fetch.api";
import { NavDetail } from "./NavDetail";

export const Nav = async ({variant}: {variant?: "grid" | "list"}) => {
  const nav: ApiResponse<NavItem> = await fetchAPI({
    url: "/nav?where[type][equals]=principal&sort=id",
    method: "GET",
  });
  return (
    <div className="text-primary flex flex-row gap-6 relative z-20 w-full">
      <NavDetail nav={nav.docs} variant={variant} />
    </div>
  );
};
