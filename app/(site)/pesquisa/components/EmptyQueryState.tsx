import React from 'react';
import Link from 'next/link';
import { FaSearch, FaNewspaper, FaCalendarAlt, FaBriefcase, FaBullhorn, FaShieldAlt, FaCertificate, FaArrowRight } from 'react-icons/fa';
import Suggestions from './Suggestions';

const sections = [
  { icon: FaNewspaper, label: 'Notícias', href: '/imprensa/noticias' },
  { icon: FaCalendarAlt, label: 'Eventos', href: '/imprensa/eventos' },
  { icon: FaBriefcase, label: 'Balcão de Empregos', href: '/produtos/balcao-empregos' },
  { icon: FaBullhorn, label: 'Campanhas', href: '/imprensa/campanhas' },
  { icon: FaShieldAlt, label: 'SPC Brasil', href: '/produtos/spc-brasil' },
  { icon: FaCertificate, label: 'Certificado Digital', href: '/produtos/certificado-digital' },
];

const EmptyQueryState = () => {
  return (
    <div className="mx-auto max-w-4xl text-center animate-blur-fade-in">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#003f7f]/10 text-[#003f7f] ring-8 ring-[#003f7f]/5">
        <FaSearch aria-hidden="true" className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-2xl font-black tracking-tight text-[#003f7f] sm:text-3xl">Digite sua pesquisa</h2>
      <p className="mx-auto mt-2 max-w-md text-gray-600">Use o campo acima para buscar conteúdos no site ou comece por um dos atalhos abaixo.</p>

      <div className="mt-8">
        <Suggestions />
      </div>

      <div className="mt-12 text-left">
        <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-gray-500">Explore o site</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(({ icon: Icon, label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-gray-100 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.35)] transition-[translate,scale,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(0,63,127,0.45)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#00a859]/10 text-[#00a859] transition-colors duration-300 group-hover:bg-[#00a859] group-hover:text-white">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="flex-1 font-bold text-gray-800 group-hover:text-[#003f7f]">{label}</span>
                <FaArrowRight aria-hidden="true" className="h-3 w-3 text-gray-400 transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-[#003f7f] motion-reduce:transition-none" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmptyQueryState;
