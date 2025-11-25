import type { Metadata } from "next";
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { ManagedProfilesProvider } from './contexts/ManagedProfilesContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { CommandPalette } from './components/ui/CommandPalette';
import ActivityHeatmapWidget from './components/activity-heatmap-widget/activity-heatmap-widget';
import RightPanel from './components/right-panel/right-panel';


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
              <ManagedProfilesProvider>
                {children}
                <CommandPalette />
                <RightPanel />
                <ActivityHeatmapWidget />
              </ManagedProfilesProvider>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
