import React from "react";

/**

 * Refined PLM+ Logo

 * Direction + clarity + life systems

 */

export default function LogoPLM({ size = 56 }: { size?: number }) {

  return (

    <svg

      width={size}

      height={size}

      viewBox="0 0 200 200"

      xmlns="http://www.w3.org/2000/svg"

    >

      <defs>

        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">

          <stop offset="0%" stopColor="#0F3D34" />

          <stop offset="100%" stopColor="#3CBF9B" />

        </linearGradient>

        <linearGradient id="pathGrad" x1="0" y1="1" x2="1" y2="0">

          <stop offset="0%" stopColor="#DFFFEF" />

          <stop offset="100%" stopColor="#FFFFFF" />

        </linearGradient>

        <filter id="glow">

          <feGaussianBlur stdDeviation="4" result="blur" />

          <feMerge>

            <feMergeNode in="blur" />

            <feMergeNode in="SourceGraphic" />

          </feMerge>

        </filter>

      </defs>

      {/* Outer circle */}

      <circle

        cx="100"

        cy="100"

        r="94"

        fill="url(#bgGrad)"

      />

      {/* Subtle ring */}

      <circle

        cx="100"

        cy="100"

        r="86"

        fill="none"

        stroke="rgba(255,255,255,0.12)"

        strokeWidth="2"

      />

      {/* Path */}

      <path

        d="

          M65 145

          C78 125, 92 118, 100 105

          C110 88, 120 80, 138 60

        "

        fill="none"

        stroke="url(#pathGrad)"

        strokeWidth="10"

        strokeLinecap="round"

        filter="url(#glow)"

      />

      {/* Star / destination */}

      <g filter="url(#glow)">

        <circle cx="142" cy="56" r="5" fill="#ffffff" />

        <path

          d="M142 42 L142 70"

          stroke="#ffffff"

          strokeWidth="2"

          strokeLinecap="round"

        />

        <path

          d="M128 56 L156 56"

          stroke="#ffffff"

          strokeWidth="2"

          strokeLinecap="round"

        />

      </g>

      {/* PLM+ */}

      <text

        x="100"

        y="178"

        textAnchor="middle"

        fontSize="24"

        fontWeight="700"

        fontFamily="Inter, sans-serif"

        fill="#ffffff"

        letterSpacing="2"

      >

        PLM+

      </text>

    </svg>

  );

}