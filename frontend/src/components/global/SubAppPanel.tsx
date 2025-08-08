import React, { useState, useEffect, useRef } from "react";
type Module = {
  name: string;
  route?: string;
};

type ApiConnection = {
  name: string;
  status: "connected" | "disconnected" | "error";
};

type MeterStats = {
  total: number;
  active: number;
  inactive: number;
};

type TicketStatus = {
  count: number;
  href?: string;
};

type SubappPanelProps = {
  appName: string;
  appId: string;
  subdomain: string;
  health: "Live" | "Down" | "Maintenance";
  status: "Active" | "Inactive";
  created: string;
  updated: string;
  company: string;
  website: string;
  category: string;
  modules: Module[];
  connectedApis: ApiConnection[];
  meters: MeterStats;
  tickets: TicketStatus;
  appIcon: string;
};

const SubappPanel: React.FC<SubappPanelProps> = ({
  appName,
  appId,
  subdomain,
  health,
  status,
  created,
  updated,
  company,
  website,
  category,
  modules,
  connectedApis,
  meters,
  tickets,
  appIcon,
}) => {
  // Calculate percentages for meter stats
  const activePercentage = meters?.total > 0 ? (meters.active / meters.total) * 100 : 0;
  const inactivePercentage = meters?.total > 0 ? (meters.inactive / meters.total) * 100 : 0;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleViewDetails = () => {
    // Handle view details action
    console.log("View details clicked");
    closeMenu();
  };

  const handleEdit = () => {
    // Handle edit action
    console.log("Edit clicked");
    closeMenu();
  };

  const handleVisitSite = () => {
    // Handle visit site action
    window.open(`https://${website}`, '_blank');
    closeMenu();
  };

  const handleDelete = () => {
    // Handle delete action
    console.log("Delete clicked");
    closeMenu();
  };

  const getHealthColor = (healthStatus: string) => {
    switch (healthStatus) {
      case "Live":
        return "bg-green-500";
      case "Down":
        return "bg-red-100";
      case "Maintenance":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "Active":
        return "text-green-600 bg-green-100";
      case "Inactive":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getApiStatusColor = (apiStatus: string) => {
    switch (apiStatus) {
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-gray-400";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };



  // Demo images for fallback
  const demoImages = [
    "/images/gmr-logo.png",
  ];

  // Get fallback image based on app name or category
  const getFallbackImage = () => {
    // If backend provides a valid image, use it
    if (appIcon && appIcon !== "" && appIcon !== "null" && appIcon !== "undefined") {
      return appIcon;
    }
    
    // Otherwise use category-based fallback
    const categoryLower = category?.toLowerCase() || "";
    if (categoryLower.includes("energy") || categoryLower.includes("power")) {
      return "/icons/alert-triggered.svg";
    } else if (categoryLower.includes("transport") || categoryLower.includes("railway")) {
      return "/icons/active-users.svg";
    } else if (categoryLower.includes("industrial") || categoryLower.includes("manufacturing")) {
      return "/icons/apps-add.svg";
    } else {
      // Random demo image based on app name hash
      const hash = appName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return demoImages[Math.abs(hash) % demoImages.length];
    }
  };

  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(getFallbackImage());

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      // If the backend image failed, try fallback images
      if (appIcon && appIcon !== "" && appIcon !== "null" && appIcon !== "undefined") {
        // Backend image failed, use category-based fallback
        const categoryLower = category?.toLowerCase() || "";
        if (categoryLower.includes("energy") || categoryLower.includes("power")) {
          setCurrentImage("/icons/alert-triggered.svg");
        } else if (categoryLower.includes("transport") || categoryLower.includes("railway")) {
          setCurrentImage("/icons/active-users.svg");
        } else if (categoryLower.includes("industrial") || categoryLower.includes("manufacturing")) {
          setCurrentImage("/icons/apps-add.svg");
        } else {
          // Use hash-based fallback
          const hash = appName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          setCurrentImage(demoImages[Math.abs(hash) % demoImages.length]);
        }
      } else {
        // Already using fallback, try next one
        const currentIndex = demoImages.indexOf(currentImage);
        const nextIndex = (currentIndex + 1) % demoImages.length;
        setCurrentImage(demoImages[nextIndex]);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl flex flex-col gap-4 border border-primary-border p-6 w-full">
      {/* Header Section */}
      <div className="flex items-start justify-between w-full items-center h-full gap-8">
        <div className="flex items-center gap-4 items-start">
          <div className="w-12 h-12 bg-background-secondary rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={currentImage} 
              alt="app-icon" 
              className="w-full h-full object-contain" 
              onError={handleImageError}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{appName}</h2>
            <p className="text-sm text-gray-500">{appId}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex flex-col items-center gap-2 ${getStatusColor(
              status
            )}`}
          >
            {/* Icon removed */}
            {status}
          </div>
        </div>
        <div className="relative">
          <span
            onClick={toggleMenu}
            className="bg-TextSecondary text-white px-3 py-1 h-full rounded-md text-sm font-medium flex items-center gap-2 hover:bg-opacity-80 transition-colors"
          >
            <img src="/icons/v-dots.svg" alt="menu" className="w-4 h-4" />
          </span>
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50" ref={menuRef}>
              <div className="py-1">
                <span
                  onClick={handleViewDetails}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                >
                  <img src="/icons/eye.svg" alt="view" className="w-4 h-4" />
                  View Details
                </span>
                <span
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                >
                  <img src="/icons/edit.svg" alt="edit" className="w-4 h-4" />
                  Edit
                </span>
                <span
                  onClick={handleVisitSite}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                >
                  <img src="/icons/globe.svg" alt="visit" className="w-4 h-4" />
                  Visit Site
                </span>
                <span
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <img src="/icons/delete.svg" alt="delete" className="w-4 h-4" />
                  Delete
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-10">
          {/* Core Information Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-col items-start">
                {/* Icon removed */}
                <span className="text-sm text-gray-600">Subdomain</span>
                <span className="text-sm font-medium text-gray-900">
                  {subdomain}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-col  items-start">
                {/* Icon removed */}
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium text-gray-900">
                  {created}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-col items-start">
                {/* Icon removed */}
                <span className="text-sm text-gray-600">Company</span>
                <span className="text-sm font-bold text-gray-900">
                  {company}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-col items-start ">
                {/* Icon removed */}
                <span className="text-sm text-gray-600">Category</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {category}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-col items-start">
                <span className="text-sm text-gray-600  "> Health</span>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      getHealthColor(health)
                    }`}
                  ></div>
                  {health}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-col items-start">
                {/* Icon removed */}
                <span className="text-sm text-gray-600">Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {updated}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-col items-start">
                {/* Icon removed */}
                <span className="text-sm text-gray-600">Website</span>
                <a
                  href={`https://${website}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {website}
                </a>
              </div>

              <div className="flex items-center gap-2 flex-col items-start">
                {/* Icon removed */}
                <span className="text-sm text-gray-600">Open Tickets</span>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {tickets.count}
                </span>
              </div>
            </div>
          </div>
        <div className="flex flex-col gap-4">
        
          {/* Modules Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-900 ">Modules</h3>
            <div className="flex flex-wrap gap-2">
              {modules.map((module, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {/* Icon removed */}
                  {module.name}
                </span>
              ))}
            </div>
          </div>
          {/* Connected APIs Section */}
          <div className="flex flex-col gap-4">
            
            <h3 className="text-sm font-medium text-gray-900">
              Connected APIs
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {connectedApis.map((api, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${getApiStatusColor(
                      api.status
                    )}`}
                    title={`${api.name}: ${api.status}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {
                  connectedApis.filter((api) => api.status === "connected")
                    .length
                }
                /{connectedApis.length}
              </span>
            </div>
          </div>
          {/* Total Meters Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 ">Total Meters</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                 Icon removed 
                  {meters?.total || 0}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                 Icon removed 
                  {meters?.active || 0}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
                 Icon removed 
                  {meters?.inactive || 0}
                </div>
                <div className="text-sm text-gray-600">Inactive</div>
              </div>
            </div>

            Progress Bar
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${activePercentage}%` }}
              ></div>
              <div
                className="bg-gray-400 h-2 rounded-full transition-all duration-300 -mt-2"
                style={{
                  width: `${inactivePercentage}%`,
                  marginLeft: `${activePercentage}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{activePercentage.toFixed(1)}% Active</span>
              <span>{inactivePercentage.toFixed(1)}% Inactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubappPanel;
