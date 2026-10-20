'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaNewspaper, FaCalendarAlt, FaVideo, FaImages,
  FaBriefcase, FaStore, FaArrowRight, FaBullhorn
} from 'react-icons/fa';

const STAT_CARDS = [
  { key: 'news', label: 'Notícias', icon: <FaNewspaper />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/noticias' },
  { key: 'events', label: 'Eventos', icon: <FaCalendarAlt />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/eventos' },
  { key: 'videos', label: 'Vídeos', icon: <FaVideo />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/tv-lojista' },
  { key: 'hero_slides', label: 'Banners (Slides)', icon: <FaImages />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/conteudo/hero-carousel' },
  { key: 'partners', label: 'Associados', icon: <FaStore />, color: 'from-[#ffd000] to-[#ffed4e]', href: '/admin/conteudo/parceiros' },
  { key: 'jobs', label: 'Vagas', icon: <FaBriefcase />, color: 'from-[#00a859] to-[#00d670]', href: '/admin/balcao-empregos' },
  { key: 'campaigns', label: 'Campanhas', icon: <FaBullhorn />, color: 'from-[#003f7f] to-[#0066cc]', href: '/admin/campanhas' },
];

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar estatísticas');
      }

      setCounts(data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

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
      {hasError ? (
        <div role="alert" className="bg-white rounded-xl p-6 sm:p-8 shadow-md text-center">
          <p className="text-gray-700 font-semibold mb-4">
            Não foi possível carregar as estatísticas do site.
          </p>
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {isLoading ? (
            STAT_CARDS.map((stat) => (
              <div key={stat.key} className="bg-white rounded-xl p-6 shadow-md animate-pulse h-32"></div>
            ))
          ) : (
            STAT_CARDS.map((stat) => (
              <Link
                key={stat.key}
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
                  {counts[stat.key] ?? 0}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold">
                  {stat.label}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
