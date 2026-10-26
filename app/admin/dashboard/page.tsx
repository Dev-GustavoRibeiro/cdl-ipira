'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import {
  FaNewspaper, FaCalendarAlt, FaVideo, FaImages, FaBriefcase, FaHandshake, FaBullhorn, FaCamera, FaBook,
  FaGavel, FaClipboardList, FaPlus, FaPen, FaTrash, FaSignInAlt, FaSignOutAlt, FaChevronRight, FaHistory,
  FaExclamationTriangle, FaRedo,
} from 'react-icons/fa';
import {
  AdminCard, AdminPageHeader, AdminSection, EmptyState, StatCard, buttonClass, cx, focusRing, useAdminUser,
  type StatTone,
} from '../_components';

type CountKey =
  | 'news' | 'events' | 'campaigns' | 'videos' | 'albums' | 'magazines' | 'hero_slides' | 'partners'
  | 'jobs' | 'registrations' | 'legal_pending';

interface ActivityItem {
  id: number | string;
  action: string;
  table_name: string;
  record_title: string | null;
  user_name: string | null;
  created_at: string;
}

type DashboardData = Partial<Record<CountKey, number | null>> & { recent?: ActivityItem[] };

interface StatDef {
  key: CountKey;
  label: string;
  icon: IconType;
  tone: StatTone;
  href: string;
}

const ATTENTION: StatDef[] = [
  { key: 'legal_pending', label: 'Solicitações jurídicas pendentes', icon: FaGavel, tone: 'yellow', href: '/admin/orientacao-juridica' },
  { key: 'registrations', label: 'Inscrições em eventos', icon: FaClipboardList, tone: 'blue', href: '/admin/eventos' },
  { key: 'jobs', label: 'Vagas no Balcão de Empregos', icon: FaBriefcase, tone: 'green', href: '/admin/balcao-empregos' },
];

const CONTENT: StatDef[] = [
  { key: 'news', label: 'Notícias', icon: FaNewspaper, tone: 'navy', href: '/admin/noticias' },
  { key: 'events', label: 'Eventos', icon: FaCalendarAlt, tone: 'green', href: '/admin/eventos' },
  { key: 'campaigns', label: 'Campanhas', icon: FaBullhorn, tone: 'yellow', href: '/admin/campanhas' },
  { key: 'videos', label: 'Vídeos na TV Lojista', icon: FaVideo, tone: 'blue', href: '/admin/tv-lojista' },
  { key: 'albums', label: 'Álbuns de fotos', icon: FaCamera, tone: 'navy', href: '/admin/galeria-fotos' },
  { key: 'magazines', label: 'Edições da revista', icon: FaBook, tone: 'green', href: '/admin/revista-cdl' },
  { key: 'hero_slides', label: 'Banners do carrossel', icon: FaImages, tone: 'yellow', href: '/admin/conteudo/hero-carousel' },
  { key: 'partners', label: 'Associados', icon: FaHandshake, tone: 'blue', href: '/admin/conteudo/parceiros' },
];

// ?novo=1: a página de destino pode abrir o formulário de criação direto
const QUICK_ACTIONS = [
  { label: 'Nova notícia', description: 'Publicar em Imprensa', href: '/admin/noticias?novo=1', icon: FaNewspaper },
  { label: 'Novo evento', description: 'Agenda e inscrições', href: '/admin/eventos?novo=1', icon: FaCalendarAlt },
  { label: 'Nova campanha', description: 'Promoções do comércio', href: '/admin/campanhas?novo=1', icon: FaBullhorn },
  { label: 'Novo álbum', description: 'Galeria de fotos', href: '/admin/galeria-fotos?novo=1', icon: FaCamera },
];

