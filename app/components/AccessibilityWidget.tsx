'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaUniversalAccess, 
  FaTimes, 
  FaPlus, 
  FaMinus, 
  FaTextHeight, 
  FaLink, 
  FaMousePointer, 
  FaUndoAlt,
  FaFont,
  FaPause,
  FaPlay,
  FaRulerHorizontal,
  FaAlignJustify,
  FaVolumeUp,
  FaEye,
  FaKeyboard,
  FaSearchPlus
} from 'react-icons/fa';

interface AccessibilitySettings {
  fontSize: number;
  highlightLinks: boolean;
  largeCursor: boolean;
  lineHeight: number;
  dyslexicFont: boolean;
  pauseAnimations: boolean;
  readingGuide: boolean;
  letterSpacing: number;
  wordSpacing: number;
  focusHighlight: boolean;
  textToSpeech: boolean;
  zoom: number;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highlightLinks: false,
  largeCursor: false,
  lineHeight: 100,
  dyslexicFont: false,
  pauseAnimations: false,
  readingGuide: false,
  letterSpacing: 0,
  wordSpacing: 0,
  focusHighlight: false,
  textToSpeech: false,
  zoom: 100,
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'visual' | 'content' | 'navigation'>('visual');
  const [readingGuideY, setReadingGuideY] = useState(0);

