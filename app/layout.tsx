export const metadata = {
  title: "Project Life Morale+",
  description: "A modern, human way to track and lift your Life Morale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Inline favicon matching PLM+ */}
        <link
          rel="icon"
          href={`data:image/svg+xml;utf8,${encodeURIComponent(`
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
              <defs>
                <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                  <stop offset='0%' stop-color='#18B892'/>
                  <stop offset='100%' stop-color='#6EE7C2'/>
                </linearGradient>
              </defs>
              <circle cx='32' cy='32' r='25' fill='none' stroke='url(#g)' stroke-width='4'/>
              <path d='M8 32 L18 32 L24 18 L28 44 L34 22 L38 32 L56 32'
                    fill='none' stroke='url(#g)' stroke-width='4'
                    stroke-linejoin='miter' stroke-linecap='square'/>
            </svg>
          `)}`}
        />
      </head>
      <body>
        <main style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}
