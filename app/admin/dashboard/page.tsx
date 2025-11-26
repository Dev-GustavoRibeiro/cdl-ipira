'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FaNewspaper, FaCalendarAlt, FaVideo, FaImages, 
  FaBriefcase, FaStore, FaArrowRight
} from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Notícias', value: '0', icon: <FaNewspaper />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/noticias' },
    { label: 'Eventos', value: '0', icon: <FaCalendarAlt />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/eventos' },
    { label: 'Vídeos', value: '0', icon: <FaVideo />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/tv-lojista' },
    { label: 'Banners (Slides)', value: '0', icon: <FaImages />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/conteudo/hero-carousel' },
    { label: 'Parceiros', value: '0', icon: <FaStore />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/conteudo/parceiros' },
    { label: 'Vagas', value: '0', icon: <FaBriefcase />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/balcao-empregos' },
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        // Buscar contagens
        const [
          { count: newsCount },
          { count: eventsCount },
          { count: videosCount },
          { count: heroCount },
          { count: partnersCount },
          { count: jobsCount },
        ] = await Promise.all([
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('videos').select('*', { count: 'exact', head: true }),
          supabase.from('hero_slides').select('*', { count: 'exact', head: true }),
          supabase.from('partners').select('*', { count: 'exact', head: true }),
          supabase.from('jobs').select('*', { count: 'exact', head: true }),
        ]);

        setStats([
          { label: 'Notícias', value: (newsCount || 0).toString(), icon: <FaNewspaper />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/noticias' },
          { label: 'Eventos', value: (eventsCount || 0).toString(), icon: <FaCalendarAlt />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/eventos' },
          { label: 'Vídeos', value: (videosCount || 0).toString(), icon: <FaVideo />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/tv-lojista' },
          { label: 'Banners (Slides)', value: (heroCount || 0).toString(), icon: <FaImages />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/conteudo/hero-carousel' },
          { label: 'Parceiros', value: (partnersCount || 0).toString(), icon: <FaStore />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/conteudo/parceiros' },
          { label: 'Vagas', value: (jobsCount || 0).toString(), icon: <FaBriefcase />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/balcao-empregos' },
        ]);

      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const quickActions = [
    { label: 'Criar Nova Notícia', href: '/admin/noticias/novo', icon: <FaNewspaper /> },
    { label: 'Adicionar Evento', href: '/admin/eventos/novo', icon: <FaCalendarAlt /> },
    { label: 'Upload de Vídeo', href: '/admin/tv-lojista/novo', icon: <FaVideo /> },
    { label: 'Gerenciar Banners', href: '/admin/conteudo/hero-carousel', icon: <FaImages /> },
    { label: 'Gerenciar Parceiros', href: '/admin/conteudo/parceiros', icon: <FaStore /> },
    { label: 'Cadastrar Vaga', href: '/admin/balcao-empregos/novo', icon: <FaBriefcase /> },
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
    </div>
  );
}
