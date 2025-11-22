'use client';

import React from 'react';

const Impostometro = () => {
  return (
    <section className="bg-linear-to-br from-teal-600 via-teal-700 to-teal-900 py-8 md:py-16 relative overflow-hidden">
      {/* Padrão de fundo animado */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-green-300 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-5 left-5 text-white/5 text-6xl md:text-9xl font-black select-none">R$</div>
      <div className="absolute bottom-5 right-5 text-white/5 text-6xl md:text-9xl font-black select-none">R$</div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-yellow-300 text-teal-900 px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-black mb-4 md:mb-6 shadow-2xl animate-bounce-slow">
            💰 Impostômetro Oficial - Ipirá-BA
          </div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4 drop-shadow-2xl">
            Impostos Arrecadados
          </h2>
          
          <p className="text-yellow-200 text-sm md:text-xl font-semibold mb-2">
            Acompanhe em tempo real
          </p>
          
          <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 md:px-6 md:py-2 rounded-full mt-2">
            <p className="text-white/80 text-xs md:text-sm">
              Fonte: IBPT - Impostômetro.com.br
            </p>
          </div>
        </div>

        {/* Iframe do Impostômetro com Scale Correction */}
        <div className="flex justify-center mb-8 md:mb-12 overflow-hidden">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-2 md:p-8 shadow-2xl border-2 border-yellow-300/30 hover:border-yellow-300 transition-all duration-300 w-full max-w-[640px] flex justify-center items-center">
            
            {/* Container que força o tamanho visual correto usando scale */}
            <div className="relative w-full flex justify-center h-[100px] min-[400px]:h-[110px] sm:h-[130px] md:h-[160px] transition-all duration-300">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 origin-top transform scale-[0.6] min-[400px]:scale-[0.65] sm:scale-[0.8] md:scale-100 transition-transform duration-300">
                <div style={{ clipPath: 'inset(0 0 32px 0)' }} className="rounded-2xl">
            <iframe 
              id="impostometro" 
              src="https://impostometro.com.br/widget/contador/ba?municipio=ipira" 
              width="590" 
              height="191" 
              scrolling="no" 
              style={{ border: 'none' }}
              title="Impostômetro de Ipirá-BA"
            />
          </div>
        </div>
          </div>

          </div>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
          <InfoCard 
            icon="📊" 
            title="Transparência" 
            desc="Acompanhamento em tempo real dos impostos arrecadados" 
          />
          <InfoCard 
            icon="🏛️" 
            title="Ipirá-BA" 
            desc="Contribuindo para o desenvolvimento da nossa cidade" 
          />
          <InfoCard 
            icon="💼" 
            title="CDL Ipirá" 
            desc="Fortalecendo o comércio e a economia local" 
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

const InfoCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 group">
    <div className="text-3xl md:text-5xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">{title}</h3>
    <p className="text-white/80 text-xs md:text-sm">{desc}</p>
  </div>
);

export default Impostometro;
