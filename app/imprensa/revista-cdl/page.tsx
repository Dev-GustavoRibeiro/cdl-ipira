'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Breadcrumb,
  HeroSection,
  LoadingState,
  EmptyState,
  LatestMagazineSection,
  SearchSection,
  MagazinesGrid,
  CTASection,
  Magazine
} from './components';

export default function RevistaCDLPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const { data, error } = await supabase
          .from('magazines')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: false });

        if (error) throw error;
        setMagazines(data || []);
      } catch (error) {
        console.error('Erro ao carregar revistas:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMagazines();
  }, []);

  const filteredMagazines = magazines.filter(mag =>
    mag.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mag.edition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Destacar a edição mais recente
  const latestMagazine = magazines[0];
  const otherMagazines = filteredMagazines.filter(m => m.id !== latestMagazine?.id);

  return (
    <>
      <Breadcrumb />
      <HeroSection />

      {isLoading ? (
        <LoadingState />
      ) : magazines.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Edição em Destaque */}
          {latestMagazine && !searchTerm && (
            <LatestMagazineSection magazine={latestMagazine} />
          )}

          {/* Busca e Outras Edições */}
          <section className="py-8 sm:py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <SearchSection 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              <MagazinesGrid 
                magazines={searchTerm ? filteredMagazines : otherMagazines}
                searchTerm={searchTerm}
              />
            </div>
          </section>
        </>
      )}

      <CTASection />
    </>
  );
}
