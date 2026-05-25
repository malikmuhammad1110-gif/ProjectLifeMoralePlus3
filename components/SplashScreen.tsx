"use client";

import { motion } from "framer-motion";
import LogoPLM from "./LogoPLM";

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "linear-gradient(135deg,#021a16,#064e3b,#0f766e,#34d399)",
      }}
    >
      {/* Glow Effects */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,.08)",
          filter: "blur(80px)",
          top: -120,
          left: -120,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,.06)",
          filter: "blur(90px)",
          bottom: -120,
          right: -120,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.1,
          ease: "easeOut",
        }}
        style={{
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          padding: 20,
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <LogoPLM size={88} />
        </motion.div>

        <h1
          style={{
            color: "white",
            fontSize: "clamp(48px,8vw,88px)",
            margin: "24px 0 12px",
            fontWeight: 900,
            letterSpacing: "-0.05em",
          }}
        >
          PLM+
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,.84)",
            fontSize: 20,
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto",
          }}
        >
          Measure your morale. Design your peace.
        </p>
      </motion.div>
    </motion.div>
  );
}
