'use client';

import React from 'react';
import Image from 'next/image';
import { FaBuilding, FaGem } from 'react-icons/fa';

const HistoryContent = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagem com efeito */}
          <div className="relative group order-2 lg:order-1">
            <div className="absolute -inset-4 bg-linear-to-r from-[#003f7f] to-[#00a859] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/cdl-ipira-sede.jpg"
                  alt="CDL Ipirá - Nossa História"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#003f7f]/60 via-transparent to-transparent"></div>
              </div>
              
              {/* Badge flutuante */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 sm:p-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-xl flex items-center justify-center">
                    <FaBuilding className="text-[#003f7f] text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Sede própria</p>
                    <p className="text-lg sm:text-xl font-black text-[#003f7f]">Centro de Ipirá</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-[#003f7f]/10 text-[#003f7f] px-4 py-2 rounded-full text-sm font-bold mb-6">
              <FaGem className="text-[#ffd000]" />
              <span>Nossa Fundação</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-6 leading-tight">
              O Início de Uma
              <span className="block text-[#00a859]">Grande Jornada</span>
            </h2>

            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p className="text-base sm:text-lg text-justify">
                A <strong className="text-[#003f7f]">Câmara de Dirigentes Lojistas de Ipirá (CDL Ipirá)</strong> nasceu do sonho de um grupo de empresários visionários que acreditavam no poder da união para fortalecer o comércio local.
              </p>

              <p className="text-base sm:text-lg text-justify">
                Desde sua fundação, a CDL Ipirá tem sido uma instituição fundamental para o <strong className="text-[#00a859]">desenvolvimento econômico e social</strong> de nossa cidade, oferecendo serviços essenciais como o SPC Brasil, assessoria jurídica, certificado digital e muito mais.
              </p>

              <p className="text-base sm:text-lg text-justify">
                Ao longo dos anos, expandimos nossa atuação, sempre inovando e buscando as melhores soluções para nossos associados. Promovemos eventos, cursos e ações que fortalecem não apenas o setor comercial, mas toda a comunidade.
              </p>
            </div>

            {/* Destaque */}
            <div className="mt-8 p-6 bg-linear-to-r from-[#003f7f]/5 to-[#00a859]/5 rounded-2xl border-l-4 border-[#003f7f]">
              <p className="text-[#003f7f] font-bold text-lg mb-2">
                Nossa missão continua
              </p>
              <p className="text-gray-600 text-sm sm:text-base">
                Com uma trajetória marcada pela dedicação, continuamos sendo parceiros essenciais para o sucesso dos negócios em Ipirá.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryContent;



