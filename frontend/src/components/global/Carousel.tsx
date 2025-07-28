import React, { useState, useEffect, useRef } from 'react';

export interface CarouselSlide {
  title: string;
  description: string;
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
    <div className="flex flex-col items-center justify-center h-full bg-primary-light dark:bg-primary-dark-light p-8">
      <img src={slides[current].img} alt={slides[current].title} className="rounded-xl mb-4 w-80 h-60 object-cover" />
      <h3 className="text-xl font-bold mb-2 text-primary dark:text-white">{slides[current].title}</h3>
      <p className="mb-4 text-neutral-dark dark:text-neutral-light">{slides[current].description}</p>
    </div>
  );
};

export default Carousel; 