export const VideoBackground = ({ videoSrc }: { videoSrc: string }) => {
  return (
    <div className="w-full h-full -z-10 absolute bg-black">
      <div className="opacity-60 w-full h-full">
        <div className="w-full h-full bg-[url('/pattern.jpg')] mix-blend-multiply border-red-500 absolute"></div>
        <video className="w-full h-full object-cover" autoPlay muted loop>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};
