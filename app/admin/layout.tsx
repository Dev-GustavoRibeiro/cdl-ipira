'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { IconType } from 'react-icons';
import {
  FaHome, FaHistory, FaImages, FaHandshake, FaNewspaper, FaCalendarAlt, FaBullhorn, FaVideo,
  FaCamera, FaBook, FaBriefcase, FaGavel, FaUsers, FaFileAlt, FaBars, FaTimes, FaChevronRight,
  FaAngleDoubleLeft, FaAngleDoubleRight, FaExternalLinkAlt, FaInbox,
} from 'react-icons/fa';
import { fetchWithCSRF } from '@/lib/csrf-client';
import { useModalBehavior } from '@/lib/hooks/useModalBehavior';
import { AdminUserContext, AdminUserMenu, CONTACT_MESSAGES_EVENT, cx, focusRing, type AdminUserInfo } from './_components';

interface NavItem {
  label: string;
  href: string;
  icon: IconType;
}

interface NavGroup {
  title: string;
  /** Página-índice do grupo (aparece na trilha do topo) */
  href?: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    title: 'Visão geral',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: FaHome },
      { label: 'Auditoria', href: '/admin/auditoria', icon: FaHistory },
    ],
  },
  {
    title: 'Conteúdo do site',
    href: '/admin/conteudo',
    items: [
      { label: 'Hero Carousel', href: '/admin/conteudo/hero-carousel', icon: FaImages },
      { label: 'Associados', href: '/admin/conteudo/parceiros', icon: FaHandshake },
    ],
  },
  {
    title: 'Imprensa',
    items: [
      { label: 'Notícias', href: '/admin/noticias', icon: FaNewspaper },
      { label: 'Eventos', href: '/admin/eventos', icon: FaCalendarAlt },
      { label: 'Campanhas', href: '/admin/campanhas', icon: FaBullhorn },
      { label: 'TV Lojista', href: '/admin/tv-lojista', icon: FaVideo },
      { label: 'Galeria de Fotos', href: '/admin/galeria-fotos', icon: FaCamera },
      { label: 'Revista CDL', href: '/admin/revista-cdl', icon: FaBook },
    ],
  },
  {
    title: 'Serviços',
    items: [
      { label: 'Fale Conosco', href: '/admin/fale-conosco', icon: FaInbox },
      { label: 'Balcão de Empregos', href: '/admin/balcao-empregos', icon: FaBriefcase },
      { label: 'Orientação Jurídica', href: '/admin/orientacao-juridica', icon: FaGavel },
    ],
  },
  {
    title: 'Institucional',
    items: [
      { label: 'Diretoria', href: '/admin/diretoria', icon: FaUsers },
      { label: 'Portal Transparência', href: '/admin/portal-transparencia', icon: FaFileAlt },
    ],
  },
];

const toTestId = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/** Grupo e item da página atual (para a trilha do topo). */
function findCurrent(pathname: string) {
  for (const group of NAV) {
    const item = group.items.find((i) => isActive(pathname, i.href));
    if (item) return { group, item };
    if (group.href && pathname === group.href) return { group, item: null };
  }
  return { group: null, item: null };
}

// ===== Menu recolhido (desktop), lembrado no navegador =====
const COLLAPSE_KEY = 'cdl-admin-sidebar-collapsed';
const collapseListeners = new Set<() => void>();
let collapsedFallback = false; // quando o localStorage não está disponível (aba anônima, bloqueio)

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return collapsedFallback;
  }
}

function writeCollapsed(value: boolean) {
  collapsedFallback = value;
  try {
    localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0');
  } catch {
    // segue só em memória
  }
  collapseListeners.forEach((listener) => listener());
}

function subscribeCollapsed(listener: () => void) {
  collapseListeners.add(listener);
  return () => {
    collapseListeners.delete(listener);
  };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Layout client não exporta metadata: o React 19 sobe esta meta para o <head> (o proxy também manda X-Robots-Tag) */}
      <meta name="robots" content="noindex, nofollow" />
      {/* Login fica fora do layout do painel */}
      {pathname === '/admin/login' ? children : <AdminShell pathname={pathname}>{children}</AdminShell>}
    </>
  );
}

