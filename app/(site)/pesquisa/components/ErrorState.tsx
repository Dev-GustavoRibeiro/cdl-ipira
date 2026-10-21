import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

interface ErrorStateProps {
  error: string;
  /** Refaz a busca do termo atual */
  onRetry?: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div
      role="alert"
      className="mx-auto max-w-lg rounded-3xl border border-gray-100 bg-linear-to-b from-white to-gray-50 px-6 py-10 text-center shadow-[0_20px_50px_-24px_rgba(0,63,127,0.35)] sm:px-10 sm:py-12 animate-scale-in"
    >
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/60">
        <FaExclamationTriangle aria-hidden="true" className="h-6 w-6" />
      </span>
      <h2 className="mt-5 text-2xl font-black tracking-tight text-[#003f7f]">Não foi possível pesquisar</h2>
      <p className="mt-2 text-gray-600">{error}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#003f7f] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#0052a3] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <FaRedo aria-hidden="true" className="h-3 w-3" />
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default ErrorState;
