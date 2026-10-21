'use client';

import React from 'react';

const pulse = 'animate-pulse motion-reduce:animate-none';

/** Esqueleto da página enquanto a equipe carrega: destaque do presidente + grade de cartões. */
const LoadingState = () => {
  return (
    <section role="status" aria-label="Carregando equipe" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" aria-hidden="true">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 rounded-[2rem] bg-gray-100 p-5 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:p-10">
          <div className={`mx-auto aspect-4/5 w-full max-w-sm rounded-3xl bg-gray-200 lg:max-w-none ${pulse}`} />
          <div className="space-y-4">
            <div className={`h-3 w-40 rounded-full bg-gray-200 ${pulse}`} />
            <div className={`h-10 w-4/5 rounded-full bg-gray-200 ${pulse}`} />
            <div className={`h-5 w-1/3 rounded-full bg-gray-200 ${pulse}`} />
            <div className="space-y-2.5 pt-4">
              <div className={`h-3.5 w-full rounded-full bg-gray-200/70 ${pulse}`} />
              <div className={`h-3.5 w-11/12 rounded-full bg-gray-200/70 ${pulse}`} />
              <div className={`h-3.5 w-3/4 rounded-full bg-gray-200/70 ${pulse}`} />
            </div>
            <div className={`mt-6 h-28 w-full rounded-2xl bg-gray-200/70 ${pulse}`} />
          </div>
        </div>

        <div className="mt-16 flex justify-center gap-6 lg:gap-8">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={`w-full max-w-sm overflow-hidden rounded-3xl bg-white ring-1 sm:w-[calc((100%-1.5rem)/2)] sm:max-w-none lg:w-[calc((100%-4rem)/3)] ring-gray-100 shadow-[0_20px_50px_-24px_rgba(0,63,127,0.25)] ${i === 1 ? 'hidden sm:block' : ''} ${i === 2 ? 'hidden lg:block' : ''}`}>
              <div className={`aspect-4/5 bg-gray-200 ${pulse}`} />
              <div className="space-y-3 p-6">
                <div className={`h-5 w-24 rounded-full bg-gray-200 ${pulse}`} />
                <div className={`h-5 w-3/4 rounded-full bg-gray-200 ${pulse}`} />
                <div className={`h-3 w-full rounded-full bg-gray-100 ${pulse}`} />
                <div className={`h-3 w-2/3 rounded-full bg-gray-100 ${pulse}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoadingState;
