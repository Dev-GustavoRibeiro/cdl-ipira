import React from 'react';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

/** Abre a ficha da CDL no Google Maps (rotas, horários, fotos). */
export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=CDL%20-%20C%C3%A2mara%20de%20Dirigentes%20Lojistas%20de%20Ipir%C3%A1';

const MapSection = () => {
  return (
    <section aria-labelledby="localizacao-titulo" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ffd000] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#003f7f] shadow-sm">
            <FaMapMarkerAlt aria-hidden="true" className="h-3.5 w-3.5" />
            Onde estamos
          </span>
          <h2 id="localizacao-titulo" className="mt-4 text-3xl font-black leading-[1.08] tracking-tight text-balance text-[#003f7f] sm:text-4xl lg:text-5xl">
            Nossa Localização
          </h2>
          <div aria-hidden="true" className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />
          <p className="mt-5 text-base text-balance text-gray-600 md:text-lg">
            Venha nos visitar! Estamos localizados no centro de Ipirá, na Passarela Center.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-3xl bg-white ring-1 ring-gray-200 shadow-[0_30px_60px_-30px_rgba(0,63,127,0.45)] md:mt-14">
          <div className="relative aspect-4/3 bg-gray-200 sm:aspect-video lg:aspect-21/9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.7698049399102!2d-39.73938862155856!3d-12.158816444321067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x714db85e6de07eb%3A0xec56058059003bed!2sCDL%20-%20C%C3%A2mara%20de%20Dirigentes%20Lojistas%20de%20Ipir%C3%A1!5e0!3m2!1spt-BR!2sbr!4v1764212197479!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
              title="Localização CDL Ipirá"
            />
          </div>

          {/* No celular o cartão fica abaixo do mapa; a partir de md flutua sobre ele */}
          <div className="p-5 sm:p-6 md:absolute md:bottom-6 md:left-6 md:max-w-sm md:rounded-2xl md:bg-white/95 md:shadow-[0_20px_50px_-20px_rgba(0,26,61,0.55)] md:ring-1 md:ring-gray-100 md:backdrop-blur">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#003f7f] text-white">
                <FaMapMarkerAlt aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <p className="font-black tracking-tight text-[#003f7f]">CDL Ipirá</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Avenida Cesár Cabral, Nº 164 - Passarela Center, L02, Centro, Ipirá-BA, 44600-000
                </p>
              </div>
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#003f7f] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#0052a3] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Abrir no Google Maps
              <FaExternalLinkAlt aria-hidden="true" className="h-3 w-3" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
