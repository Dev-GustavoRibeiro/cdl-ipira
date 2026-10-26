import React from 'react';

/** Esqueleto da lista de resultados (mesmo formato do ResultCard). */
const LoadingState = () => {
  return (
    <div role="status" aria-label="Pesquisando">
      <div aria-hidden="true" className="mb-8 space-y-3">
        <div className="h-8 w-72 max-w-full animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none" />
        <div className="h-4 w-40 animate-pulse rounded-full bg-gray-200/80 motion-reduce:animate-none" />
        <div className="flex gap-2 pt-3">
          {[24, 28, 24].map((w, i) => (
            <div key={i} style={{ width: `${w * 4}px` }} className="h-10 animate-pulse rounded-full bg-gray-200/80 motion-reduce:animate-none" />
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-gray-100 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.3)] sm:gap-5 sm:p-5">
            <div className="h-24 w-24 shrink-0 animate-pulse rounded-xl bg-gray-200/80 motion-reduce:animate-none sm:h-28 sm:w-40 md:w-48" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-3 w-28 animate-pulse rounded-full bg-gray-200/80 motion-reduce:animate-none" />
              <div className="h-5 w-4/5 animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none" />
              <div className="h-3.5 w-full animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
              <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-gray-100 motion-reduce:animate-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
