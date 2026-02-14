import { useRef, useState, useEffect } from "react";
import { Image as ImageType } from "../types/Image";
import { ArtProcessItem } from "./ArtProcessItem";

export const ArtProcessCarousel = ({ 
  items, 
  onItemClick 
}: { 
  items: ImageType[]; 
  onItemClick: (index: number) => void 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtStart(scrollLeft <= 0);
      // Use a small threshold (1px) for isAtEnd to handle rounding issues
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      // Initial check in case it's already at the end (e.g., few items)
      updateScrollButtons();
      
      // Also update on resize
      window.addEventListener('resize', updateScrollButtons);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const item = container.querySelector('.snap-center') as HTMLElement;
      if (item) {
        const itemWidth = item.offsetWidth + 16; // items width + gap-4 (16px)
        const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative group/carousel mb-10">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory px-5 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <div key={item.id} className="min-w-[80%] sm:min-w-[45%] snap-center">
            <ArtProcessItem
              item={item}
              index={index}
              onClick={onItemClick}
              className="w-full"
              process_layout="carousel"
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-6 z-20 px-5 py-5 sm:py-3 sm:px-0">
        <button 
          onClick={() => scroll('left')}
          disabled={isAtStart}
          className={`bg-primary cursor-pointer rounded-full text-black p-1 transition-all shadow-lg ${
            isAtStart ? 'opacity-50 cursor-default' : 'hover:bg-black hover:text-white'
          }`}
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <button 
          onClick={() => scroll('right')}
          disabled={isAtEnd}
          className={`bg-primary cursor-pointer rounded-full text-black p-1 transition-all shadow-lg ${
            isAtEnd ? 'opacity-50 cursor-default' : 'hover:bg-black hover:text-white'
          }`}
          aria-label="Próximo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
};