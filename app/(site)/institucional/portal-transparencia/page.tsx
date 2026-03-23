'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categorias, setCategorias] = useState<string[]>([]);

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
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocumentos();
  }, []);

  const filteredDocumentos = documentos.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Breadcrumb />
      <HeroSection />
      <FiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categorias={categorias}
      />
      <DocumentsSection
        documentos={filteredDocumentos}
        isLoading={isLoading}
        filterCategory={filterCategory}
      />
      <InfoSection />
    </>
  );
}
