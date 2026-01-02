'use client';

import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  HeroSection,
  SearchSection,
  PartnersGrid,
  CTASection,
  Parceiro
} from './components';

export default function EmpresasPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchParceiros() {
      try {
        const response = await fetch('/api/parceiros');
        if (response.ok) {
          const data = await response.json();
          const formattedParceiros = data.map((p: { id: number; name: string; logo: string; website?: string; order_index?: number; order?: number }) => ({
            id: p.id,
            name: p.name,
            logo: p.logo,
            website: p.website,
            order: p.order_index || p.order || 0
          }));
          setParceiros(formattedParceiros);
        }
      } catch (error) {
        console.error('Erro ao carregar associados:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchParceiros();
  }, []);

  const filteredParceiros = parceiros.filter(parceiro =>
    parceiro.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Breadcrumb />
      <HeroSection />
      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <PartnersGrid
        parceiros={filteredParceiros}
        isLoading={isLoading}
        searchTerm={searchTerm}
        totalCount={parceiros.length}
      />
      <CTASection />
    </>
  );
}
