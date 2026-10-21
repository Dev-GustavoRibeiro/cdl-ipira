import React from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope, FaClock } from 'react-icons/fa';

const hours = [
  { day: 'Segunda a Sexta', time: '08:00 - 18:00' },
  { day: 'Sábado', time: '08:00 - 12:00' },
  { day: 'Domingo', time: 'Fechado' },
];

const promises = [
  {
    icon: FaPhone,
    title: 'Atendimento Rápido',
    text: 'Nossa equipe está pronta para atender você de segunda a sábado.',
    tile: 'bg-[#003f7f]/10 text-[#003f7f]',
  },
  {
    icon: FaWhatsapp,
    title: 'WhatsApp',
    text: 'Fale conosco pelo WhatsApp e receba respostas rápidas e diretas.',
    tile: 'bg-[#00a859]/10 text-[#00a859]',
  },
  {
    icon: FaEnvelope,
    title: 'E-mail',
    text: 'Envie sua mensagem por e-mail e responderemos em até 24 horas.',
    tile: 'bg-[#ffd000]/25 text-[#003f7f]',
  },
];

/** Coluna ao lado do formulário: horário de atendimento e prazos de resposta. */
const InfoCardsSection = () => {
  return (
    <aside aria-label="Horário e atendimento" className="space-y-5 lg:sticky lg:top-[calc(var(--header-height,0px)+2rem)]">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] p-6 text-white shadow-[0_30px_60px_-30px_rgba(0,63,127,0.7)] sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#ffd000]/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FaClock aria-hidden="true" className="h-4 w-4 text-[#ffd000]" />
            </span>
            <h2 className="text-xl font-black tracking-tight">Horário de Atendimento</h2>
          </div>
          <dl className="mt-6 divide-y divide-white/10">
            {hours.map(({ day, time }) => (
              <div key={day} className="flex items-center justify-between gap-4 py-3">
                <dt className="font-semibold text-white/90">{day}</dt>
                <dd className={time === 'Fechado' ? 'text-white/75' :'font-bold tabular-nums'}>{time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-gray-100 shadow-[0_20px_50px_-24px_rgba(0,63,127,0.35)] sm:p-8">
        <h2 className="text-lg font-black tracking-tight text-[#003f7f]">Como respondemos</h2>
        <ul className="mt-5 space-y-5">
          {promises.map(({ icon: Icon, title, text, tile }) => (
            <li key={title} className="flex items-start gap-4">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tile}`}>
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default InfoCardsSection;
