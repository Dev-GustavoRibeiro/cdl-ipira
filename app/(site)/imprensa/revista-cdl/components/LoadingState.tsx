import React from 'react';
import { MAGAZINES_GRID, MAGAZINE_ITEM_WIDTH } from './MagazinesGrid';

// Esqueleto no formato das edições (capa em pé + textos)
const LoadingState = () => {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div role="status" aria-label="Carregando revistas" className={MAGAZINES_GRID}>
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className={`${MAGAZINE_ITEM_WIDTH} overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.3)] animate-pulse motion-reduce:animate-none`}
            >
              <div className="aspect-3/4 bg-gray-200/80" />
              <div className="flex flex-col gap-3 p-3.5 sm:p-5">
                <div className="h-3 w-1/3 rounded-full bg-gray-100" />
                <div className="h-5 w-4/5 rounded-full bg-gray-200/80" />
                <div className="mt-2 h-10 w-full rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoadingState;
