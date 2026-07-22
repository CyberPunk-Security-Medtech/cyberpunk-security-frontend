"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ResponsiveTableRegionProps = {
  children: ReactNode;
  label: string;
  className?: string;
};

export default function ResponsiveTableRegion({
  children,
  label,
  className = "",
}: ResponsiveTableRegionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const hasOverflow = element.scrollWidth > element.clientWidth + 1;
    setCanScroll(hasOverflow);
    setCanScrollLeft(hasOverflow && element.scrollLeft > 1);
    setCanScrollRight(
      hasOverflow &&
        element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateScrollState();
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);
    const table = element.querySelector("table");
    if (table) resizeObserver.observe(table);

    return () => resizeObserver.disconnect();
  }, [children, updateScrollState]);

  return (
    <div className={`min-w-0 ${className}`.trim()}>
      {canScroll && (
        <p className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500 sm:hidden">
          <span aria-hidden="true">↔</span>
          Swipe to view more
        </p>
      )}

      <div className="relative min-w-0">
        <div
          ref={scrollRef}
          role="region"
          aria-label={label}
          tabIndex={canScroll ? 0 : undefined}
          onScroll={updateScrollState}
          className="dashboard-table-scroll min-w-0 overflow-x-auto overscroll-x-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dashboard-accent,#1A2380)] focus-visible:ring-inset"
        >
          {children}
        </div>

        {canScrollLeft && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-5 bg-gradient-to-r from-slate-300/35 to-transparent"
          />
        )}
        {canScrollRight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-5 bg-gradient-to-l from-slate-300/35 to-transparent"
          />
        )}
      </div>
    </div>
  );
}
