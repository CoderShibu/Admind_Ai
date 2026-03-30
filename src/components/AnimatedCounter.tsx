import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  formatIndian?: boolean;
}

function formatNumber(n: number, decimals: number, formatIndian: boolean) {
  if (formatIndian) {
    const parts = n.toFixed(decimals).split(".");
    let intPart = parts[0];
    const lastThree = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    intPart = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (rest ? "," : "") + lastThree;
    return decimals > 0 ? intPart + "." + parts[1] : intPart;
  }
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0, duration = 1.5, formatIndian = false }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * value;
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono tabular-nums">
      {prefix}{formatNumber(display, decimals, formatIndian)}{suffix}
    </motion.span>
  );
}
