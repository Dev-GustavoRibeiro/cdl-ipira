'use client';

import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaExclamationTriangle } from 'react-icons/fa';
import JobModal from '@/app/components/JobModal';
import { formatDateBR } from '@/lib/date';
import { StateBlock, primaryButton } from '@/app/(site)/imprensa/noticias/components/LoadStates';
import { SectionHeader, anchorOffset } from '../_components/ProductUI';
import {
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

// Busca sem diferenciar acentos/maiúsculas e tolerante a campos vazios ("gestao" encontra "Gestão")
const normalize = (value?: string | null) =>
  (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function BalcaoEmpregosPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
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
            date: formatDateBR(item.date)
          }));
          setJobs(mappedData);
        } else {
          console.error('Erro na resposta da API');
          setJobs([]);
          setLoadError(true);
        }
      } catch (error) {
        console.error('Erro ao carregar vagas:', error);
        setJobs([]);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [reloadKey]);

  // Botão "Tentar novamente" do estado de erro
  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const term = normalize(searchTerm.trim());
  const filteredJobs = jobs.filter(job => {
    const categoryMatch = selectedCategory === 'Todas' || job.category === selectedCategory;
    const searchMatch = term === '' ||
      normalize(job.title).includes(term) ||
      normalize(job.company).includes(term) ||
      normalize(job.description).includes(term);
    return categoryMatch && searchMatch;
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const openJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const hasFilters = selectedCategory !== 'Todas' || term !== '';
  const resetFilters = () => {
    setSelectedCategory('Todas');
    setSearchTerm('');
  };

  return (
    <>
      <HeroSection onOpenModal={openModal} />

      <section id="vagas" aria-labelledby="vagas-titulo" className={`bg-gray-50 py-16 md:py-24 ${anchorOffset}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Celular: título, filtros, vagas e "Quer contratar?" em sequência.
              Desktop: vagas e "Quer contratar?" à esquerda; filtros fixos (sticky) na coluna da direita. */}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_auto_1fr] lg:gap-x-10 lg:gap-y-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:col-start-1 lg:row-start-1">
              <SectionHeader
                id="vagas-titulo"
                align="left"
                eyebrow="Oportunidades"
                icon={FaBriefcase}
                title="Vagas Disponíveis"
              />
              {!isLoading && !loadError && (
                <p aria-live="polite" className="shrink-0 text-sm font-semibold text-gray-600">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
                </p>
              )}
            </div>

            <div className="min-w-0 lg:col-start-2 lg:row-span-3 lg:row-start-1">
              <div className="lg:sticky lg:top-[calc(var(--header-height,0px)+1.5rem)]">
                <FiltersSection
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  categories={categories}
                />
              </div>
            </div>

            <div className="lg:col-start-1 lg:row-start-2">
              {loadError ? (
                <StateBlock
                  icon={FaExclamationTriangle}
                  title="Não foi possível carregar as vagas"
                  description="Verifique sua conexão e tente novamente."
                >
                  <button type="button" onClick={handleRetry} className={primaryButton}>
                    Tentar novamente
                  </button>
                </StateBlock>
              ) : (
                <JobsGrid
                  jobs={filteredJobs}
                  isLoading={isLoading}
                  onJobClick={openJobModal}
                  onResetFilters={hasFilters ? resetFilters : undefined}
                />
              )}
            </div>

            <div className="min-w-0 lg:col-start-1 lg:row-start-3">
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