  // Carregar configurações salvas
  useEffect(() => {
    setMounted(true);
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
        applySettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Erro ao carregar configurações de acessibilidade:', e);
      }
    }
  }, []);

  // Reading Guide - seguir o mouse
  useEffect(() => {
    if (!settings.readingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      setReadingGuideY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  // Aplicar configurações ao DOM
  const applySettings = useCallback((newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Tamanho da fonte - aplicado apenas se não estiver usando zoom
    if (newSettings.zoom === 100) {
      root.style.fontSize = `${newSettings.fontSize}%`;
    }
    
    // Destacar links
    root.classList.toggle('highlight-links', newSettings.highlightLinks);
    
    // Cursor grande
    root.classList.toggle('large-cursor', newSettings.largeCursor);
    
    // Espaçamento de linha
    root.style.setProperty('--line-height-multiplier', `${newSettings.lineHeight / 100}`);
    
    // Fonte para dislexia
    root.classList.toggle('dyslexic-font', newSettings.dyslexicFont);
    
    // Pausar animações
    root.classList.toggle('pause-animations', newSettings.pauseAnimations);
    
    // Guia de leitura
    root.classList.toggle('reading-guide-active', newSettings.readingGuide);
    
    // Espaçamento de letras
    root.style.setProperty('--letter-spacing', `${newSettings.letterSpacing}px`);
    root.classList.toggle('custom-letter-spacing', newSettings.letterSpacing > 0);
    
    // Espaçamento de palavras
    root.style.setProperty('--word-spacing', `${newSettings.wordSpacing}px`);
    root.classList.toggle('custom-word-spacing', newSettings.wordSpacing > 0);
    
    // Destaque de foco
    root.classList.toggle('focus-highlight', newSettings.focusHighlight);
    
    // Zoom - usando font-size para não quebrar responsividade
    root.style.setProperty('--page-zoom', `${newSettings.zoom / 100}`);
    root.classList.toggle('custom-zoom', newSettings.zoom !== 100);
    
  }, []);

  // Salvar e aplicar configurações
  const updateSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  // Ajustar valores numéricos
  const adjustValue = (key: keyof AccessibilitySettings, delta: number, min: number, max: number) => {
    const currentValue = settings[key] as number;
    const newValue = Math.min(max, Math.max(min, currentValue + delta));
    updateSettings({ ...settings, [key]: newValue });
  };

  // Toggle de opções booleanas
  const toggleOption = (option: keyof AccessibilitySettings) => {
    if (typeof settings[option] === 'boolean') {
      updateSettings({ ...settings, [option]: !settings[option] });
    }
  };

  // Resetar para padrão
  const resetSettings = () => {
    updateSettings(defaultSettings);
  };

  // Ler texto selecionado
  const speakSelectedText = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const utterance = new SpeechSynthesisUtterance(selection.toString());
      utterance.lang = 'pt-BR';
      speechSynthesis.speak(utterance);
    }
  };

  if (!mounted) return null;

  // Componente de slider ajustável
  const AdjustableSlider = ({ 
    label, 
    value, 
    unit, 
    icon: Icon, 
    onDecrease, 
    onIncrease,
    min,
    max 
  }: { 
    label: string; 
    value: number; 
    unit: string; 
    icon: React.ElementType; 
    onDecrease: () => void; 
    onIncrease: () => void;
    min: number;
    max: number;
  }) => (
    <div className="bg-gray-50 rounded-xl p-3 md:p-4">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-[var(--cdl-blue)]" />
          <span className="font-semibold text-gray-700 text-xs md:text-sm">{label}</span>
        </div>
        <span className="text-xs md:text-sm font-medium text-[var(--cdl-blue)]">{value}{unit}</span>
      </div>
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <button
          onClick={onDecrease}
          disabled={value <= min}
          className="w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-[var(--cdl-blue)] hover:text-[var(--cdl-blue)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Diminuir ${label.toLowerCase()}`}
        >
          <FaMinus className="w-2.5 h-2.5 md:w-3 md:h-3" />
        </button>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--cdl-blue)] transition-all duration-300"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
        <button
          onClick={onIncrease}
          disabled={value >= max}
          className="w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-[var(--cdl-blue)] hover:text-[var(--cdl-blue)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          <FaPlus className="w-2.5 h-2.5 md:w-3 md:h-3" />
        </button>
      </div>
    </div>
  );

  // Componente de toggle
  const ToggleButton = ({ 
    label, 
    description,
    active, 
    icon: Icon, 
    onClick 
  }: { 
    label: string; 
    description?: string;
    active: boolean; 
    icon: React.ElementType; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2 md:p-3 rounded-xl border-2 transition-all text-left ${
        active 
          ? 'border-[var(--cdl-green)] bg-green-50' 
          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <Icon className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${active ? 'text-[var(--cdl-green)]' : 'text-gray-500'}`} />
        <div className="min-w-0">
          <span className="font-medium text-gray-700 text-xs md:text-sm block truncate">{label}</span>
          {description && <p className="text-[10px] md:text-xs text-gray-500 truncate">{description}</p>}
        </div>
      </div>
      <div className={`w-9 h-5 md:w-11 md:h-6 rounded-full transition-all flex-shrink-0 ml-2 ${active ? 'bg-[var(--cdl-green)]' : 'bg-gray-300'}`}>
        <div className={`w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full shadow-md transform transition-transform mt-0.5 md:mt-1 ${active ? 'translate-x-4 md:translate-x-6' : 'translate-x-1'}`} />
      </div>
    </button>
  );

  return (
    <>
      {/* Guia de leitura */}
      {settings.readingGuide && (
        <div 
          className="fixed left-0 right-0 h-12 bg-yellow-300/30 pointer-events-none z-[9999] transition-all duration-75"
          style={{ top: `${readingGuideY - 24}px` }}
        />
      )}

      {/* Botão flutuante de acessibilidade */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-3 bottom-20 md:left-4 md:bottom-6 z-40 w-12 h-12 md:w-14 md:h-14 bg-[var(--cdl-blue)] hover:bg-[var(--cdl-blue-light)] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[var(--cdl-yellow)]"
        aria-label="Abrir menu de acessibilidade"
        title="Acessibilidade"
      >
        <FaUniversalAccess className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Modal de acessibilidade */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9998] flex items-end md:items-center justify-center md:p-4 bg-black/50"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-md max-h-[85vh] md:max-h-[80vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-title"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--cdl-blue)] to-[var(--cdl-blue-light)] text-white p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <FaUniversalAccess className="w-5 h-5 md:w-6 md:h-6" />
                <h2 id="accessibility-title" className="text-base md:text-lg font-bold">Acessibilidade</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Fechar menu de acessibilidade"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
              <button
                onClick={() => setActiveTab('visual')}
                className={`flex-1 py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'visual' 
                    ? 'text-[var(--cdl-blue)] border-b-2 border-[var(--cdl-blue)] bg-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaEye className="w-4 h-4 mx-auto mb-1" />
                Visual
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'content' 
                    ? 'text-[var(--cdl-blue)] border-b-2 border-[var(--cdl-blue)] bg-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaFont className="w-4 h-4 mx-auto mb-1" />
                Conteúdo
              </button>
              <button
                onClick={() => setActiveTab('navigation')}
                className={`flex-1 py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'navigation' 
                    ? 'text-[var(--cdl-blue)] border-b-2 border-[var(--cdl-blue)] bg-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaKeyboard className="w-4 h-4 mx-auto mb-1" />
                Navegação
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-3 md:p-4 space-y-2 md:space-y-3 overflow-y-auto max-h-[50vh] md:max-h-[45vh]">
              {/* Tab Visual */}
              {activeTab === 'visual' && (
                <>
                  {/* Zoom da página */}
                  <AdjustableSlider
                    label="Zoom da Página"
                    value={settings.zoom}
                    unit="%"
                    icon={FaSearchPlus}
                    min={80}
                    max={200}
                    onDecrease={() => adjustValue('zoom', -10, 80, 200)}
                    onIncrease={() => adjustValue('zoom', 10, 80, 200)}
                  />

                  <ToggleButton
                    label="Pausar Animações"
                    description="Para todas as animações da página"
                    icon={settings.pauseAnimations ? FaPlay : FaPause}
                    active={settings.pauseAnimations}
                    onClick={() => toggleOption('pauseAnimations')}
                  />
                </>
              )}

              {/* Tab Conteúdo */}
              {activeTab === 'content' && (
                <>
                  {/* Tamanho da Fonte */}
                  <AdjustableSlider
                    label="Tamanho da Fonte"
                    value={settings.fontSize}
                    unit="%"
                    icon={FaTextHeight}
                    min={80}
                    max={200}
                    onDecrease={() => adjustValue('fontSize', -10, 80, 200)}
                    onIncrease={() => adjustValue('fontSize', 10, 80, 200)}
                  />

                  {/* Espaçamento de Linha */}
                  <AdjustableSlider
                    label="Espaçamento de Linha"
                    value={settings.lineHeight}
                    unit="%"
                    icon={FaAlignJustify}
                    min={100}
                    max={300}
                    onDecrease={() => adjustValue('lineHeight', -25, 100, 300)}
                    onIncrease={() => adjustValue('lineHeight', 25, 100, 300)}
                  />

                  {/* Espaçamento de Letras */}
                  <AdjustableSlider
                    label="Espaçamento de Letras"
                    value={settings.letterSpacing}
                    unit="px"
                    icon={FaFont}
                    min={0}
                    max={10}
                    onDecrease={() => adjustValue('letterSpacing', -1, 0, 10)}
                    onIncrease={() => adjustValue('letterSpacing', 1, 0, 10)}
                  />

                  {/* Espaçamento de Palavras */}
                  <AdjustableSlider
                    label="Espaçamento de Palavras"
                    value={settings.wordSpacing}
                    unit="px"
                    icon={FaRulerHorizontal}
                    min={0}
                    max={20}
                    onDecrease={() => adjustValue('wordSpacing', -2, 0, 20)}
                    onIncrease={() => adjustValue('wordSpacing', 2, 0, 20)}
                  />

                  <ToggleButton
                    label="Fonte para Dislexia"
                    description="Usa fonte OpenDyslexic"
                    icon={FaFont}
                    active={settings.dyslexicFont}
                    onClick={() => toggleOption('dyslexicFont')}
                  />

                  {/* Botão de Leitura */}
                  <button
                    onClick={speakSelectedText}
                    className="w-full flex items-center justify-center gap-2 p-2 md:p-3 rounded-xl border-2 border-[var(--cdl-blue)] bg-[var(--cdl-blue)]/10 text-[var(--cdl-blue)] hover:bg-[var(--cdl-blue)]/20 transition-all font-medium text-xs md:text-sm"
                  >
                    <FaVolumeUp className="w-3 h-3 md:w-4 md:h-4" />
                    Ler Texto Selecionado
                  </button>
                </>
              )}

              {/* Tab Navegação */}
              {activeTab === 'navigation' && (
                <>
                  <ToggleButton
                    label="Guia de Leitura"
                    description="Linha horizontal que segue o mouse"
                    icon={FaRulerHorizontal}
                    active={settings.readingGuide}
                    onClick={() => toggleOption('readingGuide')}
                  />
                  <ToggleButton
                    label="Destacar Links"
                    description="Realça todos os links da página"
                    icon={FaLink}
                    active={settings.highlightLinks}
                    onClick={() => toggleOption('highlightLinks')}
                  />
                  <ToggleButton
                    label="Cursor Grande"
                    description="Aumenta o tamanho do cursor"
                    icon={FaMousePointer}
                    active={settings.largeCursor}
                    onClick={() => toggleOption('largeCursor')}
                  />
                  <ToggleButton
                    label="Destaque de Foco"
                    description="Destaca elemento em foco"
                    icon={FaKeyboard}
                    active={settings.focusHighlight}
                    onClick={() => toggleOption('focusHighlight')}
                  />
                </>
              )}
            </div>

            {/* Botão Resetar */}
            <div className="p-3 md:p-4 border-t">
              <button
                onClick={resetSettings}
                className="w-full flex items-center justify-center gap-2 p-2 md:p-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 transition-all font-medium text-xs md:text-sm"
              >
                <FaUndoAlt className="w-3 h-3 md:w-4 md:h-4" />
                Restaurar Padrões
              </button>
            </div>

            {/* Footer */}
            <div className="px-3 pb-3 md:px-4 md:pb-4 text-center text-[10px] md:text-xs text-gray-500">
              Configurações salvas automaticamente
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
