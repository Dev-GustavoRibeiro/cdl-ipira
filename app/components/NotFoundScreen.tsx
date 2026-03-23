'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

// Keyframes e classes com hover — injetados inline para escapar da cascata CSS global.
const CSS = `
@keyframes nfBgPan {
  0%,100% { background-position: 0% 40%; }
  50%      { background-position: 100% 60%; }
}
@keyframes nfGridPulse {
  0%,100% { opacity: 0.07; }
  50%     { opacity: 0.17; }
}
@keyframes nfOrbA {
  0%,100% { transform: translate(0,0)    scale(1);    opacity: 0.18; }
  33%     { transform: translate(40px,-30px) scale(1.12); opacity: 0.25; }
  66%     { transform: translate(-22px,26px) scale(0.92); opacity: 0.14; }
}
@keyframes nfOrbB {
  0%,100% { transform: translate(0,0)   scale(1);    opacity: 0.13; }
  40%     { transform: translate(-36px,22px) scale(1.08); opacity: 0.21; }
  70%     { transform: translate(28px,-18px) scale(0.96); opacity: 0.11; }
}
@keyframes nfScan {
  0%   { top: -3%;   opacity: 0; }
  6%   { opacity: 0.55; }
  94%  { opacity: 0.3; }
  100% { top: 103%;  opacity: 0; }
}
@keyframes nfParticle {
  0%   { transform: translateY(0)       scale(0);   opacity: 0; }
  8%   { transform: translateY(-6vh)    scale(1);   opacity: 0.9; }
  85%  { transform: translateY(-85vh)   scale(0.8); opacity: 0.35; }
  100% { transform: translateY(-102vh)  scale(0.5); opacity: 0; }
}
@keyframes nfReveal {
  from { opacity:0; transform:translateY(32px) scale(0.95); filter:blur(8px); }
  to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0); }
}
@keyframes nfLogoIn {
  from { opacity:0; transform:translateY(-48px) scale(0.85); filter:blur(12px); }
  to   { opacity:1; transform:translateY(0)     scale(1);    filter:blur(0); }
}
@keyframes nfNumPop {
  0%  { opacity:0; transform:scale(0.3) rotate(-7deg); filter:blur(16px); }
  55% { transform:scale(1.1) rotate(1.5deg); filter:blur(0); }
  75% { transform:scale(0.97) rotate(-0.4deg); }
  100%{ opacity:1; transform:scale(1) rotate(0deg); filter:blur(0); }
}
@keyframes nfNumShake {
  0%,100% { transform: translate(0,0); }
  10%     { transform: translate(-3px,0); }
  20%     { transform: translate(4px,-1px); }
  35%     { transform: translate(-2px,0); }
  50%     { transform: translate(3px,1px); }
  65%     { transform: translate(0,0); }
}
@keyframes nfGlitchA {
  0%,84%,100% { clip-path:inset(40% 0 60% 0); transform:translateX(0);  opacity:0; }
  85%  { clip-path:inset(8%  0 78% 0); transform:translateX(-9px); opacity:1; }
  87%  { clip-path:inset(55% 0 35% 0); transform:translateX(8px);  opacity:1; }
  89%  { clip-path:inset(15% 0 70% 0); transform:translateX(-7px); opacity:1; }
  91%  { clip-path:inset(72% 0 16% 0); transform:translateX(10px); opacity:1; }
  93%  { clip-path:inset(28% 0 55% 0); transform:translateX(-6px); opacity:1; }
  95%  { clip-path:inset(83% 0 6%  0); transform:translateX(7px);  opacity:1; }
  97%  { clip-path:inset(40% 0 60% 0); transform:translateX(0);    opacity:0; }
}
@keyframes nfGlitchB {
  0%,86%,100% { clip-path:inset(62% 0 28% 0); transform:translateX(0);  opacity:0; }
  87%  { clip-path:inset(4%  0 90% 0); transform:translateX(10px); opacity:1; }
  89%  { clip-path:inset(79% 0 8%  0); transform:translateX(-9px); opacity:1; }
  91%  { clip-path:inset(20% 0 68% 0); transform:translateX(8px);  opacity:1; }
  93%  { clip-path:inset(48% 0 40% 0); transform:translateX(-7px); opacity:1; }
  95%  { clip-path:inset(10% 0 77% 0); transform:translateX(9px);  opacity:1; }
  98%  { clip-path:inset(62% 0 28% 0); transform:translateX(0);    opacity:0; }
}
@keyframes nfBtnPulse {
  0%   { box-shadow: 0 0 0 0 rgba(255,208,0,0.65); }
  70%  { box-shadow: 0 0 0 14px rgba(255,208,0,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,208,0,0); }
}
@keyframes nfCorner {
  0%,100% { opacity:0.3; }
  50%     { opacity:0.9; }
}

/* Interactive states */
.nf-logo-link  { transition: transform .2s ease, box-shadow .2s ease; }
.nf-logo-link:hover {
  transform: scale(1.03);
  box-shadow: 0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.55), 0 0 50px rgba(0,102,204,0.4) !important;
}
.nf-btn-primary { transition: transform .15s ease, box-shadow .15s ease; }
.nf-btn-primary:hover { transform: scale(1.04) !important; box-shadow: 0 14px 44px rgba(255,208,0,0.65), 0 4px 12px rgba(0,0,0,0.4) !important; }
.nf-btn-primary:active { transform: scale(0.97) !important; }
.nf-btn-secondary { transition: background .15s ease; }
.nf-btn-secondary:hover { background: rgba(255,255,255,0.13) !important; }
@media (min-width:640px) { .nf-buttons { flex-direction:row !important; } }
`;

