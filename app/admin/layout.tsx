'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaHome, FaNewspaper, FaCalendarAlt, FaVideo, FaImages, 
  FaBriefcase, FaGavel, FaFileAlt, FaBook, 
  FaSignOutAlt, FaBars, FaTimes, FaCog, FaUsers, FaHistory
} from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Não verificar autenticação na página de login
    if (pathname === '/admin/login') {
      setTimeout(() => setIsLoading(false), 0);
      return;
    }

    // Verificar autenticação
    const checkAuth = () => {
      const auth = localStorage.getItem('admin_authenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
      setTimeout(() => setIsLoading(false), 0);
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      // Limpar cookie no servidor
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar localStorage e redirecionar
    localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_user');
    router.push('/admin/login');
    }
  };

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', href: '/admin/dashboard' },
    { 
      icon: <FaCog />, 
      label: 'Conteúdo do Site', 
      href: '/admin/conteudo',
      submenu: [
        { label: 'Hero Carousel', href: '/admin/conteudo/hero-carousel' },
        { label: 'Associados', href: '/admin/conteudo/parceiros' },
      ]
    },
    { icon: <FaNewspaper />, label: 'Notícias', href: '/admin/noticias' },
    { icon: <FaCalendarAlt />, label: 'Eventos', href: '/admin/eventos' },
    { icon: <FaVideo />, label: 'TV Lojista', href: '/admin/tv-lojista' },
    { icon: <FaImages />, label: 'Galeria de Fotos', href: '/admin/galeria-fotos' },
    { icon: <FaBriefcase />, label: 'Balcão de Empregos', href: '/admin/balcao-empregos' },
    { icon: <FaGavel />, label: 'Orientação Jurídica', href: '/admin/orientacao-juridica' },
    { icon: <FaFileAlt />, label: 'Portal Transparência', href: '/admin/portal-transparencia' },
    { icon: <FaBook />, label: 'Revista CDL', href: '/admin/revista-cdl' },
    { icon: <FaUsers />, label: 'Diretoria', href: '/admin/diretoria' },
    { icon: <FaHistory />, label: 'Auditoria', href: '/admin/auditoria' },
  ];

  // Se estiver na página de login, renderizar apenas o children sem layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-linear-to-r from-[#003f7f] to-[#0052a3]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-32 h-12">
                <Image
                  src="/logo-cdl.png"
                  alt="CDL Ipirá"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-white hover:text-[#ffd000] transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-white/80 mt-2">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href));
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-linear-to-r from-[#00a859] to-[#00d670] text-white shadow-lg font-bold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#003f7f]'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#00a859]'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="text-sm flex-1">{item.label}</span>
                </Link>
                {hasSubmenu && isActive && (
                  <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-[#00a859]/30">
                    {item.submenu.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isSubActive
                              ? 'bg-[#00a859] text-white font-bold'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-[#003f7f]'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-white bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            <FaSignOutAlt />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-gray-600 hover:text-[#003f7f] p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Painel de Controle</h1>
                <p className="text-xs text-gray-500">Gerencie todo o conteúdo do site</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#003f7f] hover:text-white text-gray-700 rounded-lg transition-all duration-200 text-sm font-semibold"
              >
                <FaHome className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Site</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
