import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    const isDark = document.documentElement.classList.contains("dark-theme");
    setIsDarkMode(isDark);

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark-theme"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const getLogoPath = () => {
    if (customLogo) return customLogo;

    if (isCollapsed) {
      return isDarkMode
        ? "/images/bi-blue-logo.svg"
        : "/images/bi-white-logo.svg";
    }

    return isDarkMode
      ? "/images/bi-white-logo.svg"
      : "/images/bi-logo-latest.svg";
  };

  return (
    <div className="flex items-center justify-center p-4">
      <span
        className="cursor-pointer flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <div className="flex justify-center">
          <div className="bg-stat-icon-gradient p-4 rounded-full rotate-180 flex items-center justify-center w-[160px] h-[160px]">
            <div className="bg-white rounded-full flex items-center justify-center w-[110px] h-[110px] shadow-md border-neutral-light p-2 rotate-180">
              <div className="transition-transform duration-300 hover:scale-105 flex items-center justify-center w-[100px] h-[100px]">
                <img
                  src={getLogoPath()}
                  alt="Logo"
                  width={isCollapsed ? 120 : width}
                  height={isCollapsed ? 120 : undefined}
                  className={`transition-all duration-300 object-contain ${
                    isCollapsed ? "w-10 h-10" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </span>
    </div>
  );
};

export default Logo;
