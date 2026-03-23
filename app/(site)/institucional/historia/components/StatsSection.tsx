'use client';

import React from 'react';
import { FaUsers, FaCalendarAlt, FaHandshake, FaAward } from 'react-icons/fa';
import AnimatedCounter from './AnimatedCounter';

const conquistas = [
  { icon: FaUsers, number: 100, suffix: '+', label: 'Associados Ativos' },
  { icon: FaCalendarAlt, number: 30, suffix: '+', label: 'Anos de História' },
  { icon: FaHandshake, number: 500, suffix: '+', label: 'Parcerias Realizadas' },
  { icon: FaAward, number: 15, suffix: '+', label: 'Reconhecimentos' },
];

const StatsSection = () => {
  return (
    <section className="py-16 sm:py-20 bg-white relative -mt-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {conquistas.map((item, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <item.icon className="text-white text-2xl sm:text-3xl" />
              </div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-2">
                <AnimatedCounter end={item.number} suffix={item.suffix} />
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;



