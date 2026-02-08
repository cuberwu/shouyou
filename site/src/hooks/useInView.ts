"use client";

import { useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  /** Visibility ratio to trigger (0–1). Default: 0.1 */
  threshold?: number;
  /** Fire only once, then disconnect. Default: true */
  once?: boolean;
  /** IntersectionObserver rootMargin. Default: "0px" */
  rootMargin?: string;
};

/**
 * Lightweight hook that reports whether a DOM element is inside the viewport.
 *
 * Usage:
 * ```tsx
 * const { ref, isInView } = useInView();
 * <div ref={ref} className={isInView ? "animate-fade-in-up" : "opacity-0"} />
 * ```
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.1, once = true, rootMargin = "0px" } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once, rootMargin]);

  return { ref, isInView };
}
