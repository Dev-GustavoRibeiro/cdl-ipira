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
      <LoadingScreen />
      <Header />
      <main className="pb-20 md:pb-0">
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




