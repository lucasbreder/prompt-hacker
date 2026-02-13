"use client";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LightboxProps {
  images: { url: string; width: number; height: number; caption?: string }[];
  initialIndex: number;
  onClose: () => void;
}

export const Lightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose, images.length]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-10"
        onClick={onClose}
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-5 right-5 z-[110] text-white hover:text-gray-300 transition-colors p-2"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </motion.button>

        {images.length > 1 && (
          <>
            <button
              className="absolute left-5 z-[110] text-white hover:text-gray-300 transition-colors p-2 bg-white/10 rounded-full backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button
              className="absolute right-5 z-[110] text-white hover:text-gray-300 transition-colors p-2 bg-white/10 rounded-full backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % images.length);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full sm:h-full max-w-5xl max-h-[75vh] pointer-events-auto" style={{aspectRatio:images[currentIndex].width / images[currentIndex].height }}>
            <Image
              src={images[currentIndex].url}
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>
          {images[currentIndex].caption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-center pointer-events-auto"
            >
              <p className="text-white text-sm font-light leading-relaxed">
                {images[currentIndex].caption}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-light">
          {currentIndex + 1} / {images.length}
        </div> */}
      </motion.div>
    </AnimatePresence>
  );
};
