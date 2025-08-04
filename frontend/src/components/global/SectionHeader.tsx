import React from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import LastComm from "./LastComm";
// Import other components you want to support as rightComponent

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  TimeRangeSelector,
  LastComm,
  // Add more components here if needed
};

interface SectionHeaderProps {
  title: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  titleSize?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
  titleVariant?:
    | "default"
    | "primary"
    | "secondary"
    | "muted"
    | "success"
    | "warning"
    | "danger";
  titleWeight?:
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";
  titleAlign?: "left" | "center" | "right" | "justify";
  titleClassName?: string;
  defaultTitleHeight?: string;
  showTimeRange?: boolean;
  availableTimeRanges?: string[];
  selectedTimeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  timeRangeLabels?: Record<string, string>;
  // Icon for left side of title
  icon?: string | React.ReactNode;
  iconSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  iconClassName?: string;
  // Custom right component: ReactNode or PageC-style { name, props }
  rightComponent?:
    | React.ReactNode
    | { name: keyof typeof componentMap; props?: Record<string, unknown> };
  // Layout props
  layout?: "horizontal" | "vertical";
  className?: string;
  gap?: string;
  lastCommLabel?: string;
  lastCommValue?: string;
  iconBg?: string;
  // Right label props
  rightLabel?: string;
  rightLabelSize?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
  rightLabelVariant?:
    | "default"
    | "primary"
    | "secondary"
    | "muted"
    | "success"
    | "warning"
    | "danger";
  rightLabelWeight?:
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";
  // Alternative rightContent object structure
  rightContent?: {
    rightLabel?: string;
    rightLabelSize?:
      | "xs"
      | "sm"
      | "base"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl";
    rightLabelVariant?:
      | "default"
      | "primary"
      | "secondary"
      | "muted"
      | "success"
      | "warning"
      | "danger";
    rightLabelWeight?:
      | "light"
      | "normal"
      | "medium"
      | "semibold"
      | "bold"
      | "extrabold";
  };
  // Multiple right labels with click handlers
  rightLabels?: Array<{
    label: string;
    size?:
      | "xs"
      | "sm"
      | "base"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl";
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "muted"
      | "success"
      | "warning"
      | "danger";
    weight?:
      | "light"
      | "normal"
      | "medium"
      | "semibold"
      | "bold"
      | "extrabold";
    className?: string;
    onClick?: () => void;
    separator?: string; // Text to show between labels (e.g., "|", "•", etc.)
  }>;
  // Split title props for different styling
  titleParts?: {
    prefix?: string;
    suffix?: string;
    suffixVariant?: "default" | "primary" | "secondary" | "muted" | "success" | "warning" | "danger";
    suffixClassName?: string;
    suffixOnClick?: () => void;
  };
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  titleLevel = 2,
  titleSize = "md",
  titleVariant = "primary",
  titleWeight = "bold",
  titleAlign = "left",
  titleClassName,
  defaultTitleHeight = "h-12",
  showTimeRange = false,
  availableTimeRanges,
  selectedTimeRange,
  onTimeRangeChange,
  timeRangeLabels = {},
  icon,
  iconSize = "lg",
  iconClassName = "",
  rightComponent,
  layout = "horizontal",
  className = "",
  gap = "gap-4",
  lastCommLabel,
  lastCommValue,
  iconBg = "bg-white",
  rightLabel,
  rightLabelSize = "sm",
  rightLabelVariant = "muted",
  rightLabelWeight = "normal",
  rightContent,
  rightLabels,
  titleParts,
}) => {
  const containerClasses =
    layout === "horizontal"
      ? `flex items-center justify-between ${gap} ${className}`
      : `flex flex-col items-start ${gap} ${className}`;

  // Helper to render PageC-style rightComponent
  const renderRightComponent = (comp: unknown): React.ReactNode => {
    if (React.isValidElement(comp)) return comp;
    if (comp && typeof comp === "object" && "name" in comp) {
      // Type assertion for comp as { name: string; props?: Record<string, unknown> }
      const { name, props } = comp as {
        name: string;
        props?: Record<string, unknown>;
      };
      const Comp = componentMap[name];
      if (Comp) return <Comp {...(props || {})} />;
      return null;
    }
    // Only return if comp is a valid ReactNode
    if (typeof comp === "string" || typeof comp === "number" || comp === null)
      return comp;
    return null;
  };

  // Helper to render icon
  const renderIcon = (): React.ReactNode => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return icon;
    }

    if (typeof icon === "string") {
      const iconSizeClasses = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        base: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8",
        "2xl": "w-10 h-10",
      };

      return (
        <div className={`${iconBg} rounded-full p-1`}> 
          <img
            src={`/icons/${icon}.svg`}
            alt={icon}
            className={`${iconSizeClasses[iconSize]} ${iconClassName}`}
          />
        </div>
      );
    }

    return null;
  };

  // Default height for title if not provided
  const effectiveTitleClassName = titleClassName
    ? titleClassName
    : defaultTitleHeight
    ? `${defaultTitleHeight} flex items-center`
    : "h-12 flex items-center";

  // Dynamically select the heading tag based on titleLevel
  const safeTitleLevel = Math.min(Math.max(Number(titleLevel) || 2, 1), 6); // Ensure 1-6
  // const Tag = `h${safeTitleLevel}`;

  // Helper to generate suffix classes
  const generateSuffixClasses = (variant: string): string => {
    const variantClasses = {
      default: "text-gray-900 dark:text-white",
      primary: "text-primary dark:text-primary-light",
      secondary: "text-gray-700 dark:text-gray-300",
      muted: "text-gray-500 dark:text-gray-400",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      danger: "text-red-600 dark:text-red-400",
    };
    return variantClasses[variant as keyof typeof variantClasses] || "";
  };

  // Create title content
  let titleContent: string | React.ReactElement = title;
  if (titleParts?.prefix && titleParts?.suffix) {
    const suffixClasses = generateSuffixClasses(titleParts.suffixVariant || "success");
    const suffixElement = titleParts.suffixOnClick ? (
      <span 
        className={`${suffixClasses} cursor-pointer hover:opacity-80 ${titleParts.suffixClassName || ""}`}
        onClick={titleParts.suffixOnClick}
      >
        {titleParts.suffix}
      </span>
    ) : (
      <span className={`${suffixClasses} ${titleParts.suffixClassName || ""}`}>
        {titleParts.suffix}
      </span>
    );
    
    titleContent = (
      <div className="flex items-center gap-2">
        {titleParts.prefix}
        {suffixElement}
      </div>
    );
  }

  const finalTitleClassName = `
                ${titleSize === "xs" ? "text-xs" : ""}
                ${titleSize === "sm" ? "text-sm" : ""}
                ${titleSize === "base" ? "text-base" : ""}
                ${titleSize === "lg" ? "text-lg" : ""}
                ${titleSize === "xl" ? "text-xl" : ""}
                ${titleSize === "2xl" ? "text-2xl" : ""}
                ${titleSize === "3xl" ? "text-3xl" : ""}
                ${titleSize === "4xl" ? "text-4xl" : ""}
                ${titleSize === "5xl" ? "text-5xl" : ""}
                ${titleSize === "6xl" ? "text-6xl" : ""}
                ${titleWeight === "light" ? "font-light" : ""}
                ${titleWeight === "normal" ? "font-normal" : ""}
                ${titleWeight === "medium" ? "font-medium" : ""}
                ${titleWeight === "semibold" ? "font-semibold" : ""}
                ${titleWeight === "bold" ? "font-bold" : ""}
                ${titleWeight === "extrabold" ? "font-extrabold" : ""}
                ${
                  titleVariant === "default"
                    ? "text-gray-900 dark:text-white"
                    : ""
                }
                ${
                  titleVariant === "primary"
                    ? "text-primary dark:text-primary-light"
                    : ""
                }
                ${
                  titleVariant === "secondary"
                    ? "text-gray-700 dark:text-gray-300"
                    : ""
                }
                ${
                  titleVariant === "muted"
                    ? "text-gray-500 dark:text-gray-400"
                    : ""
                }
                ${
                  titleVariant === "success"
                    ? "text-green-600 dark:text-green-400"
                    : ""
                }
                ${
                  titleVariant === "warning"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : ""
                }
                ${
                  titleVariant === "danger"
                    ? "text-red-600 dark:text-red-400"
                    : ""
                }
                ${titleAlign === "left" ? "text-left" : ""}
                ${titleAlign === "center" ? "text-center" : ""}
                ${titleAlign === "right" ? "text-right" : ""}
                ${titleAlign === "justify" ? "text-justify" : ""}
                ${effectiveTitleClassName}
            `
        .replace(/\s+/g, " ")
        .trim();

  // Create title element using JSX
  const createTitleElement = () => {
    const props = {
      className: finalTitleClassName,
    };
    
    switch (safeTitleLevel) {
      case 1:
        return <h1 {...props}>{titleContent}</h1>;
      case 2:
        return <h2 {...props}>{titleContent}</h2>;
      case 3:
        return <h3 {...props}>{titleContent}</h3>;
      case 4:
        return <h4 {...props}>{titleContent}</h4>;
      case 5:
        return <h5 {...props}>{titleContent}</h5>;
      case 6:
        return <h6 {...props}>{titleContent}</h6>;
      default:
        return <h2 {...props}>{titleContent}</h2>;
    }
  };

  const titleElement = createTitleElement();

  // Helper to generate label classes
  const generateLabelClasses = (
    size: string,
    variant: string,
    weight: string
  ): string => {
    const sizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
    };

    const variantClasses = {
      default: "text-gray-900 dark:text-white",
      primary: "text-primary dark:text-primary-light",
      secondary: "text-gray-700 dark:text-gray-300",
      muted: "text-gray-500 dark:text-gray-400",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      danger: "text-red-600 dark:text-red-400",
    };

    const weightClasses = {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    };

    return `${sizeClasses[size as keyof typeof sizeClasses] || ""} ${
      variantClasses[variant as keyof typeof variantClasses] || ""
    } ${weightClasses[weight as keyof typeof weightClasses] || ""}`.trim();
  };

  // Determine what to render on the right
  let rightContentElement = null;
  
  // Check for multiple right labels first
  if (rightLabels && rightLabels.length > 0) {
    rightContentElement = (
      <div className="flex items-center gap-4">
        {rightLabels.map((labelConfig, index) => (
          <React.Fragment key={index}>
            <span 
              className={`${generateLabelClasses(
                labelConfig.size || "sm", 
                labelConfig.variant || "success", 
                labelConfig.weight || "normal"
              )} ${labelConfig.className || ""} ${labelConfig.onClick ? "cursor-pointer hover:opacity-80" : ""}`}
              onClick={labelConfig.onClick}
            >
              {labelConfig.label}
            </span>
            {labelConfig.separator && index < rightLabels.length - 1 && (
              <span className={`${generateLabelClasses(
                labelConfig.size || "sm", 
                labelConfig.variant || "success", 
                labelConfig.weight || "normal"
              )}`}>
                {labelConfig.separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  } else if (rightContent && typeof rightContent === 'object' && 'rightLabel' in rightContent) {
    const { rightLabel: nestedLabel, rightLabelSize: nestedSize = "sm", rightLabelVariant: nestedVariant = "muted", rightLabelWeight: nestedWeight = "normal" } = rightContent;
    if (nestedLabel) {
      rightContentElement = (
        <span className={generateLabelClasses(nestedSize, nestedVariant, nestedWeight)}>
          {nestedLabel}
        </span>
      );
    }
  } else if (rightComponent) {
    rightContentElement = renderRightComponent(rightComponent);
  } else if (rightLabel) {
    rightContentElement = (
      <span className={generateLabelClasses(rightLabelSize, rightLabelVariant, rightLabelWeight)}>
        {rightLabel}
      </span>
    );
  } else if (lastCommLabel && lastCommValue) {
    rightContentElement = (
      <span className="text-sm text-gray-500">
        {lastCommLabel}: {lastCommValue}
      </span>
    );
  } else if (showTimeRange) {
    rightContentElement = (
      <TimeRangeSelector
        availableTimeRanges={availableTimeRanges || ["Daily", "Monthly"]}
        selectedTimeRange={selectedTimeRange || "Daily"}
        handleTimeRangeChange={onTimeRangeChange || (() => {})}
        timeRangeLabels={timeRangeLabels}
      />
    );
  }

  return (
    <div className={containerClasses}>
      <div className={` ${ titleClassName || "flex-1 h-full flex items-center gap-2"}`}>
        {renderIcon()}
        {titleElement}
      </div>
      {rightContentElement && <div className="flex-shrink-0">{rightContentElement}</div>}
    </div>
  );
};

export default SectionHeader;
