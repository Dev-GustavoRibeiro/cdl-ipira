'use client';

import React from 'react';

const ComparisonTable = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-[#003f7f] text-center mb-12">
            Compare as Funcionalidades
          </h2>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#003f7f] text-white">
                    <th className="px-6 py-4 text-left font-bold">Funcionalidade</th>
                    <th className="px-6 py-4 text-center font-bold">SPC AVISA</th>
                    <th className="px-6 py-4 text-center font-bold">SPC CONCILIADOR</th>
                    <th className="px-6 py-4 text-center font-bold">CADASTRO POSITIVO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Tipo de Serviço</td>
                    <td className="px-6 py-4 text-center text-gray-700">Monitoramento</td>
                    <td className="px-6 py-4 text-center text-gray-700">Negociação</td>
                    <td className="px-6 py-4 text-center text-gray-700">Histórico Positivo</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Custo</td>
                    <td className="px-6 py-4 text-center text-gray-700">Gratuito</td>
                    <td className="px-6 py-4 text-center text-gray-700">Gratuito</td>
                    <td className="px-6 py-4 text-center text-gray-700">Gratuito</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">Tempo de Ativação</td>
                    <td className="px-6 py-4 text-center text-gray-700">Imediato</td>
                    <td className="px-6 py-4 text-center text-gray-700">Imediato</td>
                    <td className="px-6 py-4 text-center text-gray-700">Imediato</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Disponibilidade</td>
                    <td className="px-6 py-4 text-center text-gray-700">24/7</td>
                    <td className="px-6 py-4 text-center text-gray-700">24/7</td>
                    <td className="px-6 py-4 text-center text-gray-700">24/7</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Benefício Principal</td>
                    <td className="px-6 py-4 text-center text-gray-700">Proteção</td>
                    <td className="px-6 py-4 text-center text-gray-700">Regularização</td>
                    <td className="px-6 py-4 text-center text-gray-700">Score de Crédito</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;



