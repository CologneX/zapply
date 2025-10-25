"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollContainerProps {
  children: React.ReactNode;
  containerClassName?: string;
  showBlur?: boolean;
}

export function ScrollContainer({
  children,
  containerClassName,
  showBlur = true,
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(false);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

    // Show left blur if scrolled from start
    setShowLeftBlur(scrollLeft > 0);

    // Show right blur if not at end
    setShowRightBlur(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial check
    handleScroll();

    // Add scroll listener
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      {/* Left Blur */}
      {showBlur && (
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10 transition-opacity duration-300",
            "bg-linear-to-r from-background to-transparent",
            showLeftBlur ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className={cn(
          "overflow-x-auto overflow-y-hidden scrollbar-hide",
          containerClassName
        )}
      >
        <div className="flex gap-4 pb-2">{children}</div>
      </div>

      {/* Right Blur */}
      {showBlur && (
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10 transition-opacity duration-300",
            "bg-linear-to-l from-background to-transparent",
            showRightBlur ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
