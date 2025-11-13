import type { Metadata } from "next";
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { CommandPalette } from './components/ui/CommandPalette';


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
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              {children}
              <CommandPalette />
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
