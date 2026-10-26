import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { isOptimizableImage } from '@/lib/images';
import { SearchResult, typeConfig, formatDate, highlightParts } from './types';

interface ResultCardProps {
  result: SearchResult;
  /** Termo pesquisado, destacado no título e na descrição */
  query?: string;
}

function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  return (
    <>
      {highlightParts(text, query).map((part, index) =>
        part.match ? (
          <mark key={index} className="rounded-sm bg-[#ffd000]/45 px-0.5 text-inherit">
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )}
    </>
  );
}

// O link do título cobre o cartão inteiro (after:inset-0); o contorno de foco vai para o cartão
const linkClass =
  "after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:shadow-none! focus-visible:outline-none!";

const ResultCard = ({ result, query }: ResultCardProps) => {
  const config = typeConfig[result.type] || typeConfig.page;
  const Icon = config.icon;
  const isExternal = result.url.startsWith('http');
  const date = result.date ? formatDate(result.date) : '';

  return (
    <article className="group relative flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-gray-100 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.35)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(0,63,127,0.45)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#003f7f] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:gap-5 sm:p-5 animate-scale-in">
      {/* Imagem (se houver) ou ícone do tipo */}
      {result.image ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-40 md:w-48">
          <Image
            src={result.image}
            alt=""
            fill
            sizes="(min-width: 768px) 192px, (min-width: 640px) 160px, 96px"
            unoptimized={!isOptimizableImage(result.image)}
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {/* Fundo branco por baixo: as cores translúcidas do tipo não somem sobre a foto */}
          <span className="absolute bottom-1.5 left-1.5 overflow-hidden rounded-lg bg-white shadow-md ring-2 ring-white">
            <span className={`grid h-7 w-7 place-items-center ${config.bgColor} ${config.color}`}>
              <Icon aria-hidden="true" className="h-3 w-3" />
            </span>
          </span>
        </div>
      ) : (
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl sm:h-14 sm:w-14 ${config.bgColor} ${config.color}`}>
          <Icon aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
          <span className="font-bold uppercase tracking-[0.12em] text-[#003f7f]">{config.label}</span>
          {result.category && (
            <>
              <span aria-hidden="true">·</span>
              <span>{result.category}</span>
            </>
          )}
          {date && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={result.date?.slice(0, 10)}>{date}</time>
            </>
          )}
        </p>

        <h3 className="mt-1.5 text-base font-bold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-[#003f7f] sm:text-lg">
          {isExternal ? (
            <a href={result.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <span className="line-clamp-2"><Highlight text={result.title} query={query} /></span>
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          ) : (
            <Link href={result.url} className={linkClass}>
              <span className="line-clamp-2"><Highlight text={result.title} query={query} /></span>
            </Link>
          )}
        </h3>

        {result.description && (
          <p className="mt-1.5 line-clamp-2 max-w-[65ch] text-sm leading-relaxed text-gray-600">
            <Highlight text={result.description} query={query} />
          </p>
        )}

        <span aria-hidden="true" className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold text-[#003f7f] transition-[gap] duration-300 group-hover:gap-2.5">
          {isExternal ? 'Acessar' : 'Ver mais'}
          {isExternal ? <FaExternalLinkAlt className="h-3 w-3" /> : <FaArrowRight className="h-3 w-3" />}
        </span>
      </div>
    </article>
  );
};

export default ResultCard;
