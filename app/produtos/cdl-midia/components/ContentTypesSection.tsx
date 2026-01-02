'use client';

import React from 'react';
import { FaVideo, FaMicrophone, FaFileAlt } from 'react-icons/fa';

const ContentTypesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#003f7f] mb-4">
              Tipos de Conteúdo
            </h2>
            <p className="text-xl text-gray-600">
              Diversos formatos para destacar sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <FaVideo className="w-12 h-12 text-[#003f7f] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vídeos de Boas-Vindas</h3>
              <p className="text-gray-600">
                Apresente sua empresa aos associados da CDL com vídeos personalizados e profissionais.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <FaMicrophone className="w-12 h-12 text-[#00a859] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Podcasts</h3>
              <p className="text-gray-600">
                Participe de entrevistas e compartilhe conhecimento através do CDL Cast.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <FaFileAlt className="w-12 h-12 text-[#ffd000] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Histórias Inspiradoras</h3>
              <p className="text-gray-600">
                Conte a trajetória da sua empresa no projeto "Minha Empresa Faz História".
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentTypesSection;



