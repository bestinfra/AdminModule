import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  width?: number;
  isCollapsed?: boolean;
  customLogo?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 140,
  isCollapsed = false,
  customLogo,
}) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detect initial theme
    const isDark = document.documentElement.classList.contains('dark-theme');
    setIsDarkMode(isDark);

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark-theme'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const getLogoPath = () => {
    if (customLogo) return customLogo;

    if (isCollapsed) {
      return isDarkMode
        ? '/images/bi-blue-logo.svg'
        : '/images/bi-white-logo.svg';
    }

    return isDarkMode
      ? '/images/bi-white-logo.svg'
      : '/images/bi-blue-logo.svg';
  };

  return (
    <div className="flex items-center justify-center p-4">
      <span
        className="cursor-pointer flex items-center justify-center"
        onClick={() => navigate('/')}
      >
        <img
          src={getLogoPath()}
          alt="Logo"
          width={isCollapsed ? 40 : width}
          height={isCollapsed ? 40 : undefined}
          className={`transition-all duration-300 object-contain ${isCollapsed ? 'w-10 h-10' : ''}`}
        />
      </span>
    </div>
  );
};

export default Logo;
