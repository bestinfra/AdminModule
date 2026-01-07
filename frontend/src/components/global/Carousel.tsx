import React, { useState, useEffect, useRef } from 'react';

export interface CarouselSlide {
  title: string;
  img: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-primary-light dark:bg-primary-dark-light  rounded-3xl">
      <img 
        src={slides[current].img} 
        alt={slides[current].title} 
        className="rounded-3xl object-cover w-full h-full" 
      />
    </div>
  );
};

export default Carousel; 