'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaRedo } from 'react-icons/fa';

/**
 * Erro ao renderizar uma página pública: só o conteúdo da página é trocado por este aviso. Header, rodapé e o aviso de
 * cookies (no layout acima) continuam de pé — sem isto, um dado ruim vindo do painel derrubava a página inteira.
 */
export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-linear-to-br from-white via-gray-50 to-gray-100 py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-balance text-[#003f7f] sm:text-4xl">
          Não foi possível carregar esta página
        </h1>
        <div aria-hidden="true" className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
        <p className="mx-auto mt-5 max-w-[48ch] text-base text-gray-600 md:text-lg">
          Algo deu errado ao mostrar este conteúdo. Tente de novo; se continuar, volte ao início e tente mais tarde.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#003f7f] px-6 text-sm font-bold text-white transition-[background-color,scale] duration-200 hover:bg-[#0052a3] active:scale-[0.98]"
          >
            <FaRedo aria-hidden="true" className="h-3.5 w-3.5" />
            Tentar de novo
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-bold text-[#003f7f] ring-1 ring-[#003f7f]/20 transition-[background-color,scale] duration-200 hover:bg-white active:scale-[0.98]"
          >
            <FaHome aria-hidden="true" className="h-3.5 w-3.5" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  );
}
