import React from "react";

export default function LogoPLM({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/plm-logo.png"
      alt="PLM+"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
      }}
    />
  );
}
