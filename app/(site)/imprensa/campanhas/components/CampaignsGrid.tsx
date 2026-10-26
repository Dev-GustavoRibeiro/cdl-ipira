'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';
import { CAMPAIGN_STATUS_LABEL, getCampaignStatus } from '@/lib/campaigns';
import { formatDateBR, todayISO } from '@/lib/date';
import { isOptimizableImage } from '@/lib/images';
import { StateBlock, cardClass, primaryButton, staggerDelay } from '../../noticias/components/LoadStates';
import SectionTitle from './SectionTitle';
import { Campaign, CampaignStatus, formatPeriod } from './types';

type StatusFilter = 'all' | CampaignStatus;

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Em andamento' },
  { value: 'upcoming', label: 'Em breve' },
  { value: 'finished', label: 'Realizadas' },
];

interface CampaignsGridProps {
  campaigns: Campaign[];
}

const CampaignsGrid = ({ campaigns }: CampaignsGridProps) => {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const today = todayISO();

  const filteredCampaigns = campaigns.filter(
    (campaign) => selectedStatus === 'all' || getCampaignStatus(campaign, today) === selectedStatus
  );

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Todas as campanhas"
          subtitle="Acompanhe as campanhas em andamento, as que estão chegando e tudo o que já realizamos pelo comércio de Ipirá."
        />

        {/* Filtro de Status */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1.5 mb-6 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap sm:justify-center sm:gap-3 sm:mb-10" role="group" aria-label="Filtrar campanhas por status">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSelectedStatus(filter.value)}
              aria-pressed={selectedStatus === filter.value}
              className={`touch-target inline-flex min-h-9 shrink-0 items-center px-4 rounded-full text-[13px] sm:text-sm font-bold transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.98] ${
                selectedStatus === filter.value
                  ? 'bg-[#003f7f] text-white shadow-[0_8px_20px_-8px_rgba(0,63,127,0.7)]'
                  : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-[#003f7f]/10 hover:text-[#003f7f]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredCampaigns.length === 0 ? (
          <StateBlock
            icon={FaBullhorn}
            title="Nenhuma campanha com este status"
            description="Escolha outro filtro para ver as demais campanhas da CDL Ipirá."
          >
            <button type="button" onClick={() => setSelectedStatus('all')} className={primaryButton}>
              Ver todas as campanhas
            </button>
          </StateBlock>
        ) : (
          <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
            {filteredCampaigns.map((campaign, index) => {
              const status = CAMPAIGN_STATUS_LABEL[getCampaignStatus(campaign, today)];
              return (
                <Link
                  key={campaign.id}
                  href={`/imprensa/campanhas/${campaign.slug}`}
                  className={cardClass}
                  style={staggerDelay(index)}
                >
                  {/* Capa */}
                  <div className="relative h-48 sm:h-56 bg-linear-to-br from-[#003f7f] to-[#0066cc] overflow-hidden shrink-0">
                    {campaign.cover_image ? (
                      <Image
                        src={campaign.cover_image}
                        alt=""
                        fill
                        unoptimized={!isOptimizableImage(campaign.cover_image)}
                        className="object-cover group-hover:scale-105 transition-transform duration-700 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaBullhorn className="w-16 h-16 text-white/30" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

                    {/* Badge Status */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                      <span className={`${status.color} px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-black shadow-lg`}>
                        {status.text}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 sm:p-6 flex flex-col grow">
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-[-0.015em] text-gray-900 mb-2 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-snug">
                      {campaign.title}
                    </h3>
                    {campaign.summary && (
                      <p className="text-sm sm:text-[15px] text-gray-600 mb-5 leading-relaxed line-clamp-3">
                        {campaign.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 min-w-0">
                        <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#00a859] shrink-0" aria-hidden="true" />
                        <span className="truncate">{formatPeriod(campaign, formatDateBR)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[#00703c] font-bold text-sm shrink-0 transition-[gap] duration-300 group-hover:gap-2.5">
                        Ver mais
                        <FaArrowRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CampaignsGrid;
