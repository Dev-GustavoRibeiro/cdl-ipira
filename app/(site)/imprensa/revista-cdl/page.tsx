'use client';

import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
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
import { StateBlock, primaryButton } from '../noticias/components/LoadStates';

// Busca sem diferenciar acentos/maiúsculas ("edicao" encontra "Edição")
const normalize = (value?: string | null) =>
  (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function RevistaCDLPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Recarrega a lista quando reloadKey muda (botão "Tentar novamente")
  useEffect(() => {
    const fetchMagazines = async () => {
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
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMagazines();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const term = normalize(searchTerm.trim());
  const filteredMagazines = magazines.filter(mag =>
    normalize(mag.title).includes(term) ||
    normalize(mag.edition).includes(term)
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
      ) : loadError ? (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar as edições"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={handleRetry} className={primaryButton}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : magazines.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Edição em Destaque */}
          {latestMagazine && !searchTerm && (
            <LatestMagazineSection magazine={latestMagazine} />
          )}

          {/* Busca e Outras Edições (com uma só edição, o destaque já basta) */}
          {magazines.length > 1 && (
            <section className="py-10 sm:py-12 md:py-16 bg-white">
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
          )}
        </>
      )}

      <CTASection />
    </>
  );
}
