import { RefObject, useEffect } from "react";

export function useFadeInUp<T extends HTMLElement>(
  ref: RefObject<T | null>,
  delayMs = 0
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delayMs) el.style.transitionDelay = `${delayMs}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delayMs]);
}
