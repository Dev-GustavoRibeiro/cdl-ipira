'use client';

import { getImageProps } from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FaArrowRight, FaArrowUp, FaEnvelope, FaPhoneAlt, FaUserCircle, FaWhatsapp } from 'react-icons/fa';
import { ASSOCIE_URL, CONTACT, NAV_GROUPS, PORTAL_URL } from './navigation/navItems';
import SmartLink from './navigation/SmartLink';
import { OPEN_CONSENT_EVENT } from '@/lib/consent';

// Direção de arte: cena vertical (4:5) no celular e panorâmica (21:9) a partir de md. Imagem decorativa (Higgsfield).
const { srcSet: desktopSrcSet } = getImageProps({
  src: '/images/footer/rua-comercial-desktop.webp',
  alt: '',
  width: 2688,
  height: 1152,
  sizes: '100vw',
}).props;
const { props: mobileImage } = getImageProps({
  src: '/images/footer/rua-comercial-mobile.webp',
  alt: '',
  width: 1080,
  height: 1350,
  sizes: '100vw',
  loading: 'lazy',
});

const pills: { label: string; href: string; icon: IconType; external?: boolean }[] = [
  { label: 'WhatsApp', href: CONTACT.whatsapp.href, icon: FaWhatsapp, external: true },
  { label: CONTACT.phone.label, href: CONTACT.phone.href, icon: FaPhoneAlt },
  { label: 'E-mail', href: CONTACT.email.href, icon: FaEnvelope },
  { label: 'Portal do Associado', href: PORTAL_URL, icon: FaUserCircle, external: true },
];

// Links curtos: cada seção aponta para a primeira página dela (não há página índice por seção)
const links = [
  ...NAV_GROUPS.map(({ label, items }) => ({ label, href: items.find((i) => !i.external)!.href })),
  { label: 'Contato', href: '/imprensa/contato' },
  { label: 'Transparência', href: '/institucional/portal-transparencia' },
];

const SHORT_DAY: Record<string, string> = { 'Segunda a Sexta': 'Seg–Sex', Sábado: 'Sáb' };
const hours = CONTACT.hours.filter(({ time }) => time !== 'Fechado').map(({ day, time }) => `${SHORT_DAY[day] ?? day} ${time}`);

const openCookiePreferences = () => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));

// Links legais discretos (mesma cor do copyright), com altura de toque de 40px
const legalLink = 'inline-flex min-h-10 items-center underline-offset-4 transition-colors hover:text-white hover:underline';

const backToTop = () =>
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

