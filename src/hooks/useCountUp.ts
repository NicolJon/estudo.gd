import { useEffect, useRef, useState } from 'react';

export function useCountUp(end: number, duration: number = 1500, startOnView: boolean = true): number {
  const [value, setValue] = useState(0);
  const ref = useRef<boolean>(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) return;
    
    const animate = () => {
      ref.current = true;
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!startOnView) {
      animate();
      return;
    }

    // Small delay to ensure mount
    const timer = setTimeout(animate, 200);
    return () => clearTimeout(timer);
  }, [end, duration, startOnView]);

  return value;
}
