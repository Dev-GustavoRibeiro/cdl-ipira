'use client';

import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { StateBlock, primaryButton } from '@/app/(site)/imprensa/noticias/components/LoadStates';
import {
  Breadcrumb,
  HeroSection,
  SearchSection,
  PartnersGrid,
  CTASection,
  Parceiro
} from './components';

// Busca sem diferenciar acentos/maiúsculas ("padaria sao jose" encontra "Padaria São José")
const normalize = (value?: string | null) =>
  (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function EmpresasPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Recarrega a lista quando reloadKey muda (botão "Tentar novamente")
  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const response = await fetch('/api/parceiros');
        if (!response.ok) throw new Error('Erro ao buscar associados');
        const data = await response.json();
        const formattedParceiros = data.map((p: { id: number; name: string; logo: string; website?: string; order_index?: number; order?: number }) => ({
          id: p.id,
          name: p.name,
          logo: p.logo,
          website: p.website,
          order: p.order_index || p.order || 0
        }));
        setParceiros(formattedParceiros);
      } catch (error) {
        console.error('Erro ao carregar associados:', error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParceiros();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const term = normalize(searchTerm.trim());
  const filteredParceiros = parceiros.filter(parceiro =>
    normalize(parceiro.name).includes(term)
  );

  return (
    <>
      <Breadcrumb />
      <HeroSection />
      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {loadError ? (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar os associados"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={handleRetry} className={primaryButton}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : (
        <PartnersGrid
          parceiros={filteredParceiros}
          isLoading={isLoading}
          searchTerm={searchTerm}
          totalCount={parceiros.length}
          onClearSearch={() => setSearchTerm('')}
        />
      )}
      <CTASection />
    </>
  );
}
