import React from "react";
import { BrandLetter } from "./BrandLetter";
import Link from "next/link";

export const Brand = () => {
  return (
    <div className="flex flex-col gap-2 relative h-15 sm:w-[1200px] sm:mx-auto sm:pt-10">
      <Link className="sm:hidden" href={"/"}>
        <div className="flex gap-1 items-end mb-2">
          <BrandLetter letter="p" time={800} />
          <BrandLetter letter="r" time={1800} />
          <BrandLetter letter="o" time={1500} />
          <BrandLetter letter="m" />
          <BrandLetter letter="p2" time={1700} />
          <BrandLetter letter="t" time={900} />
          <BrandLetter letter="e" time={1700} />
          <BrandLetter letter="r2" time={700} />
        </div>
        <div className="flex gap-1 items-end">
          <BrandLetter letter="h" time={1600} />
          <BrandLetter letter="a" time={1200} />
          <BrandLetter letter="c" time={1300} />
          <BrandLetter letter="k" time={1700} />
          <BrandLetter letter="e2" time={600} />
          <BrandLetter letter="r3" time={1500} />
          <div className="text-primary w-[70px] text-[6px] leading-[6px] self-center ml-3 -mb-1">
            Linguagem e IA Generativa como Campo de Disputa
          </div>
        </div>
      </Link>
      <Link className="hidden sm:block" href={"/"}>
        <div className="flex gap-1 items-end mb-2">
          <BrandLetter letter="p" time={800} height={30} />
          <BrandLetter letter="r" time={1800} height={30} />
          <BrandLetter letter="o" time={1500} height={30} />
          <BrandLetter letter="m" height={30} />
          <BrandLetter letter="p2" time={1700} height={30} />
          <BrandLetter letter="t" time={900} height={30} />
          <BrandLetter letter="e" time={1700} height={30} />
          <BrandLetter letter="r2" time={700} height={30} />
        </div>
        <div className="flex gap-1 items-end">
          <BrandLetter letter="h" time={1600} height={30}/>
          <BrandLetter letter="a" time={1200} height={30}/>
          <BrandLetter letter="c" time={1300} height={30}/>
          <BrandLetter letter="k" time={1700} height={30}/>
          <BrandLetter letter="e2" time={600} height={30}/>
          <BrandLetter letter="r3" time={1500} height={30}/>
          <div className="text-primary w-[85px] text-[9px] leading-[9px] self-center ml-3 -mb-2">
            Linguagem e IA Generativa como Campo de Disputa
          </div>
        </div>
      </Link>
    </div>
  );
};
