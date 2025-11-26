import Link from "next/link";
import { ApiResponse } from "../types/ApiResponse";
import { NavItem } from "../types/Nav";
import { fetchAPI } from "../utils/util.fetch.api";

export const Nav = async () => {
  const nav: ApiResponse<NavItem> = await fetchAPI({
    url: "/nav?where[type][equals]=principal&sort=id",
    method: "GET",
  });
  return (
    <div className="text-primary flex flex-col gap-6 mb-30">
      {nav?.docs?.map((navItem, index) => {
        return (
          <div className="text-4xl" key={index}>
            <Link className="bg-black" href={navItem.url}>
              [ {navItem.label} ]
            </Link>
          </div>
        );
      })}
    </div>
  );
};
