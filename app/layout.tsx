import type { Metadata } from "next";
import './globals.css';


export const metadata: Metadata = {
  title: "Pulse - Intelligence for Operations",
  description: "Enterprise operations intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Satoshi, sans-serif' }}>
        {children}

      </body>
    </html>
  );
}
