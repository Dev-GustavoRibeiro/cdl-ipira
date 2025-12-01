'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaImage, FaTh, FaHandshake } from 'react-icons/fa';

export default function AdminConteudoPage() {
  const sections = [
    {
      title: 'Hero Carousel',
      description: 'Gerencie os slides do carrossel principal da página inicial',
      href: '/admin/conteudo/hero-carousel',
      icon: <FaImage className="w-8 h-8" />,
      color: 'from-[#003f7f] to-[#0066cc]'
    },
    {
      title: 'Associados',
      description: 'Gerencie os associados exibidos no carrossel',
      href: '/admin/conteudo/parceiros',
      icon: <FaHandshake className="w-8 h-8" />,
      color: 'from-[#ffd000] to-[#ffed4e]'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Conteúdo do Site
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie todos os conteúdos visíveis na página inicial
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sections.map((section, index) => (
          <Link
            key={index}
            href={section.href}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className={`w-16 h-16 bg-linear-to-br ${section.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {section.icon}
            </div>
            <h3 className="text-xl font-black text-[#003f7f] mb-2">
              {section.title}
            </h3>
            <p className="text-sm text-gray-600">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}





