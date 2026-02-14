 import Image from "next/image";
 import { Image as ImageType } from "../types/Image";

export  const ArtProcessItem = ({ 
  item, 
  index, 
  onClick, 
  className = "",
  process_layout
}: { 
  item: ImageType; 
  index: number; 
  onClick: (index: number) => void;
  className?: string;
  process_layout: 'grid' | 'vertical' | 'carousel';
}) => (
  <div
    className={`text-center basis-1/2 text-[14px] relative cursor-pointer group overflow-hidden ${className} ${process_layout === "carousel" ? "h-full" : ""}`}
    style={{ aspectRatio: item.width / item.height }}
    onClick={() => onClick(index)}
  >
    {item.mimeType.startsWith("video/") ? (
      <>
        <video
          className="w-full h-full object-cover transition-transform duration-500"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={item?.url} type={item.mimeType} />
        </video>
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-0.5">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
        </div>
      </>
    ) : (
      <div className={`${process_layout === "carousel" ? "flex items-center h-full" : ""}`}>
        <Image
        className={`transition-transform duration-500 ${process_layout === "grid" ? "group-hover:scale-105" : ""} ${process_layout === "carousel" ? "object-contain" : "object-cover"}`}
        src={item?.url}
        fill
        alt=""
      />
      </div>
    )}
    {item.caption && (
      <div className="absolute inset-0 bg-linear-to-t from-black/85 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
        <p className="text-white text-sm font-light leading-snug text-center line-clamp-2">
          {item.caption}
        </p>
      </div>
    )}
  </div>
);

