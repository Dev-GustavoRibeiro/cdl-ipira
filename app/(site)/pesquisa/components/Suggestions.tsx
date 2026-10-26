import React from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

const popularSearches = ['Certificado digital', 'SPC', 'Eventos', 'Vagas', 'Campanhas', 'Associados'];

/** Atalhos de pesquisa usados nos estados vazio e sem resultados. */
const Suggestions = ({ title = 'Buscas populares' }: { title?: string }) => {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">{title}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {popularSearches.map((term) => (
          <li key={term}>
            <Link
              href={`/pesquisa?q=${encodeURIComponent(term)}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#003f7f] ring-1 ring-gray-200 transition-[background-color,color,box-shadow,scale] duration-200 hover:bg-[#003f7f] hover:text-white hover:ring-[#003f7f] active:scale-[0.98]"
            >
              <FaSearch aria-hidden="true" className="h-3 w-3 opacity-60" />
              {term}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
