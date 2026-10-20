'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useIsClient, useModalBehavior } from '@/lib/hooks/useModalBehavior';
import { 
  FaCookieBite, 
  FaCheck, 
  FaCog,
  FaShieldAlt,
  FaChartBar,
  FaBullhorn,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

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

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isClient = useIsClient();
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  // Escolha obrigatória: sem fechar com Esc, mas com foco preso no diálogo
  const dialogRef = useModalBehavior<HTMLDivElement>(isOpen);

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

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center bg-black/30 backdrop-blur-sm">
      <div 
        ref={dialogRef}
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--cdl-blue)] to-[var(--cdl-blue-light)] text-white p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaCookieBite className="w-6 h-6" />
            </div>
            <div>
              <h2 id="cookie-consent-title" className="text-xl font-bold">
                Política de Cookies
              </h2>
              <p className="text-white/80 text-sm">
                Respeitamos sua privacidade
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência em nosso site, 
            personalizar conteúdo, analisar o tráfego e fornecer funcionalidades de redes sociais. 
            Você pode escolher quais cookies deseja aceitar.
          </p>

          {/* Botão para mostrar/ocultar detalhes */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            className="flex items-center gap-2 text-[var(--cdl-blue)] font-medium text-sm hover:underline"
          >
            <FaCog className="w-4 h-4" />
            Personalizar preferências
            {showDetails ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
          </button>

          {/* Detalhes das preferências */}
          {showDetails && (
            <div className="space-y-3 pt-2 animate-blur-fade-in">
              {/* Cookies Necessários */}
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-[var(--cdl-green)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--cdl-green)]/20 rounded-lg flex items-center justify-center">
                      <FaShieldAlt className="w-5 h-5 text-[var(--cdl-green)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Necessários</h3>
                      <p className="text-xs text-gray-500">Essenciais para o funcionamento</p>
                    </div>
                  </div>
                  <div className="bg-[var(--cdl-green)] text-white text-xs px-3 py-1 rounded-full font-medium">
                    Sempre ativo
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Estes cookies são essenciais para que você possa navegar pelo site e usar seus recursos básicos, 
                  como acessar áreas seguras. Sem estes cookies, o site não pode funcionar corretamente.
                </p>
              </div>

              {/* Cookies de Análise */}
              <button
                type="button"
                onClick={() => togglePreference('analytics')}
                aria-pressed={preferences.analytics}
                className={`w-full bg-gray-50 rounded-xl p-4 border-2 text-left transition-all ${
                  preferences.analytics ? 'border-[var(--cdl-green)]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      preferences.analytics ? 'bg-[var(--cdl-green)]/20' : 'bg-gray-200'
                    }`}>
                      <FaChartBar className={`w-5 h-5 ${preferences.analytics ? 'text-[var(--cdl-green)]' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Análise</h3>
                      <p className="text-xs text-gray-500">Estatísticas e melhorias</p>
                    </div>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-all ${preferences.analytics ? 'bg-[var(--cdl-green)]' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-1 ${preferences.analytics ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Nos ajudam a entender como os visitantes interagem com o site, coletando informações 
                  anonimamente para melhorar continuamente a experiência do usuário.
                </p>
              </button>

              {/* Cookies de Marketing */}
              <button
                type="button"
                onClick={() => togglePreference('marketing')}
                aria-pressed={preferences.marketing}
                className={`w-full bg-gray-50 rounded-xl p-4 border-2 text-left transition-all ${
                  preferences.marketing ? 'border-[var(--cdl-green)]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      preferences.marketing ? 'bg-[var(--cdl-green)]/20' : 'bg-gray-200'
                    }`}>
                      <FaBullhorn className={`w-5 h-5 ${preferences.marketing ? 'text-[var(--cdl-green)]' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Marketing</h3>
                      <p className="text-xs text-gray-500">Publicidade personalizada</p>
                    </div>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-all ${preferences.marketing ? 'bg-[var(--cdl-green)]' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-1 ${preferences.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Utilizados para rastrear visitantes em diferentes sites, permitindo exibir anúncios 
                  mais relevantes e personalizados com base em seus interesses.
                </p>
              </button>

              {/* Cookies de Preferências */}
              <button
                type="button"
                onClick={() => togglePreference('preferences')}
                aria-pressed={preferences.preferences}
                className={`w-full bg-gray-50 rounded-xl p-4 border-2 text-left transition-all ${
                  preferences.preferences ? 'border-[var(--cdl-green)]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      preferences.preferences ? 'bg-[var(--cdl-green)]/20' : 'bg-gray-200'
                    }`}>
                      <FaCog className={`w-5 h-5 ${preferences.preferences ? 'text-[var(--cdl-green)]' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Preferências</h3>
                      <p className="text-xs text-gray-500">Personalização do site</p>
                    </div>
                  </div>
                  <div className={`w-12 h-7 rounded-full transition-all ${preferences.preferences ? 'bg-[var(--cdl-green)]' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-1 ${preferences.preferences ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Permitem que o site lembre de suas preferências, como idioma, região e outras 
                  configurações, para oferecer uma experiência mais personalizada.
                </p>
              </button>
            </div>
          )}
        </div>

        {/* Footer com botões */}
        <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
          {showDetails ? (
            <>
              <button
                onClick={handleAcceptNecessary}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all text-sm"
              >
                Apenas necessários
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 py-3 px-4 bg-[var(--cdl-blue)] text-white rounded-xl font-semibold hover:bg-[var(--cdl-blue-light)] transition-all text-sm flex items-center justify-center gap-2"
              >
                <FaCheck className="w-4 h-4" />
                Salvar preferências
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleAcceptNecessary}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all text-sm"
              >
                Apenas necessários
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-3 px-4 bg-[var(--cdl-green)] text-white rounded-xl font-semibold hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2"
              >
                <FaCheck className="w-4 h-4" />
                Aceitar todos
              </button>
            </>
          )}
        </div>

        {/* Link para política de privacidade */}
        <div className="px-4 pb-4 text-center">
          {/* Ainda não existe página de política de privacidade: dúvidas vão para o contato */}
          <Link 
            href="/imprensa/contato" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-[var(--cdl-blue)] hover:underline"
          >
            Dúvidas sobre privacidade? Fale conosco
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}