function AdminShell({ pathname, children }: { pathname: string; children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<AdminUserInfo | null>(null);
  const [userFailed, setUserFailed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const collapsed = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);
  const [contactUnread, setContactUnread] = useState(0);
  const drawerRef = useModalBehavior<HTMLDivElement>(mobileOpen, () => setMobileOpen(false));
  const { group: currentGroup, item: currentItem } = findCurrent(pathname);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/me')
      .then((res) => {
        // Sessão expirada (o proxy encerra após 4h): volta para o login
        if (res.status === 401) router.replace('/admin/login');
        return res.ok ? res.json() : null;
      })
      .then((data: AdminUserInfo | null) => {
        if (!active) return;
        if (data) setUser(data);
        else setUserFailed(true);
      })
      .catch(() => {
        if (active) setUserFailed(true);
      });
    return () => {
      active = false;
    };
  }, [router]);

  // Contador de mensagens não lidas do Fale Conosco: recarrega a cada navegação e quando a tela de mensagens avisa
  useEffect(() => {
    let active = true;
    const load = () =>
      fetch('/api/admin/contact-messages?summary=1')
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { unread?: number } | null) => {
          if (active && data) setContactUnread(data.unread ?? 0);
        })
        .catch(() => {});
    // Com um número (ex.: -1 ao abrir uma mensagem nova) só ajusta o contador, sem outra requisição
    const onChange = (event: Event) => {
      const delta = (event as CustomEvent<unknown>).detail;
      if (typeof delta === 'number') setContactUnread((n) => Math.max(n + delta, 0));
      else load();
    };
    load();
    window.addEventListener(CONTACT_MESSAGES_EVENT, onChange);
    return () => {
      active = false;
      window.removeEventListener(CONTACT_MESSAGES_EVENT, onChange);
    };
  }, [pathname]);

  const badges = { '/admin/fale-conosco': contactUnread };

  // Gaveta aberta no tablet em pé e girou para deitado (vira desktop): fecha e libera a rolagem
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Encerra a sessão Supabase no servidor
      await fetchWithCSRF('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      router.replace('/admin/login');
      router.refresh();
    }
  };

  const currentLabel = currentItem?.label ?? currentGroup?.title ?? 'Painel';

  return (
    <AdminUserContext value={user}>
      <div className="min-h-dvh bg-[#f5f7fa]">
        <a href="#admin-main" className="skip-link">
          Pular para o conteúdo
        </a>

        {/* Sidebar fixa (desktop) */}
        <aside
          className={cx(
            'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-gray-200/80 bg-white transition-[width] duration-200 ease-out motion-reduce:transition-none lg:flex',
            collapsed ? 'w-[76px]' : 'w-68'
          )}
        >
          <SidebarContent
            pathname={pathname}
            collapsed={collapsed}
            badges={badges}
            onToggleCollapse={() => writeCollapsed(!collapsed)}
          />
        </aside>

        {/* Gaveta (celular/tablet) */}
        <div
          className={cx(
            'fixed inset-0 z-50 lg:hidden',
            // Abre visível na hora (o foco entra na gaveta); ao fechar, some só depois da animação de saída
            mobileOpen ? 'visible' : 'pointer-events-none invisible transition-[visibility] duration-300'
          )}
        >
          <div
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            className={cx(
              'absolute inset-0 bg-[#001a3d]/50 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none',
              mobileOpen ? 'opacity-100' : 'opacity-0'
            )}
          />
          <div
            id="admin-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu do painel"
            tabIndex={-1}
            className={cx(
              'absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col bg-white shadow-[0_30px_80px_-20px_rgba(0,26,61,0.55)] transition-[translate] duration-300 ease-out focus:outline-none motion-reduce:transition-none',
              mobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <SidebarContent pathname={pathname} collapsed={false} badges={badges} onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
          </div>
        </div>

        <div className={cx('transition-[padding] duration-200 ease-out motion-reduce:transition-none', collapsed ? 'lg:pl-[76px]' : 'lg:pl-68')}>
          {/* Barra superior */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-gray-200/80 bg-white/90 px-3 backdrop-blur-md sm:gap-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
              aria-controls="admin-drawer"
              className={cx('flex size-11 shrink-0 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-[#003f7f] lg:hidden', focusRing)}
            >
              <FaBars aria-hidden="true" className="h-5 w-5" />
            </button>

            <nav aria-label="Você está em" className="min-w-0 flex-1">
              <ol className="flex min-w-0 items-center gap-1.5 text-sm">
                {currentGroup && (
                  <li className="hidden items-center gap-1.5 sm:flex">
                    <Link href="/admin/dashboard" className={cx('rounded text-gray-500 hover:text-[#003f7f]', focusRing)}>
                      Painel
                    </Link>
                    <FaChevronRight aria-hidden="true" className="h-2.5 w-2.5 text-gray-300" />
                  </li>
                )}
                {currentGroup && currentItem && currentGroup.title !== 'Visão geral' && (
                  <li className="hidden items-center gap-1.5 md:flex">
                    {currentGroup.href ? (
                      <Link href={currentGroup.href} className={cx('rounded text-gray-500 hover:text-[#003f7f]', focusRing)}>
                        {currentGroup.title}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{currentGroup.title}</span>
                    )}
                    <FaChevronRight aria-hidden="true" className="h-2.5 w-2.5 text-gray-300" />
                  </li>
                )}
                <li className="min-w-0">
                  <span aria-current="page" className="block truncate text-base font-bold text-gray-900 sm:text-sm sm:font-semibold">
                    {currentLabel}
                  </span>
                </li>
              </ol>
            </nav>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                'hidden min-h-11 items-center gap-2 rounded-xl px-3.5 pointer-fine:min-h-10 text-sm font-semibold text-[#003f7f] ring-1 ring-inset ring-gray-300 transition-colors hover:bg-[#003f7f]/[0.04] hover:ring-[#003f7f]/40 sm:inline-flex',
                focusRing
              )}
            >
              <FaExternalLinkAlt aria-hidden="true" className="h-3 w-3" />
              Ver site
              <span className="sr-only">(abre em nova aba)</span>
            </a>

            <span aria-hidden="true" className="hidden h-6 w-px bg-gray-200 sm:block" />

            <AdminUserMenu user={user} loading={!user && !userFailed} onLogout={handleLogout} loggingOut={loggingOut} />
          </header>

          <main id="admin-main" tabIndex={-1} data-testid="admin-main-content" className="mx-auto w-full max-w-[1600px] px-4 py-6 focus:outline-none sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </AdminUserContext>
  );
}

