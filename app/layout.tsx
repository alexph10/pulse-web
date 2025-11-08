import type { Metadata } from "next";
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';


export const metadata: Metadata = {
  title: "Pulse - Mental Wellness & Organization",
  description: "Privacy-first mental wellness platform with AI-assisted journaling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Satoshi, sans-serif' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
