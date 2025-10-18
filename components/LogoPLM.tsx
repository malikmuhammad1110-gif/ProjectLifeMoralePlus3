"use client";

type Props = {
  size?: number;      // icon size in px
  wordmark?: boolean; // show "PLM+"
};

export default function LogoPLM({ size = 40, wordmark = true }: Props) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      {/* Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="PLM+ logo"
      >
        <defs>
          <linearGradient id="plmGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#18B892" />
            <stop offset="100%" stopColor="#6EE7C2" />
          </linearGradient>
        </defs>

        {/* Soft ring */}
        <circle
          cx="32" cy="32" r="25"
          fill="none"
          stroke="url(#plmGrad)"
          strokeWidth="2.5"
        />

        {/* Sharp heartbeat line */}
        <path
          d="M8 32 L18 32 L24 18 L28 44 L34 22 L38 32 L56 32"
          fill="none"
          stroke="url(#plmGrad)"
          strokeWidth="3"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />
      </svg>

      {/* Wordmark */}
      {wordmark && (
        <span style={{
          fontWeight: 800, letterSpacing: ".4px", fontSize: 20, color: "var(--text)"
        }}>
          PLM<span style={{
            color: "transparent",
            background: "linear-gradient(135deg, #18B892, #6EE7C2)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text"
          }}>+</span>
        </span>
      )}
    </div>
  );
}
