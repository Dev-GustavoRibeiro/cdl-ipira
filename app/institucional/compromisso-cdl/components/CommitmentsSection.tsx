'use client';

import React from 'react';
import { FaHandshake, FaHeart, FaShieldAlt, FaUsers } from 'react-icons/fa';

const commitments = [
  {
    id: 1,
    title: 'Representatividade',
    description: 'Defendemos os interesses do comércio local junto aos poderes públicos e entidades representativas.',
    icon: FaUsers,
    color: 'from-[#003f7f] to-[#0066cc]'
  },
  {
    id: 2,
    title: 'Fortalecimento',
    description: 'Oferecemos serviços e ferramentas que fortalecem os negócios dos nossos associados.',
    icon: FaShieldAlt,
    color: 'from-[#00a859] to-[#00d670]'
  },
  {
    id: 3,
    title: 'Desenvolvimento',
    description: 'Promovemos o desenvolvimento econômico e social de Ipirá e região.',
    icon: FaHandshake,
    color: 'from-[#ffd000] to-[#ffed4e]'
  },
  {
    id: 4,
    title: 'Compromisso Social',
    description: 'Desenvolvemos projetos sociais que beneficiam a comunidade local.',
    icon: FaHeart,
    color: 'from-[#003f7f] to-[#0066cc]'
  },
];

const CommitmentsSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
            Nossos Compromissos
          </h2>
          <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          {commitments.map((commitment, index) => (
            <div
              key={commitment.id}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${commitment.color} rounded-full flex items-center justify-center mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform`}>
                <commitment.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 sm:mb-3">
                {commitment.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
                {commitment.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommitmentsSection;