const ACTIONS: Record<string, { label: string; icon: IconType; className: string }> = {
  CREATE: { label: 'Criação', icon: FaPlus, className: 'bg-[#00a859]/10 text-[#00a859]' },
  UPDATE: { label: 'Edição', icon: FaPen, className: 'bg-[#0066cc]/10 text-[#0066cc]' },
  DELETE: { label: 'Exclusão', icon: FaTrash, className: 'bg-red-50 text-red-600' },
  LOGIN: { label: 'Login', icon: FaSignInAlt, className: 'bg-[#003f7f]/[0.08] text-[#003f7f]' },
  LOGOUT: { label: 'Logout', icon: FaSignOutAlt, className: 'bg-gray-100 text-gray-500' },
};

const TABLES: Record<string, string> = {
  news: 'Notícias',
  events: 'Eventos',
  videos: 'TV Lojista',
  hero_slides: 'Banners',
  partners: 'Associados',
  jobs: 'Vagas',
  resumes: 'Currículos',
  campaigns: 'Campanhas',
  event_registrations: 'Inscrições',
  albums: 'Galeria',
  album_photos: 'Galeria',
  magazines: 'Revista CDL',
  team_members: 'Diretoria',
  transparency_documents: 'Transparência',
  legal_requests: 'Orientação Jurídica',
  contact_messages: 'Fale Conosco',
  admin_users: 'Usuários',
  auth: 'Painel',
};

const relativeFormat = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

/** "há 12 minutos", "ontem", "12 de out." */
function timeAgo(iso: string) {
  const date = new Date(iso);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (Number.isNaN(minutes)) return '';
  if (minutes < 1) return 'agora';
  if (minutes < 60) return relativeFormat.format(-minutes, 'minute');
  if (minutes < 60 * 24) return relativeFormat.format(-Math.round(minutes / 60), 'hour');
  if (minutes < 60 * 24 * 7) return relativeFormat.format(-Math.round(minutes / (60 * 24)), 'day');
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', timeZone: 'America/Bahia' });
}

