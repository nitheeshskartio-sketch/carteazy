import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carteazy SaaS Admin Portal',
  description: 'Multi-tenant eCommerce admin ERP platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
