import React from "react";

/**

 * PLM+ Logo — Concept #7

 * Direction + Purpose + Life Path

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

        <radialGradient id="bg" cx="50%" cy="38%" r="70%">

          <stop offset="0%" stopColor="#1BAF91" />

          <stop offset="55%" stopColor="#0F766E" />

          <stop offset="100%" stopColor="#052E2B" />

        </radialGradient>

        <linearGradient id="path" x1="0" y1="1" x2="1" y2="0">

          <stop offset="0%" stopColor="#D9FFF1" />

          <stop offset="55%" stopColor="#8EF5D0" />

          <stop offset="100%" stopColor="#FFFFFF" />

        </linearGradient>

        <filter id="softGlow">

          <feGaussianBlur stdDeviation="3.5" result="blur" />

          <feMerge>

            <feMergeNode in="blur" />

            <feMergeNode in="SourceGraphic" />

          </feMerge>

        </filter>

      </defs>

      {/* Base circle */}

      <circle cx="100" cy="100" r="94" fill="url(#bg)" />

      {/* Outer ring */}

      <circle

        cx="100"

        cy="100"

        r="82"

        fill="none"

        stroke="rgba(210,255,238,.55)"

        strokeWidth="5"

      />

      {/* Horizon line */}

      <path

        d="M48 104 C70 92, 96 88, 122 95 C137 99, 149 106, 158 114"

        fill="none"

        stroke="rgba(218,255,240,.5)"

        strokeWidth="4"

        strokeLinecap="round"

      />

      {/* Winding road/path */}

      <path

        d="M78 156

           C95 134, 107 124, 104 109

           C101 94, 113 83, 137 62"

        fill="none"

        stroke="url(#path)"

        strokeWidth="11"

        strokeLinecap="round"

        strokeLinejoin="round"

        filter="url(#softGlow)"

      />

      {/* Smaller inner path edge for road feel */}

      <path

        d="M88 156

           C101 136, 113 124, 111 111

           C109 96, 120 83, 139 66"

        fill="none"

        stroke="rgba(5,46,43,.28)"

        strokeWidth="2"

        strokeLinecap="round"

      />

      {/* Destination star */}

      <g filter="url(#softGlow)">

        <path

          d="M143 40 L147 54 L161 58 L147 62 L143 76 L139 62 L125 58 L139 54 Z"

          fill="#FFFFFF"

        />

      </g>

      {/* Tiny system points */}

      <circle cx="61" cy="119" r="2.2" fill="rgba(217,255,241,.55)" />

      <circle cx="139" cy="116" r="2.2" fill="rgba(217,255,241,.55)" />

      {/* PLM+ wordmark */}

      <text

        x="100"

        y="179"

        textAnchor="middle"

        fontSize="22"

        fontWeight="800"

        fontFamily="Inter, Arial, sans-serif"

        fill="#FFFFFF"

        letterSpacing="1.8"

      >

        PLM+

      </text>

    </svg>

  );

}