'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');

  useEffect(() => {
    const minDisplay = 1800;
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDisplay - elapsed);
      setTimeout(() => {
        setPhase('fading');
        setTimeout(() => setPhase('gone'), 700);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
      // fallback se o evento `load` não disparar
      const fallback = setTimeout(finish, 5000);
      return () => {
        window.removeEventListener('load', finish);
        clearTimeout(fallback);
      };
    }
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      suppressHydrationWarning
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#003f7f] transition-opacity duration-700 ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="loading-logo mb-10 flex items-center h-20 sm:h-24">
        <Image
          src="/logo-cdl.png"
          alt="CDL Ipirá"
          width={220}
          height={88}
          priority
          className="w-auto h-full object-contain drop-shadow-2xl"
        />
      </div>

      {/* Barra de progresso */}
      <div className="w-56 sm:w-72 h-[3px] bg-white/20 rounded-full overflow-hidden">
        <div className="loading-bar h-full bg-[#ffd000] rounded-full" />
      </div>

      {/* Texto */}
      <p className="mt-5 text-white/60 text-xs sm:text-sm tracking-widest uppercase loading-text">
        Carregando
      </p>

      {/* Dots */}
      <div className="flex gap-1.5 mt-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#ffd000]/70 loading-dot"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </div>
    </div>
  );
}
