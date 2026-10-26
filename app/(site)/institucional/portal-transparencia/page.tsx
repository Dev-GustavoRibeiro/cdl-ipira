'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FaExclamationTriangle } from 'react-icons/fa';
import { StateBlock } from '@/app/(site)/imprensa/noticias/components/LoadStates';
import { btnPrimary } from '../_components/ui';
import {
  Breadcrumb,
  HeroSection,
  FiltersSection,
  DocumentsSection,
  InfoSection,
  Documento
} from './components';

export default function PortalTransparenciaPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categorias, setCategorias] = useState<string[]>([]);

  // Recarrega quando reloadKey muda (botão "Tentar novamente")
  useEffect(() => {
    async function fetchDocumentos() {
      try {
        const { data, error } = await supabase
          .from('transparency_documents')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: false });

        if (error) throw error;
        
        setDocumentos(data || []);
        
        // Extrair categorias únicas
        const cats = [...new Set(data?.map(d => d.category).filter(Boolean))] as string[];
        setCategorias(cats);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocumentos();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
  };

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Sem documentos publicados não há o que filtrar: a barra de busca só aparece com a lista
  const showFilters = isLoading || documentos.length > 0;

  return (
    <>
      <Breadcrumb />
      <HeroSection />
      {!loadError && showFilters && (
        <FiltersSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categorias={categorias}
        />
      )}
      {loadError ? (
        <section className="bg-linear-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar os documentos"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={handleRetry} className={btnPrimary}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : (
        <DocumentsSection
          documentos={filteredDocumentos}
          isLoading={isLoading}
          filterCategory={filterCategory}
          hasActiveFilters={searchTerm.trim() !== '' || filterCategory !== 'all'}
          onClearFilters={clearFilters}
        />
      )}
      <InfoSection />
    </>
  );
}
