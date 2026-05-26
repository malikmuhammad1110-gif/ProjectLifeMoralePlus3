import React from "react";

export default function LogoPLM({ size = 72 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/plm-logo2.png"
        alt="PLM+ Logo"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
