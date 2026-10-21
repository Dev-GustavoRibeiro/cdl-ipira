'use client';

import React from 'react';
import { FaBalanceScale } from 'react-icons/fa';
import { ACCENTS, SectionHeader, cardSurface } from '../../_components/ProductUI';
import { features } from './FeaturesData';

// Linhas da comparação; os valores iguais para as três soluções ficam fixos aqui
const rows: { label: string; value: (feature: (typeof features)[number]) => string }[] = [
  { label: 'Tipo de Serviço', value: (f) => f.type },
  { label: 'Custo', value: () => 'Gratuito' },
  { label: 'Tempo de Ativação', value: () => 'Imediato' },
  { label: 'Disponibilidade', value: () => '24/7' },
  { label: 'Benefício Principal', value: (f) => f.mainBenefit },
];

const ComparisonTable = () => {
  return (
    <section aria-labelledby="spc-comparacao" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          id="spc-comparacao"
          eyebrow="Comparativo"
          icon={FaBalanceScale}
          title="Compare as Funcionalidades"
          subtitle="Veja lado a lado o que cada solução do SPC Brasil oferece."
        />

        {/* Tablet e desktop: tabela (padding menor no tablet para caber sem cortar a última coluna) */}
        <div className={`mx-auto mt-12 hidden max-w-5xl overflow-x-auto md:block ${cardSurface}`}>
          <table className="w-full text-left">
            <caption className="sr-only">Comparação entre SPC AVISA, SPC CONCILIADOR e CADASTRO POSITIVO</caption>
            <thead>
              <tr className="bg-[#003f7f] text-white">
                <th scope="col" className="px-4 py-5 text-sm font-bold uppercase tracking-[0.12em] text-white/80 lg:px-6">
                  Funcionalidade
                </th>
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <th key={feature.id} scope="col" className="px-4 py-5 text-center lg:px-6">
                      <span className="inline-flex items-center gap-2.5 font-black tracking-tight">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-white/30 ${ACCENTS[feature.accent].tile}`}>
                          <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                        </span>
                        {feature.title}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.label} className="transition-colors odd:bg-white even:bg-gray-50/70 hover:bg-[#003f7f]/[0.04]">
                  <th scope="row" className="px-4 py-4 font-bold text-gray-900 lg:px-6">
                    {row.label}
                  </th>
                  {features.map((feature) => (
                    <td key={feature.id} className="px-4 py-4 text-center text-gray-700 lg:px-6">
                      {row.value(feature)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Celular: um cartão por solução, sem rolagem lateral */}
        <ul className="mt-10 grid gap-5 md:hidden">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.id} className={`overflow-hidden ${cardSurface}`}>
                <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${ACCENTS[feature.accent].tile}`}>
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <h3 className="font-black tracking-tight text-[#003f7f]">{feature.title}</h3>
                </div>
                <dl className="divide-y divide-gray-100 px-5">
                  {rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <dt className="font-semibold text-gray-600">{row.label}</dt>
                      <dd className="text-right font-bold text-gray-900">{row.value(feature)}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ComparisonTable;
