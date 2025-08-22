import { useState, useEffect } from 'react';

interface Slide {
  image: string;
  title: string;
  description: string;
}

const LoginSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const slides: Slide[] = [
    {
      image: '/images/Slider1.jpg',
      title: 'Smarter Energy Management',
      description:
        'Optimize energy use with real-time monitoring, anomaly detection, and a centralized dashboard for smarter, cost-effective decisions.',
    },
    {
      image: '/images/Slider2.jpg',
      title: 'Stay Connected, Stay Informed',
      description:
        'Access billing history, payment details, and real-time updates. Get instant reminders and manage energy anytime with complete flexibility.',
    },
    {
      image: '/images/Slider3.jpg',
      title: 'Your Energy, Your Control',
      description:
        'Track usage, monitor savings, and stay in charge with intuitive dashboards, instant insights, and easy access anytime, anywhere.',
    },
    // {
    //   image: '/images/meter-eval.jpg',
    //   title: 'Powering Your Experience, Effortlessly',
    //   description:
    //     'Manage your account, track bills, and control energy usage—all in one seamless dashboard with real-time insights and secure access.',
    // },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setFadeIn(true);
      }, 300);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSlideChange = (index: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFadeIn(true);
    }, 300);
  };

  return (
    <div className="w-full h-full overflow-hidden rounded-2xl relative">
      <div
        className={`transition-opacity duration-500 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="w-full h-full relative">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-contain"
          />
          {/* <div className="absolute bottom-10 left-0 w-full bg-[#005c8ebd] text-white p-8 z-10 dark:bg-opacity-80">
            <h2 className="text-3xl italic mb-4 w-[70%]">
              {slides[currentSlide].title}
            </h2>
            <p className="text-base w-[70%] leading-6">
              {slides[currentSlide].description}
            </p>
          </div> */}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => handleSlideChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginSlider;
