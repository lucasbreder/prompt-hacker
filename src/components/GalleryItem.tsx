import Image from "next/image";
import Link from "next/link";
import { GalleryPropsItem } from "../types/Gallery";

export const GalleryItem = ({ slug, art, title }: GalleryPropsItem) => {
  return (
    <div className="my-10">
      <div className="w-full h-40">
        <Link className="block w-full h-full relative" href={`/arte/${slug}`}>
          <Image className="object-cover object-center" src={art} fill alt="" />
        </Link>
      </div>
      <div className="text-lg mt-2 font-bold">
        <Link href={`/arte/${slug}`}>{title}</Link>
      </div>
    </div>
  );
};
