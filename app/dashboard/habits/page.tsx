import Sidebar from '../../components/sidebar/sidebar';

export default function Habits() {
  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <main style={{ flex: 1, padding: '40px', maxWidth: '100%', overflow: 'auto' }}>
        {/* Habits content will go here */}
      </main>
    </div>
  );
}
