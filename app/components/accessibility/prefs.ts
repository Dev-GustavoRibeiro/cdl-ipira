/**
 * Preferências de acessibilidade: formato, leitura/gravação no localStorage e aplicação no <html>.
 * Sem 'use client': o ConditionalLayout (servidor) usa o bootScript para aplicar tudo antes da primeira pintura.
 */

export const A11Y_KEY = 'a11y-preferences';

/** Tamanho do texto: font-size do <html> em % (o Tailwind trabalha em rem, então o site inteiro acompanha). */
export const TEXT_STEPS = [100, 115, 130, 150] as const;

export interface A11yPrefs {
  text: number;
  contrast: boolean;
  grayscale: boolean;
  links: boolean;
  spacing: boolean;
  font: boolean;
  /** Pausar animações (vale como prefers-reduced-motion, ver motion.ts) */
  motion: boolean;
  cursor: boolean;
  guide: boolean;
  mask: boolean;
  libras: boolean;
}

export const DEFAULT_PREFS: A11yPrefs = {
  text: 100,
  contrast: false,
  grayscale: false,
  links: false,
  spacing: false,
  font: false,
  motion: false,
  cursor: false,
  guide: false,
  mask: false,
  libras: false,
};

// Recursos feitos só com CSS: viram a classe a11y-<nome> no <html> (globals.css). Guia, máscara e Libras são componentes.
const CLASS_KEYS = ['contrast', 'grayscale', 'links', 'spacing', 'font', 'motion', 'cursor'] as const;

// Painel antigo (até a versão 1.5): outra chave e outro formato. Vira o novo uma vez e é apagado, para quem já usava
// não perder os ajustes. ponytail: só o widget migra (o bootScript não), então a 1ª página depois da troca pisca uma vez.
const OLD_KEY = 'accessibility-settings';
type OldSettings = Partial<
  Record<'fontSize' | 'zoom' | 'lineHeight' | 'letterSpacing' | 'wordSpacing', number> &
    Record<'highlightLinks' | 'largeCursor' | 'dyslexicFont' | 'pauseAnimations' | 'readingGuide', boolean>
>;

function fromOldSettings(old: OldSettings): A11yPrefs {
  // O antigo ia de 80% a 200% (e o zoom, quando mexido, valia no lugar do tamanho): sobe para o passo seguinte, até 150%
  const size = old.zoom && old.zoom !== 100 ? old.zoom : (old.fontSize ?? 100);
  return {
    ...DEFAULT_PREFS,
    text: TEXT_STEPS.find((step) => step >= size) ?? TEXT_STEPS[TEXT_STEPS.length - 1],
    links: old.highlightLinks === true,
    cursor: old.largeCursor === true,
    font: old.dyslexicFont === true,
    motion: old.pauseAnimations === true,
    guide: old.readingGuide === true,
    // Os três controles de espaçamento (linha, letras, palavras) viraram o espaçamento WCAG
    spacing: (old.lineHeight ?? 100) > 100 || (old.letterSpacing ?? 0) > 0 || (old.wordSpacing ?? 0) > 0,
  };
}

export function readPrefs(): A11yPrefs {
  try {
    let raw = localStorage.getItem(A11Y_KEY);
    const old = localStorage.getItem(OLD_KEY);
    if (old !== null) {
      localStorage.removeItem(OLD_KEY);
      if (raw === null) localStorage.setItem(A11Y_KEY, (raw = JSON.stringify(fromOldSettings(JSON.parse(old)))));
    }
    const saved = { ...DEFAULT_PREFS, ...JSON.parse(raw || '{}') } as A11yPrefs;
    return { ...saved, text: (TEXT_STEPS as readonly number[]).includes(saved.text) ? saved.text : 100 };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: A11yPrefs) {
  try {
    localStorage.setItem(A11Y_KEY, JSON.stringify(prefs));
  } catch {
    // Sem storage (aba privada, bloqueio): vale só nesta página
  }
}

/** Quantos ajustes estão ligados (selo do botão flutuante). */
export const countActive = (prefs: A11yPrefs) =>
  (Object.keys(DEFAULT_PREFS) as (keyof A11yPrefs)[]).filter((key) => prefs[key] !== DEFAULT_PREFS[key]).length;

/** Mesma regra do bootScript. fontVar: classe do next/font que define --font-legivel. */
export function applyPrefs(prefs: A11yPrefs, fontVar: string) {
  const root = document.documentElement;
  root.style.fontSize = prefs.text !== 100 ? `${prefs.text}%` : '';
  // a11y-text: texto ampliado (globals.css deixa palavras longas quebrarem em vez de alargar a página). O nível vai em
  // data-a11y-text: a variante desk só liga o header desktop onde ele cabe com esse tamanho.
  root.classList.toggle('a11y-text', prefs.text !== 100);
  root.dataset.a11yText = String(prefs.text);
  root.classList.add(fontVar);
  for (const key of CLASS_KEYS) root.classList.toggle(`a11y-${key}`, prefs[key]);
}

/** Script inline síncrono (antes do Header ser lido pelo navegador): sem "piscar" o visual padrão na carga. */
export const bootScript = (fontVar: string) =>
  `try{var d=document.documentElement,p=JSON.parse(localStorage.getItem(${JSON.stringify(A11Y_KEY)})||'{}');` +
  `d.classList.add(${JSON.stringify(fontVar)});` +
  `if(${JSON.stringify(TEXT_STEPS.slice(1))}.indexOf(p.text)>=0){d.style.fontSize=p.text+'%';d.classList.add('a11y-text');d.dataset.a11yText=p.text}` +
  `${JSON.stringify(CLASS_KEYS)}.forEach(function(k){if(p[k]===true)d.classList.add('a11y-'+k)})}catch(e){}`;
