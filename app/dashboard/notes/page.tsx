import Sidebar from '../../components/sidebar/sidebar';

export default function Notes() {
  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <main style={{ flex: 1, padding: '40px', maxWidth: '100%', overflow: 'auto' }}>
        {/* Notes content will go here */}
      </main>
      <div style={{
        width: '232px',
        minWidth: '232px',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        borderLeft: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0
      }}>
        {/* Right sidebar - blank */}
      </div>
    </div>
  );
}
