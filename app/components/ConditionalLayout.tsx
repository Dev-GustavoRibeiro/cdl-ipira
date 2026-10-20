'use client';

import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import AccessibilityWidget from './AccessibilityWidget';
import InstallAppPrompt from './InstallAppPrompt';
import CookieConsent from './CookieConsent';
import LoadingScreen from './LoadingScreen';

/** Usado apenas em rotas públicas (grupo `(site)`). Admin fica fora deste layout. */
export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
      <AccessibilityWidget />
      <InstallAppPrompt />
      <CookieConsent />
    </>
  );
}




