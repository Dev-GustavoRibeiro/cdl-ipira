'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const KEYFRAMES = `
@keyframes ldExit {
  0%   { opacity:1; transform:scale(1); }
  30%  { opacity:1; transform:scale(1.02); }
  100% { opacity:0; transform:scale(1.04); }
}
@keyframes ldLine {
  0%,100% { opacity:0; transform:translateY(36px); }
  50%     { opacity:1; transform:translateY(-36px); }
}
@keyframes ldParticle {
  0%   { transform:translateY(0);      opacity:0; }
  8%   { transform:translateY(-8vh);   opacity:0.9; }
  85%  { transform:translateY(-88vh);  opacity:0.4; }
  100% { transform:translateY(-100vh); opacity:0; }
}
@keyframes ldRing {
  0%   { transform:scale(0.35); opacity:0.9; }
  100% { transform:scale(2.6);  opacity:0; }
}
@keyframes ldLogo {
  0%   { opacity:0; transform:scale(0.6) translateY(-20px); filter:blur(8px); }
  100% { opacity:1; transform:scale(1)   translateY(0);     filter:blur(0); }
}
@keyframes ldAura {
  0%   { transform:scale(0.9); opacity:0.5; }
  100% { transform:scale(1.2); opacity:0.9; }
}
@keyframes ldBar {
  0%   { width:0%; }
  35%  { width:50%; }
  70%  { width:80%; }
  90%  { width:92%; }
  100% { width:100%; }
}
@keyframes ldShimmer {
  0%   { background-position:200% 0; }
  100% { background-position:-200% 0; }
}
@keyframes ldTagline {
  0%   { opacity:0;   transform:translateY(8px); letter-spacing:0.55em; }
  100% { opacity:0.4; transform:translateY(0);   letter-spacing:0.35em; }
}
`;

const PARTICLES = [
  { left: '8%',  delay: '0s',    dur: '2.8s' },
  { left: '22%', delay: '0.45s', dur: '3.1s' },
  { left: '38%', delay: '0.9s',  dur: '2.6s' },
  { left: '52%', delay: '0.2s',  dur: '3.4s' },
  { left: '66%', delay: '1.1s',  dur: '2.9s' },
  { left: '80%', delay: '0.6s',  dur: '3.0s' },
  { left: '92%', delay: '0.75s', dur: '2.7s' },
];

const RING_DELAYS = ['0s', '0.8s', '1.6s'];
const RING_COLORS = [
  'rgba(0,102,204,0.28)',
  'rgba(255,208,0,0.14)',
  'rgba(0,166,255,0.12)',
];

const SESSION_KEY = 'cdl_loaded';

export default function LoadingScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible');
  // Ref para evitar dupla execução de finish()
  const finishedRef = useRef(false);
  // Ref para saber se deve exibir (calculado antes da primeira render)
  const shouldShowRef = useRef<boolean | null>(null);

  if (shouldShowRef.current === null) {
    // Executa síncronamente antes de qualquer render do DOM
    if (typeof window !== 'undefined') {
      const alreadyShown = sessionStorage.getItem(SESSION_KEY) === '1';
      shouldShowRef.current = !alreadyShown;
    } else {
      // SSR: deixa visível para evitar mismatch de hidratação
      shouldShowRef.current = true;
    }
  }

  useEffect(() => {
    // Se já foi mostrado nesta sessão, sai imediatamente
    if (!shouldShowRef.current) {
      setPhase('gone');
      return;
    }

    const html  = document.documentElement;
    const body  = document.body;
    const start = Date.now();

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      const elapsed = Date.now() - start;

      // Tempo mínimo adaptativo:
      // - Fast 3G / rápido: 700ms
      // - Conexão normal:   1000ms
      // - Conexão lenta:    1400ms
      const connection = (navigator as any)?.connection;
      const effectiveType = connection?.effectiveType ?? '4g';
      const minDisplay =
        effectiveType === 'slow-2g' || effectiveType === '2g' ? 1400 :
        effectiveType === '3g'                                 ? 1000 :
                                                                  700;

      const wait = Math.max(0, minDisplay - elapsed);

      setTimeout(() => {
        // Marca sessão como exibida ANTES de começar o fade
        sessionStorage.setItem(SESSION_KEY, '1');
        setPhase('fading');
        setTimeout(() => {
          setPhase('gone');
        }, 700); // duração do fade (ldExit = 0.7s)
      }, wait);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
      // Fallback máximo de 4s para conexões muito lentas
      const fallback = setTimeout(finish, 4000);
      return () => {
        window.removeEventListener('load', finish);
        clearTimeout(fallback);
        html.style.overflow = '';
        body.style.overflow = '';
      };
    }

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase === 'gone') {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }, [phase]);

  if (phase === 'gone') return null;

  const exiting = phase === 'fading';

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div
        suppressHydrationWarning
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg,#001433 0%,#002255 50%,#001433 100%)',
          willChange: 'opacity, transform',
          ...(exiting
            ? { animation: 'ldExit 0.7s cubic-bezier(0.4,0,0.6,1) forwards', pointerEvents: 'none' }
            : {}),
        }}
      >
        {/* Spotlight radial */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%,rgba(0,102,204,0.22) 0%,rgba(0,63,127,0.1) 45%,transparent 75%)',
          }}
        />

        {/* Linha de luz */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '-10%', right: '-10%', height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(0,166,255,0.25),transparent)',
            willChange: 'transform, opacity',
            animation: 'ldLine 2.5s ease-in-out infinite',
          }}
        />

        {/* Partículas */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            suppressHydrationWarning
            className="absolute bottom-0"
            style={{
              left: p.left,
              width: 3, height: 3,
              borderRadius: '50%',
              background: 'rgba(255,208,0,0.75)',
              boxShadow: '0 0 8px rgba(255,208,0,0.9),0 0 16px rgba(255,208,0,0.4)',
              willChange: 'transform, opacity',
              animation: `ldParticle ${p.dur} linear ${p.delay} infinite both`,
            }}
          />
        ))}

        {/* Anéis */}
        {RING_DELAYS.map((delay, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: '50%', top: '50%',
              width: 260, height: 260,
              marginLeft: -130, marginTop: -130,
              borderRadius: '50%',
              border: `1px solid ${RING_COLORS[i]}`,
              willChange: 'transform, opacity',
              animation: `ldRing 2.4s cubic-bezier(0.1,0,0.3,1) ${delay} infinite`,
            }}
          />
        ))}

        {/* Logo */}
        <div
          className="relative z-10 flex items-center justify-center mb-10"
          style={{
            willChange: 'transform, opacity, filter',
            animation: 'ldLogo 0.65s cubic-bezier(0.34,1.5,0.64,1) both',
          }}
        >
          {/* Aura */}
          <div
            className="absolute"
            style={{
              left: '50%', top: '50%',
              width: 320, height: 180,
              marginLeft: -160, marginTop: -90,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse,rgba(0,102,204,0.35) 0%,transparent 70%)',
              willChange: 'transform, opacity',
              animation: 'ldAura 2s ease-in-out infinite alternate',
            }}
          />

          {/* Placa branca */}
          <div
            className="absolute"
            style={{
              left: '50%', top: '50%',
              width: 290, height: 126,
              marginLeft: -145, marginTop: -63,
              borderRadius: 18,
              background:
                'linear-gradient(135deg,rgba(255,255,255,0.96) 0%,rgba(245,250,255,0.88) 100%)',
              border: '1px solid rgba(255,255,255,0.55)',
              boxShadow:
                '0 18px 45px rgba(0,0,0,0.45),inset 0 0 0 1px rgba(0,102,204,0.16),0 0 36px rgba(255,255,255,0.16)',
              backdropFilter: 'blur(3px)',
            }}
          />

          <Image
            src="/logo-cdl.png"
            alt="CDL Ipirá"
            width={260}
            height={104}
            priority
            className="relative h-20 sm:h-24 w-auto object-contain"
            style={{
              isolation: 'isolate',
              filter:
                'drop-shadow(0 0 28px rgba(255,255,255,0.35)) drop-shadow(0 0 20px rgba(0,102,204,0.65)) drop-shadow(0 6px 16px rgba(0,0,0,0.65))',
            }}
          />
        </div>

        {/* Barra de progresso */}
        <div className="relative z-10 w-52 sm:w-72">
          <div
            className="h-[3px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: '0%',
                willChange: 'width',
                transform: 'translateZ(0)',
                background: 'linear-gradient(90deg,#003f7f 0%,#0066cc 40%,#ffd000 100%)',
                backgroundSize: '200% 100%',
                boxShadow:
                  '0 0 8px rgba(255,208,0,0.7),0 0 18px rgba(0,102,204,0.5)',
                animation: 'ldBar 1.8s cubic-bezier(0.4,0,0.15,1) forwards, ldShimmer 1.4s linear 0.3s infinite',
              }}
            />
          </div>

          <div
            className="absolute pointer-events-none"
            style={{
              top: -8, bottom: -8, left: 0,
              width: '0%',
              willChange: 'width',
              background:
                'linear-gradient(90deg,transparent,rgba(255,208,0,0.15),transparent)',
              filter: 'blur(6px)',
              animation: 'ldBar 1.8s cubic-bezier(0.4,0,0.15,1) forwards',
            }}
          />
        </div>

        {/* Tagline */}
        <p
          suppressHydrationWarning
          className="mt-6 z-10 text-white/40 font-light"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            animation: 'ldTagline 0.7s ease-out 0.45s both',
          }}
        >
          Comércio Forte, Cidade Viva
        </p>
      </div>
    </>
  );
}
