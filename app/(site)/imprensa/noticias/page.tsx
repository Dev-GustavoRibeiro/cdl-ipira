'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import NewsModal from '@/app/components/NewsModal';
import {
  Breadcrumb,
  HeroSection,
  CategoriesFilter,
  NewsGrid,
  NewsItem
} from './components';

export default function NoticiasPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            let formattedDate = item.date;
            if (item.date && item.date.includes('-')) {
              const [year, month, day] = item.date.split('-');
              formattedDate = `${day}/${month}/${year}`;
            }
            return {
              ...item,
              date: formattedDate
            };
          });
          setAllNews(formattedNews);
        } else {
          setAllNews([]);
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setAllNews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

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
      <NewsGrid
        news={filteredNews}
        isLoading={isLoading}
        onOpenModal={openModal}
      />
      <NewsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        news={selectedNews}
      />
    </>
  );
}
