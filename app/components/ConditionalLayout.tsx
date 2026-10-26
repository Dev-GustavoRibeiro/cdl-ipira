import { Atkinson_Hyperlegible } from 'next/font/google';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import AccessibilityWidget from './AccessibilityWidget';
import InstallAppPrompt from './InstallAppPrompt';
import CookieConsent from './CookieConsent';
import LoadingScreen from './LoadingScreen';
import { bootScript } from './accessibility/prefs';

// Fonte legível do painel de acessibilidade (Braille Institute, licença OFL). Auto-hospedada pelo next/font e sem
// preload: o arquivo só é baixado quando a opção está ligada (a classe só define a variável --font-legivel).
// Versão clássica (400/700): a "Next" variável não tem métricas de fallback no next/font e avisava no build.
const legivel = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-legivel', display: 'swap', preload: false });

/**
 * Usado apenas em rotas públicas (grupo `(site)`). Admin fica fora deste layout.
 * Componente de servidor: o script de acessibilidade sai no HTML e roda antes de o navegador pintar o resto da página.
 */
export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Preferências de acessibilidade gravadas (texto maior, alto contraste...) aplicadas antes da primeira pintura */}
      <script dangerouslySetInnerHTML={{ __html: bootScript(legivel.variable) }} />
      {/* Visível só ao receber foco pelo teclado (.skip-link em globals.css) */}
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <LoadingScreen />
      <Header />
      <main id="conteudo" tabIndex={-1} className="scroll-mt-[var(--header-height,0px)]">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <AccessibilityWidget fontVar={legivel.variable} />
      <InstallAppPrompt />
      <CookieConsent />
    </>
  );
}
