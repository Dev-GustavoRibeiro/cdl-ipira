'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaTimes, 
  FaShareAlt, 
  FaPlusSquare, 
  FaEllipsisV,
  FaChrome,
  FaApple,
  FaAndroid,
  FaHome
} from 'react-icons/fa';
import { IoShareOutline } from 'react-icons/io5';

type DeviceType = 'ios' | 'android' | 'unknown';

export default function InstallAppPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('unknown');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setMounted(true);
    
    // Detectar tipo de dispositivo
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    // Verificar se é um app instalado (PWA standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    
    // Verificar se já foi exibido recentemente
    const lastShown = localStorage.getItem('install-prompt-shown');
    const dayInMs = 24 * 60 * 60 * 1000 * 7; // 7 dias
    const shouldShow = !lastShown || (Date.now() - parseInt(lastShown)) > dayInMs;

    if (!isStandalone && shouldShow && (isIOS || isAndroid)) {
      setDeviceType(isIOS ? 'ios' : 'android');
      // Mostrar após 3 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('install-prompt-shown', Date.now().toString());
  };

  const handleNeverShow = () => {
    setIsOpen(false);
    // Marcar para não mostrar mais (data muito no futuro)
    localStorage.setItem('install-prompt-shown', (Date.now() + 365 * 24 * 60 * 60 * 1000 * 10).toString());
  };

  const nextStep = () => {
    if (deviceType === 'ios' && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (deviceType === 'android' && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!mounted || !isOpen) return null;

  const totalSteps = 3;

  // Conteúdo para iOS
  const IOSContent = () => (
    <div className="space-y-4">
      {/* Ícone do dispositivo */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
          <FaApple className="w-10 h-10 text-gray-600" />
        </div>
      </div>

      {/* Passos */}
      <div className="bg-gray-50 rounded-xl p-5">
        {currentStep === 1 && (
          <div className="text-center space-y-4 animate-blur-fade-in">
            <div className="w-16 h-16 mx-auto bg-[var(--cdl-blue)] rounded-xl flex items-center justify-center">
              <IoShareOutline className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Passo 1: Toque em Compartilhar</h3>
            <p className="text-gray-600">
              Toque no ícone de <strong>compartilhar</strong> <IoShareOutline className="inline w-4 h-4 text-[var(--cdl-blue)]" /> na barra inferior do Safari.
            </p>
            <div className="bg-white rounded-lg p-3 border-2 border-dashed border-[var(--cdl-blue)]">
              <div className="flex items-center justify-center gap-6 text-gray-400">
                <span className="text-2xl">‹</span>
                <span className="text-2xl">›</span>
                <IoShareOutline className="w-6 h-6 text-[var(--cdl-blue)] animate-bounce" />
                <span className="text-2xl">📑</span>
                <span className="text-2xl">⬜</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center space-y-4 animate-blur-fade-in">
            <div className="w-16 h-16 mx-auto bg-[var(--cdl-blue)] rounded-xl flex items-center justify-center">
              <FaPlusSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Passo 2: Adicionar à Tela de Início</h3>
            <p className="text-gray-600">
              Role para baixo e toque em <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
            </p>
            <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">📖</div>
                <span className="text-gray-700">Adicionar à Lista de Leitura</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[var(--cdl-yellow)]/20 border-2 border-[var(--cdl-yellow)]">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <FaPlusSquare className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-700 font-semibold">Adicionar à Tela de Início</span>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">🔖</div>
                <span className="text-gray-700">Adicionar Marcador</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center space-y-4 animate-blur-fade-in">
            <div className="w-16 h-16 mx-auto bg-[var(--cdl-green)] rounded-xl flex items-center justify-center">
              <FaHome className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Passo 3: Confirmar</h3>
            <p className="text-gray-600">
              Toque em <strong>&quot;Adicionar&quot;</strong> no canto superior direito para finalizar.
            </p>
            <div className="bg-white rounded-lg overflow-hidden border shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--cdl-blue)] font-medium">Cancelar</span>
                <span className="font-bold">Adicionar à Tela de Início</span>
                <span className="text-[var(--cdl-blue)] font-semibold bg-[var(--cdl-yellow)]/30 px-2 py-1 rounded">Adicionar</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img src="/logo-cdl.png" alt="CDL Ipirá" className="w-12 h-12 rounded-xl shadow" />
                <div className="text-left">
                  <p className="font-semibold">CDL Ipirá</p>
                  <p className="text-sm text-gray-500">cdlipira.com.br</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Conteúdo para Android
  const AndroidContent = () => (
    <div className="space-y-4">
      {/* Ícone do dispositivo */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-inner">
          <FaAndroid className="w-10 h-10 text-green-600" />
        </div>
      </div>

      {/* Passos */}
      <div className="bg-gray-50 rounded-xl p-5">
        {currentStep === 1 && (
          <div className="text-center space-y-4 animate-blur-fade-in">
            <div className="w-16 h-16 mx-auto bg-[var(--cdl-blue)] rounded-xl flex items-center justify-center">
              <FaEllipsisV className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Passo 1: Abra o Menu</h3>
            <p className="text-gray-600">
              Toque nos <strong>três pontinhos</strong> <FaEllipsisV className="inline w-3 h-3 text-[var(--cdl-blue)]" /> no canto superior direito do Chrome.
            </p>
            <div className="bg-white rounded-lg p-3 border-2 border-dashed border-[var(--cdl-blue)]">
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <FaChrome className="w-6 h-6 text-blue-500" />
                <span className="flex-1 text-left text-sm text-gray-500 bg-gray-100 rounded px-2 py-1">cdlipira.com.br</span>
                <FaEllipsisV className="w-5 h-5 text-[var(--cdl-blue)] animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center space-y-4 animate-blur-fade-in">
            <div className="w-16 h-16 mx-auto bg-[var(--cdl-blue)] rounded-xl flex items-center justify-center">
              <FaPlusSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Passo 2: Adicionar à Tela Inicial</h3>
            <p className="text-gray-600">
              Toque em <strong>&quot;Adicionar à tela inicial&quot;</strong> ou <strong>&quot;Instalar aplicativo&quot;</strong>.
            </p>
            <div className="bg-white rounded-lg overflow-hidden border shadow-sm">
              <div className="flex items-center gap-3 p-3 border-b">
                <span className="text-xl">🔄</span>
                <span className="text-gray-700">Nova guia</span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b">
                <span className="text-xl">⭐</span>
                <span className="text-gray-700">Favoritos</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[var(--cdl-yellow)]/20 border-2 border-[var(--cdl-yellow)]">
                <FaPlusSquare className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-semibold">Adicionar à tela inicial</span>
              </div>
              <div className="flex items-center gap-3 p-3 border-b">
                <span className="text-xl">📲</span>
                <span className="text-gray-700">Instalar aplicativo</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center space-y-4 animate-blur-fade-in">
            <div className="w-16 h-16 mx-auto bg-[var(--cdl-green)] rounded-xl flex items-center justify-center">
              <FaHome className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Passo 3: Confirmar Instalação</h3>
            <p className="text-gray-600">
              Toque em <strong>&quot;Adicionar&quot;</strong> para confirmar e criar o atalho.
            </p>
            <div className="bg-white rounded-lg overflow-hidden border shadow-sm p-4">
              <p className="text-gray-700 mb-4">Adicionar à tela inicial?</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                <img src="/logo-cdl.png" alt="CDL Ipirá" className="w-12 h-12 rounded-xl shadow" />
                <div className="text-left">
                  <p className="font-semibold">CDL Ipirá</p>
                  <p className="text-sm text-gray-500">cdlipira.com.br</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 text-gray-600">Cancelar</button>
                <button className="flex-1 py-2 bg-[var(--cdl-blue)] text-white rounded-lg font-semibold">Adicionar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-prompt-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--cdl-blue)] to-[var(--cdl-blue-light)] text-white p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img src="/logo-cdl.png" alt="CDL Ipirá" className="w-10 h-10 rounded-lg bg-white p-1" />
              <div>
                <h2 id="install-prompt-title" className="text-lg font-bold">Instale o CDL Ipirá</h2>
                <p className="text-white/80 text-sm">Tenha acesso rápido ao nosso site</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Fechar"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo baseado no dispositivo */}
        <div className="p-5">
          {deviceType === 'ios' ? <IOSContent /> : <AndroidContent />}
        </div>

        {/* Indicador de passos */}
        <div className="flex items-center justify-center gap-2 py-3">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-3 h-3 rounded-full transition-all ${
                step === currentStep 
                  ? 'bg-[var(--cdl-blue)] scale-125' 
                  : step < currentStep 
                    ? 'bg-[var(--cdl-green)]' 
                    : 'bg-gray-300'
              }`}
              aria-label={`Ir para passo ${step}`}
            />
          ))}
        </div>

        {/* Footer com navegação */}
        <div className="p-4 bg-gray-50 border-t flex gap-3">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all"
            >
              Voltar
            </button>
          ) : (
            <button
              onClick={handleNeverShow}
              className="flex-1 py-3 px-4 text-gray-500 rounded-xl font-medium hover:bg-gray-100 transition-all text-sm"
            >
              Não mostrar novamente
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex-1 py-3 px-4 bg-[var(--cdl-blue)] text-white rounded-xl font-semibold hover:bg-[var(--cdl-blue-light)] transition-all"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 bg-[var(--cdl-green)] text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Entendi!
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

