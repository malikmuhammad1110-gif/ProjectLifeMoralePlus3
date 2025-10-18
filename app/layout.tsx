import "./globals.css";

export const metadata = {
  title: "PLM+ — Life Morale",
  description: "Measure your morale. Design your peace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
