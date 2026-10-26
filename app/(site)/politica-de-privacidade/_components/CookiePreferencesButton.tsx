'use client';

import { FaSlidersH } from 'react-icons/fa';
import { OPEN_CONSENT_EVENT } from '@/lib/consent';

/** Reabre o aviso de cookies (CookieConsent) com as escolhas atuais. */
export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#003f7f] px-5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,63,127,0.7)] transition-[background-color,scale] duration-200 hover:bg-[#0052a3] active:scale-[0.98] motion-reduce:transition-none print:hidden"
    >
      <FaSlidersH aria-hidden="true" className="h-3.5 w-3.5" />
      Rever minhas escolhas de cookies
    </button>
  );
}
