import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: 16 }}>
      <Sidebar />
      <main style={{ flex: 1 }} className="grid">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
