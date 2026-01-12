import Link from "next/link";
import { ApiResponse } from "../types/ApiResponse";
import { NavItem } from "../types/Nav";
import { fetchAPI } from "../utils/util.fetch.api";
import { NavDetail } from "./NavDetail";

export const Nav = async () => {
  const nav: ApiResponse<NavItem> = await fetchAPI({
    url: "/nav?where[type][equals]=principal&sort=id",
    method: "GET",
  });
  return (
    <div className="text-primary flex flex-col gap-6 mb-30">
      <NavDetail nav={nav.docs} />
    </div>
  );
};
