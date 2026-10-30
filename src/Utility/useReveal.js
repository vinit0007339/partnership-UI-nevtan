import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const inViewport = (node) => {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

/**
 * Fades a block in the first time it scrolls into view. Content is visible by default — in the
 * server HTML, without JS, with reduced motion, and when it is already on screen — and is only
 * hidden ("armed") when it starts below the fold.
 */
export default function useReveal() {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion() || typeof IntersectionObserver === "undefined" || inViewport(node)) {
      return undefined;
    }
    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, !armed || shown, armed];
}
