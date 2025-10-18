import React from "react";

/**
 * PLM+ logo component — simple, modern, wellness aesthetic.
 * Usage: <LogoPLM size={48} />
 */
export default function LogoPLM({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, #F7FBF8 0%, #E3F3EB 100%)",
      }}
    >
      <circle cx="100" cy="100" r="95" fill="url(#grad)" stroke="#cfe9dd" strokeWidth="3" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2E8B57" />
          <stop offset="100%" stopColor="#66CDAA" />
        </linearGradient>
      </defs>

      {/* Lifeline curve */}
      <path
        d="M30 110 L60 110 L70 80 L80 130 L95 80 L110 120 L130 90 L150 110 L170 110"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Text */}
      <text
        x="50%"
        y="135"
        textAnchor="middle"
        fontSize="48"
        fontWeight="700"
        fontFamily="sans-serif"
        fill="#ffffff"
      >
        PLM+
      </text>
    </svg>
  );
}