const PARTICLES = [
  { left: '5%',  delay: '0.2s',  dur: '3.4s', color: 'rgba(255,208,0,0.85)',  glow: 'rgba(255,208,0,0.9)'  },
  { left: '14%', delay: '0.8s',  dur: '2.9s', color: 'rgba(0,166,255,0.75)',  glow: 'rgba(0,166,255,0.9)'  },
  { left: '22%', delay: '1.5s',  dur: '3.7s', color: 'rgba(0,210,100,0.7)',   glow: 'rgba(0,210,100,0.9)'  },
  { left: '32%', delay: '0.4s',  dur: '3.1s', color: 'rgba(255,208,0,0.8)',   glow: 'rgba(255,208,0,0.9)'  },
  { left: '44%', delay: '1.1s',  dur: '2.7s', color: 'rgba(0,166,255,0.7)',   glow: 'rgba(0,166,255,0.9)'  },
  { left: '55%', delay: '0s',    dur: '3.3s', color: 'rgba(255,208,0,0.85)',  glow: 'rgba(255,208,0,0.9)'  },
  { left: '65%', delay: '0.65s', dur: '3.8s', color: 'rgba(0,210,100,0.65)',  glow: 'rgba(0,210,100,0.9)'  },
  { left: '74%', delay: '1.3s',  dur: '2.8s', color: 'rgba(0,166,255,0.75)',  glow: 'rgba(0,166,255,0.9)'  },
  { left: '84%', delay: '0.3s',  dur: '3.5s', color: 'rgba(255,208,0,0.8)',   glow: 'rgba(255,208,0,0.9)'  },
  { left: '93%', delay: '0.9s',  dur: '3.0s', color: 'rgba(0,210,100,0.7)',   glow: 'rgba(0,210,100,0.9)'  },
];

const CORNERS = [
  { top:20,    left:20,   bT:'2px solid rgba(255,208,0,0.45)',   bL:'2px solid rgba(255,208,0,0.45)',   bB:'none',  bR:'none',  delay:0    },
  { top:20,    right:20,  bT:'2px solid rgba(0,166,255,0.38)',   bL:'none',  bB:'none',  bR:'2px solid rgba(0,166,255,0.38)',  delay:0.7  },
  { bottom:20, left:20,   bT:'none',  bL:'2px solid rgba(0,166,255,0.38)',  bB:'2px solid rgba(0,166,255,0.38)',  bR:'none',  delay:1.4  },
  { bottom:20, right:20,  bT:'none',  bL:'none',  bB:'2px solid rgba(255,208,0,0.45)',  bR:'2px solid rgba(255,208,0,0.45)',  delay:2.1  },
];

