'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FaNewspaper, FaCalendarAlt, FaVideo, FaImages, 
  FaBriefcase, FaStore, FaArrowRight
} from 'react-icons/fa';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Notícias', value: '0', icon: <FaNewspaper />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/noticias' },
    { label: 'Eventos', value: '0', icon: <FaCalendarAlt />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/eventos' },
    { label: 'Vídeos', value: '0', icon: <FaVideo />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/tv-lojista' },
    { label: 'Banners (Slides)', value: '0', icon: <FaImages />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/conteudo/hero-carousel' },
    { label: 'Associados', value: '0', icon: <FaStore />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/conteudo/parceiros' },
    { label: 'Vagas', value: '0', icon: <FaBriefcase />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/balcao-empregos' },
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar estatísticas');
        }

        setStats([
          { label: 'Notícias', value: (data.news || 0).toString(), icon: <FaNewspaper />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/noticias' },
          { label: 'Eventos', value: (data.events || 0).toString(), icon: <FaCalendarAlt />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/eventos' },
          { label: 'Vídeos', value: (data.videos || 0).toString(), icon: <FaVideo />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/tv-lojista' },
          { label: 'Banners (Slides)', value: (data.hero_slides || 0).toString(), icon: <FaImages />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/conteudo/hero-carousel' },
          { label: 'Associados', value: (data.partners || 0).toString(), icon: <FaStore />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/conteudo/parceiros' },
          { label: 'Vagas', value: (data.jobs || 0).toString(), icon: <FaBriefcase />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/balcao-empregos' },
        ]);

      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);


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
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse h-32"></div>
          ))
        ) : (
          stats.map((stat, index) => (
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
          ))
        )}
      </div>
    </div>
  );
}
