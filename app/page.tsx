import { Brand } from "@/src/components/Brand";
import { Nav } from "@/src/components/Nav";
import { ApiResponse } from "@/src/types/ApiResponse";
import { GalleryDataItem } from "@/src/types/Gallery";
import { fetchAPI } from "@/src/utils/util.fetch.api";
import { ShowRandomGallery } from "@/src/components/ShowRandomGallery";
import { AiChat } from "@/src/components/AiChat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Prompter Hacker',
};



export default async function Home() {
  const galleryContent: ApiResponse<GalleryDataItem> = await fetchAPI({
    url: `/art`,
    method: "GET",
  });

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <ShowRandomGallery galleryContent={galleryContent} />
      </div>
      <div className="relative z-20 gap-10 p-4 justify-between">
        <Brand />
      </div>
      <div className="absolute bottom-0 pb-4 left-1/2 translate-x-[-50%] justify-between w-full flex gap-2 z-20 px-2 max-w-[1200px]">
        <Nav />
        <AiChat isFloat={false} />
      </div>
    </div>
  );
}
