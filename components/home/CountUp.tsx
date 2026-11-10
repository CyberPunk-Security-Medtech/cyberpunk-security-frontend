"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  /** A display value such as "10,000+" or "98%"; the number is animated, the rest kept. */
  value: string;
  duration?: number;
};

const parse = (value: string) => {
  const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const decimals = digits.split(".")[1]?.length ?? 0;
  return { prefix, target: Number(digits.replace(/,/g, "")), suffix, decimals, grouped: digits.includes(",") };
};

// Counts up from zero the first time the number scrolls into view.
export default function CountUp({ value, duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const parsed = parse(value);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!parsed || !inView) return;
    if (reduceMotion) {
      setCurrent(parsed.target);
      return;
    }
    const controls = animate(0, parsed.target, {
      duration,
      ease: "easeOut",
      onUpdate: setCurrent,
    });
    return () => controls.stop();
    // parsed is derived from value; depending on value avoids restarting each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, value, duration]);

  if (!parsed) return <span>{value}</span>;

  const formatted = current.toLocaleString("en-US", {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
    useGrouping: parsed.grouped,
  });

  return (
    <span ref={ref} className="tabular-nums">
      {/* Screen readers get the final figure, not every intermediate frame. */}
      <span aria-hidden="true">
        {parsed.prefix}
        {formatted}
        {parsed.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
