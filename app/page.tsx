import { Brand } from "@/src/components/Brand";
import { Nav } from "@/src/components/Nav";
import { NavDetail } from "@/src/components/NavDetail";
import { VideoBackground } from "@/src/components/VídeoBackground";
import { ApiResponse } from "@/src/types/ApiResponse";
import { NavItem } from "@/src/types/Nav";
import { fetchAPI } from "@/src/utils/util.fetch.api";

export default async function Home() {
  const navDatail: ApiResponse<NavItem> = await fetchAPI({
    url: "/nav?where[type][equals]=detalhe&sort=id",
    method: "GET",
  });

  return (
    <div className="w-full h-full">
      <VideoBackground videoSrc="/hacker-video.mp4" />
      <div className="basis-1/2 flex flex-col gap-10 pb-10 pt-20 p-5 justify-between h-full">
        <div>
          <Brand />
        </div>
        <div>
          <Nav />
          <NavDetail nav={navDatail.docs} />
        </div>
      </div>
    </div>
  );
}
