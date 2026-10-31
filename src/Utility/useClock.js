import { useEffect, useState } from "react";

export default function useClock(until) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!until) return undefined;
    let interval = null;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= until && interval) clearInterval(interval);
    };
    const first = setTimeout(tick, 0);
    interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [until]);

  return now;
}
