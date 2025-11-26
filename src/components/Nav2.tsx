import Link from "next/link";
import { NavItem } from "../types/Nav";

export const Nav2 = ({ nav }: { nav: NavItem[] }) => {
  return (
    <div className="text-primary flex flex-col gap-2">
      {nav?.map((navItem, index) => {
        return (
          <div className="text-xl uppercase" key={index}>
            <Link href={navItem.url}>{navItem.label}</Link>
          </div>
        );
      })}
    </div>
  );
};
