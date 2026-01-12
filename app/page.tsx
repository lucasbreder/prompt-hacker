import { Brand } from "@/src/components/Brand";
import { Gallery3DPicute } from "@/src/components/Gallery3DPicute";
import { Nav } from "@/src/components/Nav";

export default async function Home() {
  return (
    <div className="w-full h-full relative">
      {/* <VideoBackground videoSrc="/hacker-video.mp4" /> */}
      <div className="absolute top-0 left-0 w-full h-full">
        <Gallery3DPicute/>
      </div>
      <div className="basis-1/2 flex flex-col gap-10 p-4 justify-between h-full">
          <Brand />
      </div>
      <Nav />
    </div>
  );
}
