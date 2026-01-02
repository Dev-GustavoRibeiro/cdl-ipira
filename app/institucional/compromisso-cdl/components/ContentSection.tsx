'use client';

import React from 'react';

const ContentSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg">
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-700 leading-relaxed text-justify">
              <p className="text-sm xs:text-base sm:text-lg">
                A <strong className="text-[#003f7f] font-bold">CDL Ipirá</strong> tem como compromisso fundamental representar, defender e fortalecer os interesses do comércio local, sempre trabalhando em prol do desenvolvimento econômico e social de nossa cidade.
              </p>

              <p className="text-sm xs:text-base sm:text-lg">
                Nossa missão é oferecer serviços de excelência que contribuam para o crescimento e sucesso dos nossos associados, proporcionando ferramentas, orientações e suporte necessário para que possam prosperar em seus negócios.
              </p>

              <p className="text-sm xs:text-base sm:text-lg">
                Além disso, a CDL Ipirá desenvolve projetos sociais que beneficiam toda a comunidade, demonstrando nosso compromisso não apenas com o comércio, mas também com o bem-estar social e o desenvolvimento integral de Ipirá.
              </p>

              <p className="text-sm xs:text-base sm:text-lg">
                Estamos comprometidos em ser uma instituição transparente, ética e eficiente, sempre buscando inovações e melhorias que agreguem valor aos nossos associados e à comunidade como um todo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;



