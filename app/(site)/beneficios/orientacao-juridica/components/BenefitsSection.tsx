import React from 'react';
import { FaCheckCircle, FaUsers, FaCalendarCheck, FaShieldAlt, FaStar } from 'react-icons/fa';
import SectionHeader from './SectionHeader';

const benefits = [
  {
    icon: FaCheckCircle,
    title: 'Gratuito para Associados',
    text: 'Sem custo para associados em dia com suas obrigações.',
    tile: 'bg-[#00a859]/10 text-[#00a859] ring-[#00a859]/15',
  },
  {
    icon: FaUsers,
    title: 'Orientação por Advogado(a)',
    text: 'As dúvidas são respondidas por profissional inscrito na OAB, indicado pela CDL Ipirá.',
    tile: 'bg-[#003f7f]/10 text-[#003f7f] ring-[#003f7f]/15',
  },
  {
    icon: FaCalendarCheck,
    title: 'Atendimento Agendado',
    text: 'A equipe da CDL entra em contato para combinar o horário do atendimento.',
    tile: 'bg-[#ffd000]/25 text-[#003f7f] ring-[#ffd000]/40',
  },
  {
    icon: FaShieldAlt,
    title: 'Prevenção',
    text: 'Entenda seus direitos e obrigações antes de tomar uma decisão.',
    tile: 'bg-[#0066cc]/10 text-[#0066cc] ring-[#0066cc]/15',
  },
];

const BenefitsSection = () => {
  return (
    <section aria-labelledby="beneficios-titulo" className="relative overflow-hidden bg-gray-50 py-16 md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#ffd000]/10 blur-3xl" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <SectionHeader
            id="beneficios-titulo"
            align="left"
            eyebrow="Vantagens"
            icon={FaStar}
            title="Como funciona o benefício"
            subtitle="Um benefício para quem empreende em Ipirá: orientação jurídica sem custo para associados em dia."
          />

          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {benefits.map(({ icon: Icon, title, text, tile }) => (
              <li
                key={title}
                className="flex h-full gap-4 rounded-2xl bg-white p-5 ring-1 ring-gray-100 shadow-[0_10px_30px_-18px_rgba(0,63,127,0.35)] sm:p-6"
              >
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ${tile}`}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-black tracking-tight text-[#003f7f] sm:text-lg">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600 sm:text-[15px]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
