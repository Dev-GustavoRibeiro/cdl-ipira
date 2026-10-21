'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDateBR } from '@/lib/date';
import { FaExclamationTriangle } from 'react-icons/fa';
import NewsModal from '@/app/components/NewsModal';
import {
  Breadcrumb,
  HeroSection,
  CategoriesFilter,
  NewsGrid,
  NewsItem
} from './components';
import { StateBlock, primaryButton } from './components/LoadStates';

export default function NoticiasPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Recarrega a lista quando reloadKey muda (botão "Tentar novamente")
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('date', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedNews = data.map((item: { id: number; title: string; excerpt: string; content: string; image: string; date: string; category: string; color: string; author: string }) => {
            return {
              ...item,
              date: formatDateBR(item.date) || item.date || ''
            };
          });
          setAllNews(formattedNews);
        } else {
          setAllNews([]);
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setAllNews([]);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const openModal = (item: NewsItem) => {
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const filteredNews = selectedCategory === 'Todas' 
    ? allNews 
    : allNews.filter(news => news.category === selectedCategory);

  return (
    <>
      <Breadcrumb />
      <HeroSection />
      <CategoriesFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {loadError ? (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar as notícias"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={handleRetry} className={primaryButton}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : (
        <NewsGrid
          news={filteredNews}
          isLoading={isLoading}
          onOpenModal={openModal}
          onResetFilter={() => setSelectedCategory('Todas')}
        />
      )}
      <NewsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        news={selectedNews}
      />
    </>
  );
}
