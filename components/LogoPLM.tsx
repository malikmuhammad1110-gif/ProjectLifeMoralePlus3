export default function LogoPLM({
  size = 44,
  wordmark = false,
}: {
  size?: number;
  wordmark?: boolean;
}) {
  const s = size;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg
        width={s}
        height={s}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="PLM+ logo"
      >
        <defs>
          <linearGradient id="plmG" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#18B892" />
            <stop offset="100%" stopColor="#6EE7C2" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#plmG)" opacity="0.15" />
        {/* Sharper lifeline */}
        <path
          d="M8 40 L18 40 L22 28 L28 46 L34 18 L38 32 L56 32"
          fill="none"
          stroke="url(#plmG)"
          strokeWidth="3"
          strokeLinejoin="miter"
          strokeLinecap="round"
        />
        <text x="16" y="56" fontSize="12" fontWeight="800" fill="#10B981">PLM+</text>
      </svg>
      {wordmark && (
        <span style={{ fontWeight: 900, letterSpacing: -0.3 }}>
          PLM<span style={{ color: "#10B981" }}>+</span>
        </span>
      )}
    </div>
  );
}
