export const VideoBackground = ({ videoSrc }: { videoSrc: string }) => {
  return (
    <div className="w-full h-full -z-10 absolute top-0 left-0">
      <div className="opacity-60 w-full h-full">
        <div className="w-full h-full bg-[url('/pattern.jpg')] mix-blend-multiply absolute"></div>
        <video className="w-full h-full object-cover pointer-events-none" autoPlay muted loop playsInline>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};
