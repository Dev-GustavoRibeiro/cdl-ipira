'use client';

import React, { useState, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useIsClient } from '@/lib/hooks/useModalBehavior';
import {
  FaCookieBite,
  FaCheck,
  FaCog,
  FaShieldAlt,
  FaChartBar,
  FaBullhorn,
  FaChevronDown,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Sempre ativo
  analytics: false,
  marketing: false,
  preferences: false,
};

const OPTIONAL: { key: Exclude<keyof CookiePreferences, 'necessary'>; icon: IconType; title: string; summary: string; text: string }[] = [
  {
    key: 'analytics',
    icon: FaChartBar,
    title: 'Análise',
    summary: 'Estatísticas e melhorias',
    text: 'Nos ajudam a entender como os visitantes interagem com o site, coletando informações anonimamente para melhorar continuamente a experiência do usuário.',
  },
  {
    key: 'marketing',
    icon: FaBullhorn,
    title: 'Marketing',
    summary: 'Publicidade personalizada',
    text: 'Utilizados para rastrear visitantes em diferentes sites, permitindo exibir anúncios mais relevantes e personalizados com base em seus interesses.',
  },
  {
    key: 'preferences',
    icon: FaCog,
    title: 'Preferências',
    summary: 'Personalização do site',
    text: 'Permitem que o site lembre de suas preferências, como idioma, região e outras configurações, para oferecer uma experiência mais personalizada.',
  },
];

const BUTTON =
  'inline-flex min-h-11 flex-1 items-center whitespace-nowrap justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-[background-color,box-shadow,scale] duration-200 active:scale-[0.98] motion-reduce:transition-none';

/**
 * Aviso de cookies (LGPD): cartão flutuante que não bloqueia a página.
 * Nada além dos cookies necessários é usado até a escolha ser salva em localStorage 'cookie-consent'.
 */
export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isClient = useIsClient();
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const uid = useId();
  const titleId = `${uid}-titulo`;
  const textId = `${uid}-texto`;
  const detailsId = `${uid}-detalhes`;

  useEffect(() => {
    // Verificar se já escolheu (se já escolheu, o banner não abre e as preferências não são usadas)
    let consent: string | null = null;
    try {
      consent = localStorage.getItem('cookie-consent');
    } catch {
      // Storage bloqueado: mostra o banner
    }
    if (consent) return;

    // Mostra só depois da tela de carregamento (~900ms), para os avisos não se sobreporem
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Salva a escolha (o convite de instalar o app só aparece depois dela)
  const saveConsent = (value: CookiePreferences) => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(value));
      localStorage.setItem('cookie-consent-date', new Date().toISOString());
    } catch {
      // Sem storage o banner volta na próxima visita
    }
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Não pode desativar os necessários
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isClient || !isOpen) return null;

  // Celular: acima da barra de navegação e do botão de acessibilidade. Desktop: canto inferior esquerdo, acima do botão de acessibilidade.
  // z-55: sobre a barra inferior (z-50), mas sob o menu do celular quando aberto (z-60/70).
  return createPortal(
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={textId}
      className="fixed inset-x-3 bottom-36 z-55 flex max-h-[calc(100dvh-10rem)] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,26,61,0.55)] ring-1 ring-[#003f7f]/10 animate-[slide-up_0.4s_ease-out] sm:inset-x-auto sm:left-4 sm:w-[27rem] lg:bottom-24"
    >
      <div aria-hidden="true" className="h-1.5 shrink-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />

      <div className="overflow-y-auto overscroll-contain px-5 pt-5 pb-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffd000] text-[#003f7f] shadow-sm">
            <FaCookieBite className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-[#0066cc] uppercase">Privacidade</p>
            <h2 id={titleId} className="text-lg font-black leading-tight tracking-tight text-[#003f7f]">
              Política de Cookies
            </h2>
          </div>
        </div>

        <p id={textId} className="mt-4 text-sm leading-relaxed text-pretty text-gray-600">
          Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência em nosso site,
          personalizar conteúdo, analisar o tráfego e fornecer funcionalidades de redes sociais.
          Você pode escolher quais cookies deseja aceitar.
        </p>

        {showDetails && (
          <ul id={detailsId} className="mt-4 space-y-2.5 animate-[slide-down_0.2s_ease-out]">
            {/* Cookies Necessários */}
            <li className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00a859]/15 text-[#00a859]">
                  <FaShieldAlt className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-gray-900">Necessários</h3>
                  <p className="text-xs text-gray-500">Essenciais para o funcionamento</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#003f7f] ring-1 ring-[#00a859]/30">
                  <FaCheck aria-hidden="true" className="h-2.5 w-2.5 text-[#00a859]" />
                  Sempre ativo
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-gray-500">
                Estes cookies são essenciais para que você possa navegar pelo site e usar seus recursos básicos,
                como acessar áreas seguras. Sem estes cookies, o site não pode funcionar corretamente.
              </p>
            </li>

            {OPTIONAL.map(({ key, icon: Icon, title, summary, text }) => {
              const on = preferences[key];
              const switchId = `${uid}-${key}`;
              return (
                <li key={key} className={`rounded-2xl p-4 ring-1 transition-colors ${on ? 'bg-[#00a859]/5 ring-[#00a859]/30' : 'bg-gray-50 ring-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${on ? 'bg-[#00a859]/15 text-[#00a859]' : 'bg-gray-200 text-gray-500'}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <label htmlFor={switchId} className="min-w-0 flex-1 cursor-pointer">
                      <span className="block text-sm font-bold text-gray-900">{title}</span>
                      <span className="block text-xs text-gray-500">{summary}</span>
                    </label>
                    <button
                      id={switchId}
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-describedby={`${switchId}-texto`}
                      onClick={() => togglePreference(key)}
                      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-[#00a859]' : 'bg-gray-300'}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-[translate] duration-200 motion-reduce:transition-none ${on ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                  <p id={`${switchId}-texto`} className="mt-2.5 text-xs leading-relaxed text-gray-500">{text}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Botões */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-5 pt-4 pb-4 sm:px-6">
        {/* Sem espaço lado a lado, os botões empilham com o principal em cima */}
        <div className="flex flex-wrap-reverse gap-2.5">
          <button
            type="button"
            onClick={handleAcceptNecessary}
            className={`${BUTTON} bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50`}
          >
            Apenas necessários
          </button>
          <button
            type="button"
            onClick={showDetails ? handleSavePreferences : handleAcceptAll}
            className={`${BUTTON} bg-[#003f7f] text-white shadow-[0_14px_30px_-14px_rgba(0,63,127,0.7)] hover:bg-[#0052a3]`}
          >
            <FaCheck aria-hidden="true" className="h-3.5 w-3.5 text-[#00d670]" />
            {showDetails ? 'Salvar preferências' : 'Aceitar todos'}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-controls={detailsId}
            className="inline-flex items-center gap-1.5 rounded-lg py-1 font-bold text-[#003f7f] hover:underline"
          >
            <FaCog aria-hidden="true" className="h-3 w-3" />
            {showDetails ? 'Ocultar opções' : 'Personalizar'}
            <FaChevronDown aria-hidden="true" className={`h-2.5 w-2.5 transition-[rotate] duration-200 ${showDetails ? 'rotate-180' : ''}`} />
          </button>
          {/* Ainda não existe página de política de privacidade: dúvidas vão para o contato */}
          <Link
            href="/imprensa/contato"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg py-1 text-gray-500 hover:text-[#003f7f] hover:underline"
          >
            Dúvidas sobre privacidade? Fale conosco
          </Link>
        </div>
      </div>
    </section>,
    document.body
  );
}
