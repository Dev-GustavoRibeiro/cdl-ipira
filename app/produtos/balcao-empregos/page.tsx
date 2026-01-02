'use client';

import React, { useState, useEffect } from 'react';
import JobModal from '@/app/components/JobModal';
import {
  Breadcrumb,
  HeroSection,
  FiltersSection,
  JobsGrid,
  Sidebar,
  JobRegistrationModal
} from './components';

interface Job {
  id: number;
  title: string;
  company: string;
  quantity: number;
  description: string;
  location?: string;
  date?: string;
  category?: string;
}

const categories = ['Todas', 'Administrativo', 'Vendas', 'Gestão', 'Serviços Gerais'];

export default function BalcaoEmpregosPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para o Modal de Visualização de Vaga
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/vagas');
        if (response.ok) {
          const data = await response.json();
          const mappedData = data.map((item: { id: number; title: string; company: string; quantity: number; description: string; location?: string; date?: string; category?: string }) => ({
            ...item,
            date: item.date ? new Date(item.date).toLocaleDateString('pt-BR') : ''
          }));
          setJobs(mappedData);
        } else {
          console.error('Erro na resposta da API');
          setJobs([]); 
        }
      } catch (error) {
        console.error('Erro ao carregar vagas:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const categoryMatch = selectedCategory === 'Todas' || job.category === selectedCategory;
    const searchMatch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  useEffect(() => {
    if (isModalOpen || isJobModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen, isJobModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const openJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  return (
    <>
      <Breadcrumb />
      <HeroSection onOpenModal={openModal} />
      
      <FiltersSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {/* Grid de Vagas */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Coluna Principal - Vagas */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-6 sm:mb-8">
                Vagas Disponíveis
              </h2>
              <JobsGrid 
                jobs={filteredJobs} 
                isLoading={isLoading} 
                onJobClick={openJobModal} 
              />
            </div>

            {/* Sidebar - Quer Contratar */}
            <div className="lg:col-span-1">
              <Sidebar onOpenModal={openModal} />
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Cadastro de Vaga */}
      <JobRegistrationModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Modal de Visualização de Vaga */}
      <JobModal 
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        job={selectedJob}
      />
    </>
  );
}
