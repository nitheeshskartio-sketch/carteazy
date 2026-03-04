'use client';

import { useEffect, useState } from 'react';

type Props = {
  title: string;
  moduleKey: string;
};

export function ModulePage({ title, moduleKey }: Props) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/v1/${moduleKey}?limit=10`).then((r) => r.json()).then((d) => setItems(d.items || []));
  }, [moduleKey]);

  return (
    <section className="grid">
      <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <button onClick={() => fetch(`/api/v1/${moduleKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `${title} ${Date.now()}` }) }).then(() => location.reload())}>+ Create</button>
      </div>
      <div className="panel">
        <h3>Records</h3>
        <ul>
          {items.map((item) => <li key={item._id}>{item.name || item.code || item.title}</li>)}
        </ul>
      </div>
    </section>
  );
}
