'use client';

import React from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaEye, FaBook, FaUserCircle, FaUsers, FaFileAlt } from 'react-icons/fa';

const ServicesCards = () => {
  const services = [
    {
      icon: <FaCalendarAlt className="text-5xl text-[#00a859]" />,
      title: 'Eventos',
      link: '/imprensa/eventos'
    },
    {
      icon: <FaEye className="text-5xl text-[#00a859]" />,
      title: 'Portal Transparência',
      link: '/institucional/portal-transparencia'
    },
    {
      icon: <FaBook className="text-5xl text-[#00a859]" />,
      title: 'Revista CDL',
      link: '/imprensa/revista-cdl'
    },
    {
      icon: <FaUserCircle className="text-5xl text-[#00a859]" />,
      title: 'Portal do Associado',
      link: 'https://app.higestor.com.br/portal/cdl-ipira'
    },
    {
      icon: <FaUsers className="text-5xl text-[#00a859]" />,
      title: 'Cadastre Seu Currículo',
      link: '/produtos/balcao-empregos'
    },
    {
      icon: <FaFileAlt className="text-5xl text-[#00a859]" />,
      title: 'Compromisso da CDL',
      link: '/institucional/compromisso-cdl'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {services.map((service, index) => {
            const isExternal = service.link.startsWith('http');
            const Component = isExternal ? 'a' : Link;
            const props = isExternal
              ? { href: service.link, target: '_blank', rel: 'noopener noreferrer' }
              : { href: service.link };
            
            return (
              <Component
                key={index}
                {...props}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center group"
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#003f7f]">
                  {service.title}
                </h3>
              </Component>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesCards;