function todayLabel() {
  const text = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bahia' });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function AdminDashboardPage() {
  const user = useAdminUser();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState<DashboardData>({});

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/dashboard')
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || 'Erro ao carregar estatísticas');
        if (active) setData(json);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        if (active) setHasError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
    setAttempt((n) => n + 1);
  };

  // Nome pode vir do e-mail ("gustavo@..."): só a primeira palavra, com inicial maiúscula
  const first = user?.name?.split(/[\s@]/)[0];
  const firstName = first ? first.charAt(0).toUpperCase() + first.slice(1) : '';
  const value = (key: CountKey) => data[key] ?? null;
  const recent = data.recent ?? [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={firstName ? `Olá, ${firstName}` : 'Olá!'}
        eyebrow={<span suppressHydrationWarning>{todayLabel()}</span>}
        description="Acompanhe o site da CDL Ipirá e o que precisa da sua atenção."
        actions={
          <Link href="/admin/noticias?novo=1" className={buttonClass('primary')}>
            <FaPlus aria-hidden="true" className="h-3.5 w-3.5" />
            Nova notícia
          </Link>
        }
      />

      {hasError ? (
        <AdminCard role="alert" className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FaExclamationTriangle aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-gray-900">Não foi possível carregar o painel</p>
            <p className="mt-1 text-sm text-gray-500">Verifique sua conexão e tente novamente.</p>
          </div>
          <button type="button" onClick={retry} className={buttonClass('primary')}>
            <FaRedo aria-hidden="true" className="h-3.5 w-3.5" />
            Tentar novamente
          </button>
        </AdminCard>
      ) : (
        <>
          <section aria-labelledby="dash-attention">
            <h2 id="dash-attention" className="mb-3 text-sm font-bold text-gray-900">
              Precisa de atenção
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {ATTENTION.map((stat) => {
                const v = value(stat.key);
                const pending = stat.key === 'legal_pending' && typeof v === 'number' && v > 0;
                return (
                  <StatCard
                    key={stat.key}
                    icon={stat.icon}
                    label={stat.label}
                    value={v}
                    tone={stat.tone}
                    href={stat.href}
                    loading={isLoading}
                    highlight={pending}
                    compact
                    hint={stat.key === 'legal_pending' ? (pending ? 'Aguardando atendimento' : 'Tudo em dia') : undefined}
                  />
                );
              })}
            </div>
          </section>

          <section aria-labelledby="dash-content">
            <h2 id="dash-content" className="mb-3 text-sm font-bold text-gray-900">
              Conteúdo publicado
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {CONTENT.map((stat) => (
                <StatCard
                  key={stat.key}
                  icon={stat.icon}
                  label={stat.label}
                  value={value(stat.key)}
                  tone={stat.tone}
                  href={stat.href}
                  loading={isLoading}
                />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <AdminSection
              title="Atividade recente"
              description="Últimas alterações feitas no painel"
              flush
              className="xl:col-span-2"
              actions={
                <Link href="/admin/auditoria" className={buttonClass('ghost', 'sm', 'text-[#0052a3]')}>
                  <FaHistory aria-hidden="true" className="h-3.5 w-3.5" />
                  Ver auditoria
                </Link>
              }
            >
              {isLoading ? (
                <ul aria-hidden="true" className="divide-y divide-gray-100">
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center gap-3 px-4 py-4 sm:px-6">
                      <span className="size-9 shrink-0 animate-pulse rounded-full bg-gray-100" />
                      <span className="flex-1 space-y-2">
                        <span className="block h-3.5 w-2/3 animate-pulse rounded bg-gray-100" />
                        <span className="block h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : recent.length === 0 ? (
                <EmptyState icon={FaHistory} title="Nenhuma atividade ainda" description="As criações, edições e exclusões feitas no painel aparecem aqui." />
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recent.map((item) => {
                    const action = ACTIONS[item.action] ?? { label: item.action, icon: FaHistory, className: 'bg-gray-100 text-gray-500' };
                    const ActionIcon = action.icon;
                    const table = TABLES[item.table_name] ?? item.table_name;
                    const title =
                      item.record_title ||
                      (item.action === 'LOGIN' ? 'Acesso ao painel' : item.action === 'LOGOUT' ? 'Saída do painel' : table);
                    const ago = timeAgo(item.created_at);
                    return (
                      <li key={item.id} className="flex items-start gap-3 px-4 py-3.5 sm:px-6">
                        <span className={cx('mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full', action.className)}>
                          <ActionIcon aria-hidden="true" className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold text-gray-900">{title}</p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {action.label} em {table}
                            {item.user_name && (
                              <>
                                {' · '}
                                <span className="whitespace-nowrap">{item.user_name}</span>
                              </>
                            )}
                            {/* No celular o horário vem nesta linha, liberando largura para o título */}
                            <span className="sm:hidden">
                              {' · '}
                              <time dateTime={item.created_at} className="whitespace-nowrap">
                                {ago}
                              </time>
                            </span>
                          </p>
                        </div>
                        <time
                          dateTime={item.created_at}
                          title={new Date(item.created_at).toLocaleString('pt-BR', { timeZone: 'America/Bahia' })}
                          className="hidden shrink-0 pt-0.5 text-xs whitespace-nowrap text-gray-500 tabular-nums sm:block"
                        >
                          {ago}
                        </time>
                      </li>
                    );
                  })}
                </ul>
              )}
            </AdminSection>

            <AdminSection title="Ações rápidas" description="Atalhos para o dia a dia" flush>
              <ul className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2 xl:grid-cols-1">
                {QUICK_ACTIONS.map(({ label, description, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cx(
                        'group flex min-h-14 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#003f7f]/[0.04]',
                        focusRing
                      )}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#003f7f] text-white shadow-[0_8px_18px_-10px_rgba(0,63,127,0.8)]">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-gray-900 group-hover:text-[#003f7f]">{label}</span>
                        <span className="block truncate text-xs text-gray-500">{description}</span>
                      </span>
                      <FaChevronRight
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0 text-gray-300 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-[#003f7f] motion-reduce:transition-none"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </AdminSection>
          </div>
        </>
      )}
    </div>
  );
}
