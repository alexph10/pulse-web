'use client'

import { PageTransition } from '../components/transitions/PageTransition';
import '../globals.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar temporarily disabled
  // const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  // const handleSidebarToggle = (expanded: boolean) => {
  //   setIsSidebarExpanded(expanded);
  // };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* <Sidebar onToggle={handleSidebarToggle} /> */}
      <main 
        style={{ 
          flex: 1,
          width: '100%',
          minHeight: '100vh',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '80px', /* Space for mobile nav */
        }}
        className="main-content"
      >
        <div style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0',
        }}>
          <div style={{
            width: '100%',
            padding: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </div>
      </main>
    </div>
  );
}