const Footer = () => (
  <footer className="text-white">
    {/* Cena de ponta a ponta: pouca informação sobre o céu e a frase gigante assentada na base.
        No celular a cena começa abaixo dos contatos (sem cobrir as fachadas) e se funde ao azul por máscara. */}
    <section
      aria-labelledby="footer-title"
      className="relative isolate flex min-h-[43rem] flex-col justify-between gap-10 overflow-hidden rounded-t-[1.75rem] bg-[#001a3d] md:min-h-[min(50vw,54rem)] md:rounded-t-[2.5rem]"
    >
      <picture className="absolute inset-x-0 top-52 bottom-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_24%)] md:top-0 md:[mask-image:none]">
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
        <img {...mobileImage} alt="" className="h-full w-full object-cover object-bottom md:object-[50%_40%]" />
      </picture>
      {/* Véus só onde o texto precisa: canto superior esquerdo (contatos, só a partir de md) e base (frase) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_62%_85%_at_0%_0%,rgba(0,26,61,0.94),rgba(0,26,61,0.7)_42%,transparent_80%)] md:block"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[42%] bg-linear-to-t from-[#001a3d] via-[#001a3d]/50 to-transparent" />

      <div className="relative flex w-full flex-col gap-6 pt-9 px-5 sm:px-8 lg:px-[max(2.5rem,2.6vw)] md:pt-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[24rem]">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ffd000]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#ffd000]" />
            CDL Ipirá
          </p>
          <ul aria-label="Fale com a CDL" className="mt-4 flex flex-wrap gap-2">
            {pills.map(({ label, href, icon: Icon, external }) => (
              <li key={label}>
                {/* Pílula de vidro de 36px com área de toque de 44px (before:-inset-1) */}
                <SmartLink
                  href={href}
                  external={external}
                  className="relative inline-flex h-9 items-center gap-1.5 rounded-full bg-[#001a3d]/45 px-3.5 text-[13px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition-[background-color,color,scale] before:absolute before:-inset-1 hover:bg-[#ffd000] hover:text-[#001a3d] hover:ring-[#ffd000] active:scale-[0.97]"
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  <span className="tabular-nums">{label}</span>
                </SmartLink>
              </li>
            ))}
          </ul>
          <address className="mt-5 text-[13px] not-italic leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgba(0,26,61,0.9)] sm:text-sm">
            {CONTACT.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block tabular-nums text-white/70">{hours.join(' · ')}</span>
          </address>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <SmartLink
            href={ASSOCIE_URL}
            external
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#ffd000] pl-6 pr-5 font-bold text-[#001a3d] shadow-[0_14px_34px_-12px_rgba(255,208,0,0.75)] transition-[background-color,translate,scale] hover:-translate-y-0.5 hover:bg-[#ffed4e] active:scale-[0.98] motion-reduce:hover:translate-y-0 md:h-13 md:pl-7 md:pr-6"
          >
            Associe-se
            <FaArrowRight aria-hidden="true" className="h-3 w-3 -rotate-45 transition-[translate] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </SmartLink>
          <Link
            href="/imprensa/contato"
            className="inline-flex h-12 items-center rounded-full bg-[#001a3d]/45 px-5 font-semibold text-white ring-1 ring-white/35 backdrop-blur-md transition-[background-color,color] hover:bg-white hover:text-[#001a3d] md:h-13"
          >
            Fale conosco
          </Link>
        </div>
      </div>

      {/* Frase: linha menor + "cidade viva." em uma única linha que ocupa a largura toda (≈17vw cabe de 320 a 1920px).
          Com espaçamento de texto ou fonte legível do painel de acessibilidade a frase não cabe numa linha: ela quebra
          (e diminui, no espaçamento) em vez de ser cortada pelo overflow-hidden da seção (WCAG 1.4.12) */}
      <h2 id="footer-title" className="relative px-[2.2vw] font-black text-white">
        <span className="block pl-[0.08em] text-[clamp(1.4rem,4.2vw,4.25rem)] leading-none tracking-tight text-white/90">
          Comércio forte,
        </span>
        <span className="-mb-[0.08em] block whitespace-nowrap text-[17.2vw] leading-[0.92] tracking-[-0.05em] [text-shadow:0_10px_40px_rgba(0,26,61,0.35)] 2xl:text-[min(17.2vw,23rem)] [html:is(.a11y-spacing,.a11y-font)_&]:whitespace-normal [html.a11y-spacing_&]:text-[12vw]">
          cidade viva<span className="text-[#ffd000]">.</span>
        </span>
      </h2>
    </section>

    {/* Faixa enxuta: links essenciais e informações legais */}
    <div className="bg-[#001a3d]">
      {/* O padding de baixo libera a barra de navegação do celular (some na variante desk), a área segura e o botão flutuante
          de acessibilidade (canto inferior esquerdo), para nada ficar escondido no fim da página */}
      <div className="flex flex-col gap-4 pt-5 px-5 sm:px-8 lg:px-[max(2.5rem,2.6vw)] pb-[calc(8.5rem+env(safe-area-inset-bottom))] md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8 md:gap-y-1 desk:pb-[5.5rem] xl:flex-nowrap">
        <nav aria-label="Rodapé" className="order-1 md:basis-full xl:order-2 xl:basis-auto">
          <ul className="flex flex-wrap gap-x-6 gap-y-0 text-sm font-semibold">
            {links.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="inline-flex min-h-11 items-center text-white/75 transition-colors hover:text-[#ffd000]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Empilhado: lado a lado ele disputaria largura com a navegação e a quebraria em duas linhas no desktop */}
        <div className="order-2 flex flex-col text-[13px] text-white/55 xl:order-1">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {CONTACT.razaoSocial} · <span className="whitespace-nowrap">CNPJ {CONTACT.cnpj}</span>
          </p>
          <ul className="flex flex-wrap gap-x-4">
            <li>
              <Link href="/politica-de-privacidade" className={legalLink}>
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos-de-uso" className={legalLink}>
                Termos de Uso
              </Link>
            </li>
            <li>
              {/* Pedidos do titular (LGPD): abre o formulário de contato com o assunto "Privacidade" já escolhido */}
              <Link href="/imprensa/contato?assunto=privacidade#formulario" className={legalLink}>
                Exercer meus direitos
              </Link>
            </li>
            <li>
              {/* Reabre o aviso de cookies (CookieConsent) com as escolhas atuais */}
              <button type="button" onClick={openCookiePreferences} className={legalLink}>
                Preferências de cookies
              </button>
            </li>
          </ul>
        </div>
        <button
          type="button"
          onClick={backToTop}
          className="group order-3 inline-flex min-h-11 items-center gap-2 self-start whitespace-nowrap text-sm font-semibold text-white/85 transition-colors hover:text-white md:self-auto"
        >
          Voltar ao topo
          <span className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/20 transition-[background-color,color,box-shadow] group-hover:bg-[#ffd000] group-hover:text-[#001a3d] group-hover:ring-[#ffd000]">
            <FaArrowUp aria-hidden="true" className="h-3 w-3" />
          </span>
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
