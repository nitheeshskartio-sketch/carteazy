const modules = [
  ['Catalog', '/catalog'],
  ['Products', '/products'],
  ['Inventory', '/inventory'],
  ['Pricing', '/pricing'],
  ['Orders', '/orders'],
  ['Logistics', '/logistics'],
  ['CRM', '/crm'],
  ['Support', '/support'],
  ['Booking', '/booking'],
  ['Finance', '/finance']
];

export function Sidebar() {
  return (
    <aside className="panel" style={{ width: 240, minHeight: '100vh' }}>
      <h2>Carteazy</h2>
      <p style={{ color: 'var(--muted)' }}>Enterprise Admin</p>
      <nav className="grid" style={{ marginTop: 24 }}>
        {modules.map(([label, href]) => (
          <a key={href} href={href} style={{ padding: '8px 10px', borderRadius: 8, background: '#0d1430' }}>
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