// Base for the 404 text (shared between main + ghosts)
const NUM_BASE: React.CSSProperties = {
  fontSize: 'clamp(5.5rem, 22vw, 10rem)',
  fontWeight: 900,
  display: 'block',
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
};

export default function NotFoundScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#001a33' }}
        aria-hidden
      />
    );
  }

  return createPortal(
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        role="alert"
        aria-live="polite"
        style={{
          position: 'fixed', inset: 0, zIndex: 30000,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', padding: '24px', textAlign: 'center',
          background:
            'radial-gradient(ellipse 90% 70% at 50% 25%, rgba(0,102,204,0.5) 0%, transparent 60%),' +
            'linear-gradient(155deg, #000814 0%, #001a33 45%, #002d5c 100%)',
        }}
      >
        {/* ── Background layers ── */}

        {/* Slow colour sweep */}
        <div aria-hidden style={{
          position: 'absolute', inset: '-20%',
          background: 'linear-gradient(125deg, transparent 0%, rgba(255,208,0,0.1) 22%, transparent 44%, rgba(0,102,204,0.08) 68%, transparent 100%)',
          backgroundSize: '280% 280%',
          animation: 'nfBgPan 7s ease-in-out infinite',
        }} />

        {/* Grid */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, black 10%, transparent 75%)',
          animation: 'nfGridPulse 5s ease-in-out infinite',
        }} />

        {/* Orb left (blue) */}
        <div aria-hidden style={{
          position: 'absolute', left: '-8%', top: '-8%',
          width: 'min(60vw, 550px)', height: 'min(60vw, 550px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,102,204,0.32) 0%, transparent 65%)',
          animation: 'nfOrbA 9s ease-in-out infinite',
        }} />

        {/* Orb right (gold) */}
        <div aria-hidden style={{
          position: 'absolute', right: '-6%', bottom: '2%',
          width: 'min(55vw, 480px)', height: 'min(55vw, 480px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,208,0,0.22) 0%, transparent 65%)',
          animation: 'nfOrbB 11s ease-in-out infinite',
        }} />

        {/* Scanline sweep */}
        <div aria-hidden style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(0,166,255,0.45), rgba(255,208,0,0.35), transparent)',
          animation: 'nfScan 5.5s linear 0.8s infinite',
        }} />

        {/* Particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} aria-hidden style={{
            position: 'absolute', bottom: 0,
            left: p.left, width: 3, height: 3, borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 8px ${p.glow}`,
            animation: `nfParticle ${p.dur} linear ${p.delay} infinite`,
          }} />
        ))}

        {/* ── Content ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          maxWidth: 560, width: '100%',
        }}>

          {/* Logo */}
          <Link
            href="/"
            className="nf-logo-link"
            style={{
              display: 'block', marginBottom: 32, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(245,250,255,0.9) 100%)',
              padding: '14px 28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.5), 0 0 40px rgba(0,102,204,0.25)',
              backdropFilter: 'blur(4px)',
              animation: 'nfLogoIn 0.65s cubic-bezier(0.34,1.5,0.64,1) both',
            }}
            aria-label="Ir para a página inicial — CDL Ipirá"
          >
            <Image
              src="/logo-cdl.png"
              alt="CDL Ipirá"
              width={220}
              height={88}
              priority
              style={{ height: 60, width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>

          {/* Kicker */}
          <p style={{
            color: 'rgba(255,208,0,0.9)', fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: 10,
            animation: 'nfReveal 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both',
          }}>
            Erro 404 · Página não encontrada
          </p>

          {/* 404 — glitch layers */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>

            {/* Main gradient number */}
            <span style={{
              ...NUM_BASE,
              background: 'linear-gradient(135deg, #ffffff 0%, #ffd000 55%, #00d670 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 36px rgba(255,208,0,0.55)) drop-shadow(0 4px 20px rgba(0,0,0,0.5))',
              animation: 'nfNumPop 0.9s cubic-bezier(0.34,1.4,0.64,1) 0.2s both, nfNumShake 4.5s ease-in-out 1.4s infinite',
            }}>
              404
            </span>

            {/* Ghost A — red slice */}
            <span aria-hidden style={{
              ...NUM_BASE,
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              WebkitTextFillColor: 'rgba(255,55,55,0.9)',
              color: 'rgba(255,55,55,0.9)',
              animation: 'nfGlitchA 4.8s steps(1) 1.6s infinite',
            }}>
              404
            </span>

            {/* Ghost B — cyan slice */}
            <span aria-hidden style={{
              ...NUM_BASE,
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              WebkitTextFillColor: 'rgba(0,200,255,0.9)',
              color: 'rgba(0,200,255,0.9)',
              animation: 'nfGlitchB 4.8s steps(1) 2.4s infinite',
            }}>
              404
            </span>
          </div>

          {/* Subtitle */}
          <p style={{
            color: 'rgba(255,255,255,0.88)',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 500,
            marginBottom: 6,
            animation: 'nfReveal 0.6s cubic-bezier(0.22,1,0.36,1) 0.55s both',
          }}>
            Esta página não existe ou foi movida.
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.48)', fontSize: '0.875rem',
            maxWidth: 400, lineHeight: 1.6,
            animation: 'nfReveal 0.6s cubic-bezier(0.22,1,0.36,1) 0.7s both',
          }}>
            Confira o endereço ou volte para o início para continuar navegando.
          </p>

          {/* Buttons */}
          <div
            className="nf-buttons"
            style={{
              marginTop: 36,
              display: 'flex', flexDirection: 'column', gap: 12,
              animation: 'nfReveal 0.6s cubic-bezier(0.22,1,0.36,1) 0.85s both',
            }}
          >
            <Link
              href="/"
              className="nf-btn-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                borderRadius: 9999,
                background: 'linear-gradient(135deg, #ffd000 0%, #ffbe00 100%)',
                padding: '14px 38px',
                fontSize: '0.875rem', fontWeight: 700, color: '#003f7f',
                boxShadow: '0 8px 28px rgba(255,208,0,0.45), 0 2px 8px rgba(0,0,0,0.35)',
                animation: 'nfBtnPulse 2.2s ease-out 1.8s infinite',
                textDecoration: 'none',
              }}
            >
              <FaHome style={{ width: 14, height: 14, flexShrink: 0 }} />
              Página inicial
            </Link>

            <button
              type="button"
              className="nf-btn-secondary"
              onClick={() => window.history.back()}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.22)',
                background: 'rgba(255,255,255,0.06)',
                padding: '13px 38px',
                fontSize: '0.875rem', fontWeight: 600, color: 'white',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
              }}
            >
              <FaArrowLeft style={{ width: 14, height: 14, flexShrink: 0 }} />
              Voltar
            </button>
          </div>
        </div>

        {/* Corner brackets */}
        {CORNERS.map((c, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              position: 'absolute',
              top: c.top, left: c.left, right: c.right, bottom: c.bottom,
              width: 30, height: 30,
              borderTop: c.bT, borderLeft: c.bL, borderBottom: c.bB, borderRight: c.bR,
              animation: `nfCorner 2.8s ease-in-out ${c.delay}s infinite`,
            } as React.CSSProperties}
          />
        ))}

        {/* Footer */}
        <p style={{
          position: 'absolute', bottom: 22, left: 0, right: 0, zIndex: 10,
          color: 'rgba(255,255,255,0.28)', fontSize: '0.68rem', letterSpacing: '0.12em',
          animation: 'nfReveal 0.55s ease-out 1.05s both',
        }}>
          CDL Ipirá · Câmara de Dirigentes Lojistas
        </p>
      </div>
    </>,
    document.body
  );
}
