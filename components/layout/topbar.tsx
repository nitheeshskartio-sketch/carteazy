export function Topbar() {
  return (
    <header className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <input placeholder="Global search (products, orders, customers)" style={{ width: '65%', padding: 10, borderRadius: 8 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button>Notifications</button>
        <button>Tenant Switch</button>
      </div>
    </header>
  );
}