interface SidebarContentProps {
  pathname: string;
  collapsed: boolean;
  /** Contadores ao lado dos itens (href -> quantidade) */
  badges?: Record<string, number>;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}

function SidebarContent({ pathname, collapsed, badges, onToggleCollapse, onNavigate, onClose }: SidebarContentProps) {
  return (
    <>
      {/* Faixa com as cores da marca */}
      <div aria-hidden="true" className="h-1 shrink-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />

      <div className={cx('flex h-[60px] shrink-0 items-center border-b border-gray-100', collapsed ? 'justify-center px-2' : 'justify-between px-4')}>
        <Link
          href="/admin/dashboard"
          onClick={onNavigate}
          aria-label="CDL Ipirá — início do painel"
          className={cx('relative block shrink-0 overflow-hidden rounded-lg', collapsed ? 'h-10 w-10' : 'h-11 w-[132px]', focusRing)}
        >
          {collapsed ? (
            // Só a bandeira do logo (recorte do PNG, sem distorcer)
            <Image src="/logo-cdl.png" alt="" width={120} height={68} priority className="absolute top-[-8px] left-[-17px] h-[68px] w-[120px] max-w-none" />
          ) : (
            // O PNG tem margem transparente: object-cover recorta só a sobra, mantendo a proporção
            <Image src="/logo-cdl.png" alt="" fill sizes="132px" priority className="object-cover" />
          )}
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className={cx('flex size-11 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-[#003f7f]', focusRing)}
          >
            <FaTimes aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav data-testid="admin-sidebar" aria-label="Menu do painel" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        {NAV.map((group, g) => (
          <div key={group.title} className={cx(g > 0 && (collapsed ? 'mt-3 border-t border-gray-100 pt-3' : 'mt-5'))}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-[0.08em] text-gray-500 uppercase">{group.title}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = isActive(pathname, href);
                const count = badges?.[href] ?? 0;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      data-testid={`admin-nav-${toTestId(label)}`}
                      aria-current={active ? 'page' : undefined}
                      title={collapsed ? (count ? `${label} (${count} ${count === 1 ? 'não lida' : 'não lidas'})` : label) : undefined}
                      className={cx(
                        'group relative flex min-h-11 items-center gap-3 rounded-xl text-sm transition-colors duration-150 pointer-fine:min-h-9',
                        collapsed ? 'justify-center' : 'px-3',
                        active
                          ? 'bg-[#003f7f]/[0.07] font-semibold text-[#003f7f]'
                          : 'font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        focusRing
                      )}
                    >
                      {active && (
                        <span aria-hidden="true" className="absolute top-1/2 -left-3 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#003f7f]" />
                      )}
                      <Icon
                        aria-hidden="true"
                        className={cx('h-4 w-4 shrink-0', active ? 'text-[#003f7f]' : 'text-gray-400 group-hover:text-gray-600')}
                      />
                      <span className={cx(collapsed ? 'sr-only' : 'truncate')}>{label}</span>
                      {count > 0 &&
                        (collapsed ? (
                          <span aria-hidden="true" className="absolute top-1.5 right-3 size-2 rounded-full bg-[#e6bb00] ring-2 ring-white" />
                        ) : (
                          <span aria-hidden="true" className="ml-auto rounded-full bg-[#ffd000] px-1.5 py-px text-[11px] font-bold text-[#003f7f] tabular-nums">
                            {count > 99 ? '99+' : count}
                          </span>
                        ))}
                      {count > 0 && <span className="sr-only">, {count} {count === 1 ? 'não lida' : 'não lidas'}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {onToggleCollapse && (
        <div className="shrink-0 border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            title={collapsed ? 'Expandir menu' : undefined}
            className={cx(
              'flex min-h-11 w-full items-center gap-3 rounded-xl text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 pointer-fine:min-h-9',
              collapsed ? 'justify-center' : 'px-3',
              focusRing
            )}
          >
            {collapsed ? <FaAngleDoubleRight aria-hidden="true" className="h-4 w-4" /> : <FaAngleDoubleLeft aria-hidden="true" className="h-4 w-4" />}
            {!collapsed && <span>Recolher menu</span>}
          </button>
        </div>
      )}
    </>
  );
}
