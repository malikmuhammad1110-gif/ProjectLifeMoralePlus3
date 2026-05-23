import "./globals.css";

export const metadata = {

  title: "PLM+ — Life Morale",

  description: "Measure your morale. Design your peace.",

  manifest: "/manifest.json",

  themeColor: "#0f766e",

  icons: {

    icon: "/icon-192.png",

    apple: "/icon-192.png",

  },

};

export default function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  return (

    <html lang="en">

      <body>{children}</body>

    </html>

  );

}