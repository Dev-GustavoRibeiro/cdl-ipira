'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Se for rota do admin, renderizar apenas o children
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Para rotas normais, renderizar com Header, Footer e Menu Mobile
  return (
    <>
      <Header />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}



