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
import { ShowRandomGallery } from "@/src/components/ShowRandomGallery";



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
      <div className="absolute bottom-2 left-0 w-full">
        <Nav />
      </div>
    </div>
  );
}
