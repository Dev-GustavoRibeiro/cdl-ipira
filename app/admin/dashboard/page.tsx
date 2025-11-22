'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaNewspaper, FaCalendarAlt, FaVideo, FaImages, 
  FaBriefcase, FaStore, FaGavel, FaFileAlt, FaBook,
  FaArrowRight, FaUsers, FaEye
} from 'react-icons/fa';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Notícias', value: '12', icon: <FaNewspaper />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/noticias' },
    { label: 'Eventos', value: '8', icon: <FaCalendarAlt />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/eventos' },
    { label: 'Vídeos', value: '6', icon: <FaVideo />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/tv-lojista' },
    { label: 'Fotos', value: '24', icon: <FaImages />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/galeria-fotos' },
    { label: 'Vagas', value: '6', icon: <FaBriefcase />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/balcao-empregos' },
    { label: 'Empresas', value: '12', icon: <FaStore />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/empresas' },
  ];

  const quickActions = [
    { label: 'Criar Nova Notícia', href: '/admin/noticias/novo', icon: <FaNewspaper /> },
    { label: 'Adicionar Evento', href: '/admin/eventos/novo', icon: <FaCalendarAlt /> },
    { label: 'Upload de Vídeo', href: '/admin/tv-lojista/novo', icon: <FaVideo /> },
    { label: 'Adicionar Fotos', href: '/admin/galeria-fotos/novo', icon: <FaImages /> },
    { label: 'Cadastrar Vaga', href: '/admin/balcao-empregos/novo', icon: <FaBriefcase /> },
    { label: 'Nova Empresa', href: '/admin/empresas/novo', icon: <FaStore /> },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Gerencie todo o conteúdo do site da CDL Ipirá
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br ${stat.color} rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl`}>
                {stat.icon}
              </div>
              <FaArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#003f7f] group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-1">
              {stat.value}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-semibold">
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-4 sm:mb-6">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-[#003f7f] hover:text-white rounded-lg transition-all duration-300 group"
            >
              <div className="text-[#003f7f] group-hover:text-white transition-colors">
                {action.icon}
              </div>
              <span className="font-semibold text-sm sm:text-base">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-4 sm:mb-6">
            Atividade Recente
          </h2>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#003f7f] rounded-full flex items-center justify-center text-white">
                  <FaNewspaper className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Nova notícia publicada</p>
                  <p className="text-xs text-gray-500">Há 2 horas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-4 sm:mb-6">
            Estatísticas
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FaUsers className="w-5 h-5 text-[#00a859]" />
                <span className="text-sm font-semibold">Total de Visitas</span>
              </div>
              <span className="text-lg font-black text-[#003f7f]">1.234</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FaEye className="w-5 h-5 text-[#003f7f]" />
                <span className="text-sm font-semibold">Páginas Visualizadas</span>
              </div>
              <span className="text-lg font-black text-[#003f7f]">5.678</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




