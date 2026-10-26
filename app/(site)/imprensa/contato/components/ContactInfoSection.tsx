import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { CONTACT } from '@/app/components/navigation/navItems';
import { MAPS_URL } from './MapSection';

// Valores da mesma fonte do rodapé e das páginas legais (CONTACT): uma correção vale para o site todo
const [street, district] = CONTACT.address;
const [streetLine, ...complement] = street.split(' - ');

const channels = [
  {
    icon: FaPhoneAlt,
    label: 'Telefone',
    value: CONTACT.phone.label,
    hint: 'Ligue para nós',
    action: 'Ligar agora',
    href: CONTACT.phone.href,
    tile: 'bg-[#003f7f] text-white',
  },
  {
    icon: FaWhatsapp,
    label: 'WhatsApp',
    value: CONTACT.whatsapp.label,
    hint: 'Fale conosco pelo WhatsApp',
    action: 'Abrir conversa',
    href: CONTACT.whatsapp.href,
    tile: 'bg-[#00a859] text-white',
  },
  {
    icon: FaEnvelope,
    label: 'E-mail',
    value: CONTACT.email.label,
    hint: 'Envie-nos um e-mail',
    action: 'Enviar e-mail',
    href: CONTACT.email.href,
    tile: 'bg-[#ffd000] text-[#003f7f]',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Endereço',
    value: streetLine,
    hint: [...complement, district].join(' · '),
    action: 'Como chegar',
    href: MAPS_URL,
    tile: 'bg-[#0066cc] text-white',
  },
];

const ContactInfoSection = () => {
  return (
    <section aria-label="Canais de atendimento" className="relative z-10 -mt-24 md:-mt-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 colunas só a partir de xl: abaixo disso o e-mail quebrava no meio da palavra */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {channels.map(({ icon: Icon, label, value, hint, action, href, tile }, index) => {
            const isExternal = href.startsWith('http');
            return (
              <li key={label} className="animate-scale-in" style={{ animationDelay: `${index * 70}ms` }}>
                <a
                  href={href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group relative flex h-full items-start gap-4 overflow-hidden rounded-3xl bg-white p-5 sm:flex-col sm:gap-0 sm:p-6 ring-1 ring-[#003f7f]/[0.06] shadow-[0_20px_50px_-20px_rgba(0,63,127,0.35)] transition-[translate,scale,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(0,63,127,0.5)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                  />
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-[0_10px_20px_-10px_rgba(0,63,127,0.6)] ${tile}`}>
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  {/* No celular: ícone à esquerda e texto ao lado (cartões mais baixos) */}
                  <span className="flex min-w-0 flex-1 flex-col self-stretch sm:mt-5">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">{label}</span>
                    <span className="mt-1 text-lg font-black leading-snug tracking-tight text-[#003f7f] wrap-break-word">
                      {/* E-mail quebra depois do @ (e não no meio da palavra) em telas estreitas */}
                      {value.includes('@') ? (
                        <>
                          {value.slice(0, value.indexOf('@') + 1)}
                          <wbr />
                          {value.slice(value.indexOf('@') + 1)}
                        </>
                      ) : (
                        value
                      )}
                    </span>
                    <span className="mt-1 text-sm text-gray-600">{hint}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-bold text-[#003f7f] sm:pt-5">
                      {action}
                      <FaArrowRight aria-hidden="true" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                      {isExternal && <span className="sr-only"> (abre em nova aba)</span>}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ContactInfoSection;
