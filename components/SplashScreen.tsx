"use client";

import { motion } from "framer-motion";
import LogoPLM from "./LogoPLM";

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 45%,#d1fae5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <LogoPLM size={82} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.6, duration: 1 }}
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "#0f766e",
            letterSpacing: 0.3,
          }}
        >
          Project Life Morale
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
