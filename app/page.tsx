import { Brand } from "@/src/components/Brand";
import { Gallery3DPentagon } from "@/src/components/Gallery3DPentagon";
import { Gallery3DOrbit } from "@/src/components/Gallery3DOrbit";
import { Nav } from "@/src/components/Nav";
import { ApiResponse } from "@/src/types/ApiResponse";
import { GalleryDataItem, GalleryImageItem } from "@/src/types/Gallery";
import { fetchAPI } from "@/src/utils/util.fetch.api";
import { Gallery3DDeck } from "@/src/components/Gallery3DDeck";
import { Gallery3DFloat } from "@/src/components/Gallery3DFloat";
import { Gallery3DOrbs } from "@/src/components/Gallery3DOrbs";



export default async function Home() {
  const galleryContent: ApiResponse<GalleryDataItem> = await fetchAPI({
        url: `/art`,
        method: "GET",
      });

  const randomNumber = Math.floor(Math.random() * 5) + 1;

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 w-full h-full">
        {randomNumber === 1 && <Gallery3DOrbit images={galleryContent.docs} />}
        {randomNumber === 2 && <Gallery3DPentagon images={galleryContent.docs}/>}
        {randomNumber === 3 && <Gallery3DDeck images={galleryContent.docs} />}
        {randomNumber === 4 && <Gallery3DFloat images={galleryContent.docs} />}
        {randomNumber === 5 && <Gallery3DOrbs images={galleryContent.docs} />}
      </div>
      <div className="relative z-20 gap-10 p-4 justify-between">
          <Brand />
      </div>
      <div className="absolute bottom-2 left-0 w-full">
        <Nav />
      </div>
    </div>
  );
}
