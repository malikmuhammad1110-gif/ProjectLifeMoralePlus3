import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Project Life Morale Plus",
  description: "A reflective tool to understand and improve your life morale",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
