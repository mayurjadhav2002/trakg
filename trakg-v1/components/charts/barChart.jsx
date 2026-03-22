import React, { useMemo, forwardRef } from "react";
import { cn as cx, focusRing } from "@/lib/utils";

const BarList = forwardRef(
  (
    {
      data = [],
      valueFormatter = (value) => value.toString(),
      showAnimation = false,
      onValueChange,
      sortOrder = "descending",
      className,
      ...props
    },
    ref
  ) => {
    const Component = onValueChange ? "button" : "div";
    
    const sortedData = useMemo(() => {
      if (sortOrder === "none") return data;
      return [...data].sort((a, b) => (sortOrder === "ascending" ? a.value - b.value : b.value - a.value));
    }, [data, sortOrder]);

    const widths = useMemo(() => {
      const maxValue = Math.max(...sortedData.map((item) => item.value), 0);
      return sortedData.map((item) => (item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2)));
    }, [sortedData]);

    const rowHeight = "h-8";

    return (
      <div
        ref={ref}
        className={cx("flex justify-between space-x-6", className)}
        aria-sort={sortOrder}
        tremor-id="tremor-raw"
        {...props}
      >
        <div className="relative w-full space-y-1.5">
          {sortedData.map((item, index) => (
            <Component
              key={item.key ?? item.name}
              onClick={() => onValueChange?.(item)}
              className={cx(
                "group w-full rounded",
                focusRing,
                onValueChange && "!-m-0 cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-900"
              )}
            >
              <div
                className={cx(
                  "flex items-center rounded transition-all",
                  rowHeight,
                  "bg-blue-200 dark:bg-blue-900",
                  onValueChange && "group-hover:bg-blue-300 group-hover:dark:bg-blue-800",
                  {
                    "mb-0": index === sortedData.length - 1,
                    "duration-800": showAnimation,
                  }
                )}
                style={{ width: `${widths[index]}%` }}
              >
                <div className="absolute left-2 flex max-w-full pr-2">
                  {item.href ? (
                    <a
                      href={item.href}
                      className={cx(
                        "truncate whitespace-nowrap rounded text-sm",
                        "text-gray-900 dark:text-gray-50",
                        "hover:underline hover:underline-offset-2",
                        focusRing
                      )}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <p className="truncate whitespace-nowrap text-sm text-gray-900 dark:text-gray-50">
                      {item.name}
                    </p>
                  )}
                </div>
              </div>
            </Component>
          ))}
        </div>
        <div>
          {sortedData.map((item, index) => (
            <div
              key={item.key ?? item.name}
              className={cx("flex items-center justify-end", rowHeight, index === sortedData.length - 1 ? "mb-0" : "mb-1.5")}
            >
              <p className="truncate whitespace-nowrap text-sm leading-none text-gray-900 dark:text-gray-50">
                {valueFormatter(item.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default BarList;
