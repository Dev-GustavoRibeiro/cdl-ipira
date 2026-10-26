'use client';

import { useState } from 'react';
import Link from 'next/link';
import Form from 'next/form';
import { FaArrowRight, FaHistory, FaSearch, FaTimes } from 'react-icons/fa';
import { useModalBehavior } from '@/lib/hooks/useModalBehavior';
import { ACCENT_TILE, NAV_GROUPS } from './navItems';
import { setOverlay } from './overlayStore';

const RECENT_KEY = 'cdl-recent-searches';
const QUICK_LINKS = ['/imprensa/noticias', '/imprensa/campanhas', '/imprensa/eventos', '/produtos/spc-brasil', '/produtos/balcao-empregos', '/imprensa/contato'];
const quickLinks = NAV_GROUPS.flatMap((group) => group.items.map((item) => ({ ...item, accent: group.accent }))).filter((item) =>
  QUICK_LINKS.includes(item.href)
);

const readRecent = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((q) => typeof q === 'string').slice(0, 5) : [];
  } catch {
    return [];
  }
};

const close = () => setOverlay(null);

/** Busca em estilo "command palette": envia GET /pesquisa?q= (navegação no cliente via next/form). Montado só quando aberto. */
export default function SearchDialog() {
  const dialogRef = useModalBehavior<HTMLDivElement>(true, close);
  const [recent] = useState(readRecent);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const input = e.currentTarget.elements.namedItem('q') as HTMLInputElement;
    const query = input.value.trim();
    if (query.length < 2) {
      e.preventDefault();
      input.focus();
      return;
    }
    input.value = query;
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...recent.filter((q) => q !== query)].slice(0, 5)));
    } catch {}
    close();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[max(1rem,8vh)] pb-4">
      <div aria-hidden="true" onClick={close} className="absolute inset-0 bg-[#001a3d]/60 backdrop-blur-sm" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Pesquisar no site"
        tabIndex={-1}
        className="relative flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_40px_100px_-30px_rgba(0,26,61,0.6)] ring-1 ring-[#003f7f]/10 animate-slide-down"
      >
        <Form action="/pesquisa" onSubmit={handleSubmit} role="search" className="flex items-center gap-2 border-b border-gray-100 p-2 pl-5 sm:p-3 sm:pl-6">
          <FaSearch aria-hidden="true" className="h-5 w-5 shrink-0 text-[#003f7f]" />
          <label htmlFor="site-search" className="sr-only">
            O que você está procurando?
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            required
            minLength={2}
            autoComplete="off"
            enterKeyHint="search"
            placeholder="O que você procura?"
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="submit"
            className="hidden h-11 shrink-0 items-center gap-2 rounded-full bg-[#003f7f] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0052a3] sm:inline-flex"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar pesquisa"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <FaTimes aria-hidden="true" className="h-4 w-4" />
          </button>
        </Form>

        <div className="overflow-y-auto overscroll-contain p-4 sm:p-6">
          {recent.length > 0 && (
            <section aria-labelledby="search-recent" className="mb-6">
              <h2 id="search-recent" className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                Buscas recentes
              </h2>
              <ul className="flex flex-wrap gap-2">
                {recent.map((q) => (
                  <li key={q}>
                    <Link
                      href={`/pesquisa?q=${encodeURIComponent(q)}`}
                      onClick={close}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-100 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-[#003f7f] hover:text-white"
                    >
                      <FaHistory aria-hidden="true" className="h-3.5 w-3.5 opacity-60" />
                      {q}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="search-quick">
            <h2 id="search-quick" className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              Acesso rápido
            </h2>
            <ul className="grid gap-1 sm:grid-cols-2">
              {quickLinks.map(({ href, label, description, icon: Icon, accent }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-gray-50"
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors ${ACCENT_TILE[accent]}`}>
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-900">{label}</span>
                      <span className="block truncate text-xs text-gray-500">{description}</span>
                    </span>
                    <FaArrowRight aria-hidden="true" className="h-3 w-3 shrink-0 text-gray-300 transition-[translate,color] group-hover:translate-x-0.5 group-hover:text-[#003f7f]" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="hidden items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs text-gray-500 sm:flex">
          <kbd className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 font-sans font-semibold text-gray-600">Esc</kbd>
          para fechar
        </p>
      </div>
    </div>
  );
}
