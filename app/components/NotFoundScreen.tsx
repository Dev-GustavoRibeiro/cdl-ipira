'use client';

import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaBullhorn, FaCompass, FaEnvelope, FaHome, FaNewspaper, FaSearch } from 'react-icons/fa';

const quickLinks = [
  { icon: FaHome, label: 'Início', description: 'Página principal', href: '/' },
  { icon: FaNewspaper, label: 'Notícias', description: 'Novidades da CDL', href: '/imprensa/noticias' },
  { icon: FaBullhorn, label: 'Campanhas', description: 'Promoções e sorteios', href: '/imprensa/campanhas' },
  { icon: FaEnvelope, label: 'Contato', description: 'Fale com a equipe', href: '/imprensa/contato' },
];

/** Conteúdo da página 404: leve, com busca (formulário GET, funciona sem JS) e atalhos. */
export default function NotFoundScreen() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-white via-gray-50 to-gray-100 py-16 sm:py-20 md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#003f7f]/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#ffd000]/10 blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p
            aria-hidden="true"
            className="-mb-2 bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#00a859] bg-clip-text text-[6.5rem] leading-none font-black tracking-tighter text-transparent select-none sm:text-[9rem] animate-blur-fade-in"
          >
            404
          </p>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
            <FaCompass aria-hidden="true" className="h-3.5 w-3.5" />
            Ops! Caminho errado
          </span>
          <h1 className="mt-4 text-3xl font-black leading-[1.08] tracking-tight text-balance text-[#003f7f] sm:text-4xl lg:text-5xl">
            Página não encontrada
          </h1>
          <div aria-hidden="true" className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
          <p className="mx-auto mt-5 max-w-[48ch] text-base text-gray-600 md:text-lg">
            Esta página não existe ou foi movida. Confira o endereço, pesquise no site ou use um dos atalhos abaixo.
          </p>

          <form role="search" action="/pesquisa" method="get" className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center gap-1 rounded-2xl bg-white p-2 ring-1 ring-gray-200 shadow-[0_20px_50px_-20px_rgba(0,63,127,0.35)] transition-[box-shadow] duration-200 focus-within:ring-2 focus-within:ring-[#003f7f]">
              <FaSearch aria-hidden="true" className="ml-3 h-4 w-4 shrink-0 text-gray-400" />
              <label htmlFor="nao-encontrada-busca" className="sr-only">Pesquisar no site</label>
              <input
                id="nao-encontrada-busca"
                type="search"
                name="q"
                required
                minLength={2}
                enterKeyHint="search"
                placeholder="O que você procura?"
                className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-base text-gray-900 outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:appearance-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#003f7f] px-5 py-2.5 text-sm font-bold text-white transition-[background-color,scale] duration-200 hover:bg-[#0052a3] active:scale-[0.98]"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        <nav aria-label="Atalhos" className="mx-auto mt-12 max-w-4xl">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {quickLinks.map(({ icon: Icon, label, description, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group relative flex h-full flex-col items-center gap-3 overflow-hidden rounded-2xl bg-white px-3 pt-6 pb-5 text-center ring-1 ring-[#003f7f]/[0.06] shadow-[0_20px_50px_-20px_rgba(0,63,127,0.35)] transition-[translate,scale,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,63,127,0.5)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                  />
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#00a859]/10 text-[#00a859] ring-1 ring-[#00a859]/15 transition-colors duration-300 group-hover:bg-[#00a859] group-hover:text-white">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-gray-900 group-hover:text-[#003f7f]">{label}</span>
                    <span className="mt-0.5 block text-xs text-gray-500">{description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#003f7f] to-[#0066cc] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Página inicial
            <FaArrowRight aria-hidden="true" className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#003f7f] px-7 py-3 text-sm font-bold text-[#003f7f] transition-[background-color,color,scale] duration-200 hover:bg-[#003f7f] hover:text-white active:scale-[0.98]"
          >
            <FaArrowLeft aria-hidden="true" className="h-3 w-3" />
            Voltar
          </button>
        </div>
      </div>
    </section>
  );
}
