/**
 * "Pausar animações" = a preferência do sistema por menos movimento. Com a classe a11y-motion no <html>, toda consulta
 * a prefers-reduced-motion feita pelo JS responde "reduce": gsap.matchMedia(MOTION_OK), autoplay e velocidade dos
 * carrosséis, Ken Burns e parallax seguem o mesmo caminho já testado para quem liga a opção no sistema, sem cada
 * componente precisar conhecer a classe. O CSS (animações e transições) fica com globals.css.
 *
 * Instalado no carregamento do módulo do widget, antes da hidratação (ninguém chamou matchMedia ainda).
 */

const MOTION_CLASS = 'a11y-motion';

// Lida a cada consulta: ligar e desligar valem na hora para o JS também (o SectionCarousel recria o Swiper com segurança)
const reduce = () => document.documentElement.classList.contains(MOTION_CLASS);

// Uma lista por consulta (sempre o mesmo objeto): quem assinou o 'change' recebe o aviso ao ligar/desligar a opção.
// Guardada no global para o HMR do dev não instalar o desvio duas vezes.
const store = globalThis as typeof globalThis & { __a11yMotionLists?: Map<string, MediaQueryList> };
const lists = store.__a11yMotionLists ?? new Map<string, MediaQueryList>();

// Mesma consulta com prefers-reduced-motion já resolvido como "reduce" (largura >= 0 é sempre verdadeiro; < 0, nunca)
const forceReduce = (query: string) =>
  query.replace(/\(\s*prefers-reduced-motion\s*(?::\s*(reduce|no-preference)\s*)?\)/g, (_, value) =>
    value === 'no-preference' ? '(width < 0px)' : '(width >= 0px)'
  );

if (typeof window !== 'undefined' && typeof MediaQueryList !== 'undefined' && !store.__a11yMotionLists) {
  store.__a11yMotionLists = lists;
  const native = window.matchMedia.bind(window);
  const nativeMatches = Object.getOwnPropertyDescriptor(MediaQueryList.prototype, 'matches')?.get;

  if (nativeMatches) {
    window.matchMedia = (query: string) => {
      if (!query.includes('prefers-reduced-motion')) return native(query);
      let list = lists.get(query);
      if (!list) {
        const own = native(query);
        const reduced = native(forceReduce(query));
        Object.defineProperty(own, 'matches', {
          get: () => (reduce() ? reduced.matches : nativeMatches.call(own)),
        });
        lists.set(query, (list = own));
      }
      return list;
    };
  }
}

/** Chamar depois de pôr a classe: avisa gsap.matchMedia e os useSyncExternalStore inscritos. */
export function notifyMotionChange() {
  lists.forEach((list) => list.dispatchEvent(new Event('change')));
}
