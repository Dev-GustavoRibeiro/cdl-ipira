'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBullhorn, FaExclamationTriangle } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { getCampaignStatus } from '@/lib/campaigns';
import { todayISO } from '@/lib/date';
import Breadcrumb from './Breadcrumb';
import HeroSection from './HeroSection';
import FeaturedCampaign from './FeaturedCampaign';
import CampaignsGrid from './CampaignsGrid';
import CampaignActivities from './CampaignActivities';
import { Campaign, CampaignStatus, isMissingSchema } from './types';
import { CardsSkeleton, StateBlock, primaryButton, secondaryButton } from '../../noticias/components/LoadStates';

// Destaque: entre as marcadas, em andamento > em breve > encerrada mais recente
const statusPriority: Record<CampaignStatus, number> = { active: 0, upcoming: 1, finished: 2 };

export default function CampanhasContent() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('is_active', true)
          .order('start_date', { ascending: false });

        // Tabela ainda não criada: mostra o estado vazio
        if (error && !isMissingSchema(error)) throw error;
        setCampaigns(data || []);
      } catch (error) {
        console.error('Erro ao carregar campanhas:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, [reloadKey]);

  const retry = () => {
    setIsLoading(true);
    setHasError(false);
    setReloadKey((key) => key + 1);
  };

  const today = todayISO();
  const featured = campaigns
    .filter((campaign) => campaign.is_featured)
    .sort((a, b) => statusPriority[getCampaignStatus(a, today)] - statusPriority[getCampaignStatus(b, today)])[0];

  return (
    <>
      <Breadcrumb />
      <HeroSection />

      {isLoading ? (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <CardsSkeleton label="Carregando campanhas" count={3} />
          </div>
        </section>
      ) : hasError ? (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar as campanhas"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={retry} className={primaryButton}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : campaigns.length === 0 ? (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaBullhorn}
              title="Novas campanhas em breve"
              description="Estamos preparando novas ações para movimentar o comércio de Ipirá. Enquanto isso, acompanhe as novidades da CDL."
            >
              <Link href="/imprensa/noticias" className={primaryButton}>
                Ver notícias
              </Link>
              <Link href="/imprensa/eventos" className={secondaryButton}>
                Ver eventos
              </Link>
            </StateBlock>
          </div>
        </section>
      ) : (
        <>
          {featured && <FeaturedCampaign campaign={featured} />}
          <CampaignsGrid campaigns={campaigns} />
          <CampaignActivities />
        </>
      )}
    </>
  );
}
