"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { GalleryDataItem } from '../types/Gallery';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GalleryListProps {
  images: GalleryDataItem[];
}

export const GalleryList: React.FC<GalleryListProps> = ({ images }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter out items without art or url if necessary, ensuring we have valid data
  const validImages = images.filter(item => item.art && item.art.url);

  return (
    <div className="w-full sm:max-w-[1200px] sm:mx-auto h-full  text-[#ededed] flex flex-col font-mono relative overflow-hidden py-20 sm:py-40">
        {/* Floating Image Preview */}
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
             <AnimatePresence mode="wait">
                {hoveredIndex !== null && validImages[hoveredIndex] && (
                    <motion.div
                        key={hoveredIndex}
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: Math.random() * 10 - 5 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        className="w-[300px] h-[400px] bg-gray-600 shadow-2xl overflow-hidden border-4 border-white/10 rounded-sm"
                        style={{
                             marginLeft: Math.random() * 100 - 50,
                             marginTop: Math.random() * 100 - 50,
                        }}
                    >
                        <Image 
                            src={validImages[hoveredIndex].art.url} 
                            alt={validImages[hoveredIndex].title}
                            className="w-full h-full object-cover"
                            width={300}
                            height={400}
                        />
                    </motion.div>
                )}
             </AnimatePresence>
        </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-6 md:px-0 py-4 z-20 hide-scroll">
        <div className="flex flex-col gap-4 pb-20">
            {validImages.map((item, index) => (
                <Link 
                    href={`/arte/${item.slug}`} 
                    key={item.slug}
                    className="group border-b border-white/20 pb-4 flex items-center justify-between hover:border-white/60 transition-colors"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <span className="text-lg md:text-xl font-medium truncate pr-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        {item.title.toUpperCase()}
                    </span>
                    <ArrowUpRightIcon className="text-primary w-6 h-6 opacity-100 group-hover:opacity-100 transition-opacity group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
                </Link>
            ))}
        </div>
      </div>

    </div>
  );
};

// Simple SVG Icons
const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

