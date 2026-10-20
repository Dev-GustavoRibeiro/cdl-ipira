'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';
import { CAMPAIGN_STATUS_LABEL, getCampaignStatus } from '@/lib/campaigns';
import { isOptimizableImage } from '@/lib/images';
import SectionTitle from './SectionTitle';
import { Campaign, formatPeriod } from './types';

interface FeaturedCampaignProps {
  campaign: Campaign;
}

const FeaturedCampaign = ({ campaign }: FeaturedCampaignProps) => {
  const status = CAMPAIGN_STATUS_LABEL[getCampaignStatus(campaign)];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Campanha em destaque" />

        <article className="group grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100 shadow-[0_24px_60px_-28px_rgba(0,63,127,0.45)] max-w-6xl mx-auto animate-scale-in">
          {/* Capa */}
          <div className="relative h-64 sm:h-80 lg:h-full lg:min-h-96 bg-linear-to-br from-[#003f7f] to-[#0066cc] overflow-hidden">
            {campaign.cover_image ? (
              <Image
                src={campaign.cover_image}
                alt={campaign.title}
                fill
                priority
                unoptimized={!isOptimizableImage(campaign.cover_image)}
                className="object-cover group-hover:scale-105 transition-transform duration-700 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FaBullhorn className="w-20 h-20 sm:w-24 sm:h-24 text-white/30" aria-hidden="true" />
              </div>
            )}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
              <span className={`${status.color} px-3 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-lg`}>
                {status.text}
              </span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-semibold mb-3">
              <FaCalendarAlt className="w-4 h-4 text-[#00a859] shrink-0" aria-hidden="true" />
              <span>{formatPeriod(campaign)}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.015em] text-[#003f7f] mb-4 leading-tight">
              {campaign.title}
            </h3>
            {campaign.summary && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                {campaign.summary}
              </p>
            )}
            <Link
              href={`/imprensa/campanhas/${campaign.slug}`}
              className="self-start inline-flex items-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-[0_12px_28px_-12px_rgba(0,63,127,0.7)] hover:-translate-y-0.5 active:scale-[0.98] transition-transform duration-200 group/btn"
            >
              Ver campanha
              <FaArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
};

export default FeaturedCampaign;
