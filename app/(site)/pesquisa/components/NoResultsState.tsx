import React from 'react';
import { FaSearchMinus } from 'react-icons/fa';
import Suggestions from './Suggestions';

interface NoResultsStateProps {
  query: string;
}

const tips = ['Confira a ortografia das palavras', 'Use termos mais gerais ou mais curtos', 'Tente um sinônimo (ex.: "vaga" em vez de "emprego")'];

const NoResultsState = ({ query }: NoResultsStateProps) => {
  return (
    <div
      role="status"
      className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-linear-to-b from-white to-gray-50 px-6 py-10 text-center shadow-[0_20px_50px_-24px_rgba(0,63,127,0.35)] sm:px-10 sm:py-12 animate-scale-in"
    >
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#003f7f]/10 text-[#003f7f] ring-8 ring-[#003f7f]/5">
        <FaSearchMinus aria-hidden="true" className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-2xl font-black tracking-tight text-balance text-[#003f7f]">Nenhum resultado encontrado</h2>
      <p className="mt-2 text-gray-600">
        Não encontramos resultados para <strong className="font-bold text-gray-900">&ldquo;{query}&rdquo;</strong>
      </p>

      <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-gray-600">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2.5">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a859]" />
            {tip}
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-gray-100 pt-8">
        <Suggestions title="Experimente pesquisar" />
      </div>
    </div>
  );
};

export default NoResultsState;
