import { useId } from "react";

// Glossy 3D-style success check used on confirmation screens.
export default function SuccessCheckIcon({
  size = 200,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const body = `check-body-${uid}`;
  const shine = `check-shine-${uid}`;
  const glow = `check-glow-${uid}`;
  const inset = `check-inset-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#16A34A" stopOpacity="0.28" />
          <stop offset="0.97" stopColor="#16A34A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={body} cx="0.62" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#4BFF4B" />
          <stop offset="0.55" stopColor="#22D32E" />
          <stop offset="1" stopColor="#139A22" />
        </radialGradient>
        <linearGradient id={shine} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id={inset} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0B6B16" floodOpacity="0.45" />
        </filter>
      </defs>

      <circle cx="100" cy="103" r="96" fill={`url(#${glow})`} />
      <circle cx="100" cy="100" r="68" fill={`url(#${body})`} />
      <ellipse cx="100" cy="66" rx="46" ry="26" fill={`url(#${shine})`} />
      <path
        d="M66 102 L88 124 L136 76"
        stroke="#FFFFFF"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${inset})`}
      />
    </svg>
  );
}
