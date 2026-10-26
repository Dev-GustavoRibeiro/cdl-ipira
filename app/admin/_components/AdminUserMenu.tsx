'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { FaChevronDown, FaExternalLinkAlt, FaSignOutAlt } from 'react-icons/fa';
import { getInitials, type AdminUserInfo } from './AdminUserContext';
import { cx, focusRing } from './styles';

interface AdminUserMenuProps {
  user: AdminUserInfo | null;
  /** Ainda buscando o usuário (avatar pulsando). Sem usuário e sem loading = mostra "Administrador". */
  loading?: boolean;
  onLogout: () => void;
  loggingOut?: boolean;
}

/** Menu da conta no topo do painel (padrão disclosure): nome/e-mail, ver site e sair. */
export function AdminUserMenu({ user, loading = false, onLogout, loggingOut = false }: AdminUserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const name = user?.name || 'Administrador';

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        // Fecha quando o foco sai do menu pelo teclado
        if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Conta: ${name}`}
        data-testid="admin-user-menu"
        className={cx(
          'flex min-h-11 items-center gap-2.5 rounded-xl py-1 pr-2 pl-1 text-left transition-colors hover:bg-gray-100 sm:pr-3',
          open && 'bg-gray-100',
          focusRing
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white',
            loading ? 'animate-pulse bg-gray-200' : 'bg-[#003f7f]'
          )}
        >
          {loading ? '' : getInitials(user?.name || user?.email || name)}
        </span>
        <span aria-hidden="true" className="hidden min-w-0 md:block">
          <span className="block max-w-40 truncate text-sm leading-tight font-semibold text-gray-900">{loading ? 'Carregando…' : name}</span>
          <span className="block text-xs leading-tight text-gray-500">Administrador</span>
        </span>
        <FaChevronDown
          aria-hidden="true"
          className={cx('hidden h-3 w-3 text-gray-400 transition-[rotate] duration-200 sm:block', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute top-full right-0 z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] origin-top-right animate-[scale-in_0.15s_ease-out] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(0,26,61,0.4)] ring-1 ring-gray-200 motion-reduce:animate-none"
        >
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#003f7f] text-sm font-bold text-white">
              {loading ? '' : getInitials(user?.name || user?.email || name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
              {user?.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
            </div>
          </div>
          <div className="p-1.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={cx('flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#003f7f]', focusRing)}
            >
              <FaExternalLinkAlt aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
              Ver site
              <span className="sr-only">(abre em nova aba)</span>
            </a>
            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
              data-testid="admin-logout-button"
              className={cx(
                'flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60',
                focusRing
              )}
            >
              <FaSignOutAlt aria-hidden="true" className="h-3.5 w-3.5" />
              {loggingOut ? 'Saindo…' : 'Sair'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
