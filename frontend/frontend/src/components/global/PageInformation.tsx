import React from "react";

type LayoutType = "row" | "column" | "grid";

interface PageInformationItem {
  title: string;
  value: string | number;
  span?: { col?: number; row?: number };
  align?: "start" | "center" | "end" | "between";
  gap?: string;
  statusIndicator?: boolean; // New prop to show blinking status indicator
}

interface PageInformationRow {
  layout: LayoutType;
  className?: string;
  span?: { col?: number; row?: number };
  items: PageInformationItem[];
  gap?: string;
}

interface PageInformationProps {
  // Simple mode - single title/value
  title?: string;
  value?: string | number;
  layout?: "row" | "column";
  align?: "start" | "center" | "end" | "between";
  gap?: string;

  // Section header mode
  isSectionHeader?: boolean;
  className?: string;

  // Grid mode - multiple rows and items
  rows?: PageInformationRow[];
  gridColumns?: number;

  wrapperClassName?: string;
  style?: React.CSSProperties;
}

const getLayoutClass = (layout: LayoutType, gap?: string) => {
  const baseClass =
    layout === "row"
      ? "flex flex-row"
      : layout === "column"
      ? "flex flex-col"
      : "grid";
  return `${baseClass} ${gap || ""}`;
};

const getAlignClass = (align?: "start" | "center" | "end" | "between") => {
  switch (align) {
    case "start":
      return "items-start";
    case "center":
      return "items-center";
    case "end":
      return "items-end";
    case "between":
      return "justify-between";
    default:
      return "items-start";
  }
};

const getSpanClasses = (span?: { col?: number; row?: number }) => {
  if (!span) return "";
  const classes = [];
  if (span.col) classes.push(`col-span-${span.col}`);
  if (span.row) classes.push(`row-span-${span.row}`);
  return classes.join(" ");
};

const PageInformation: React.FC<PageInformationProps> = ({
  // Simple mode props
  title,
  value,
  layout = "column",
  align = "start",
  gap = "gap-1",

  // Section header mode
  isSectionHeader,
  className,

  // Grid mode props
  rows,
  gridColumns,

  wrapperClassName = "",
  style = {},
}) => {
  // Simple mode - single title/value
  if (title && value && !rows) {
    const layoutClass = getLayoutClass(layout, gap);
    const alignClass = getAlignClass(align);

    return (
      <div className={`w-full h-full ${wrapperClassName}`} style={style}>
        <div className={`${layoutClass} ${alignClass}`}>
          <div className="text-sm font-medium text-gray-600">{title}</div>
          <div className="text-base text-gray-900">{value}</div>
        </div>
      </div>
    );
  }

  // Section header mode
  if (isSectionHeader) {
    return (
      <div className={`w-full h-full ${wrapperClassName}`} style={style}>
        <div className={`${className || "text-sm font-medium text-gray-600"}`}>
          {title}
        </div>
      </div>
    );
  }

  // Grid mode - multiple rows and items
  if (rows) {
    const gridClass = gridColumns ? `grid-cols-${gridColumns}` : "";

    return (
      <div className={`w-full h-full ${wrapperClassName}`} style={style}>
        <div className={`grid ${gridClass} gap-4`}>
          {rows.map((row, rowIndex) => {
            const rowLayoutClass = getLayoutClass(row.layout, row.gap);
            const rowSpanClasses = getSpanClasses(row.span);

            return (
              <div
                key={rowIndex}
                className={`${rowLayoutClass} ${rowSpanClasses} ${
                  row.className || ""
                }`}
              >
                {row.items.map((item, itemIndex) => {
                  const itemAlignClass = getAlignClass(item.align);
                  const itemSpanClasses = getSpanClasses(item.span);
                  const itemGap = item.gap || "gap-1";

                  return (
                    <div
                      key={itemIndex}
                      className={`flex flex-col w-full ${itemGap} ${itemAlignClass} ${itemSpanClasses}`}
                    >
                      <div className="text-md font-normal text-TextSecondary">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2">
                      {item.statusIndicator && (
                          <div className="w-2 h-2 bg-green-500 rounded-full blink"></div>
                        )}
                        <div className="text-sm text-gray-900">
                          {item.value}
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default PageInformation;
