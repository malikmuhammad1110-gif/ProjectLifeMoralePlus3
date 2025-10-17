import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Project Life Morale Plus",
  description: "Measure and lift your day-to-day quality of life",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="nav">
          <div className="nav-inner">
            <div className="brand">
              <img src="/logo.svg" alt="PLMP" />
              <span>Project Life Morale Plus</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <a className="btn" href="/survey">Survey</a>
