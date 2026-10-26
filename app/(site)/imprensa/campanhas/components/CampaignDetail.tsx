'use client';

import React, { useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';
import { CAMPAIGN_STATUS_LABEL, getCampaignStatus } from '@/lib/campaigns';
import { isOptimizableImage } from '@/lib/images';
import { todayISO } from '@/lib/date';
import Breadcrumb from './Breadcrumb';
import CampaignActivities from './CampaignActivities';
import { Campaign, formatPeriod } from './types';

interface CampaignDetailProps {
  campaign: Campaign;
  /** Data (YYYY-MM-DD) usada ao gerar o HTML no servidor */
  serverToday: string;
}

const subscribeNoop = () => () => {};

// "Como participar: ..." -> rótulo em negrito. Curto, numa linha e seguido de espaço (não pega "https://")
const LABEL = /^([^:\n]{3,30}):(?=\s)/;

function Paragraph({ text }: { text: string }) {
  const label = LABEL.exec(text)?.[1];
  return (
    <p className="whitespace-pre-line">
      {label ? (
        <>
          <strong className="font-bold text-[#003f7f]">{label}:</strong>
          {text.slice(label.length + 1)}
        </>
      ) : (
        text
      )}
    </p>
  );
}

const CampaignDetail = ({ campaign, serverToday }: CampaignDetailProps) => {
  // O HTML fica em cache (revalidate) e o servidor roda em UTC:
  // hidrata com a data do servidor e, em seguida, recalcula o status com a data local do visitante
  const today = useSyncExternalStore(subscribeNoop, todayISO, () => serverToday);
  const status = CAMPAIGN_STATUS_LABEL[getCampaignStatus(campaign, today)];
  // Descrição em texto puro: parágrafos separados por linha em branco
  const paragraphs = (campaign.description || '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <Breadcrumb title={campaign.title} />

      {/* Hero com capa */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#003f7f] to-[#0066cc] text-white">
        {campaign.cover_image ? (
          <Image
            src={campaign.cover_image}
            alt=""
            fill
            priority
            unoptimized={!isOptimizableImage(campaign.cover_image)}
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <FaBullhorn className="absolute -right-8 -bottom-8 w-64 h-64 text-white/10" aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#003f7f] via-[#003f7f]/75 to-[#003f7f]/30"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 md:py-28">
          <div className="max-w-4xl animate-blur-fade-in">
            <span
              className={`${status.color} inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-lg mb-4 sm:mb-6`}
            >
              {status.text}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 leading-[1.05] drop-shadow-lg">
              {campaign.title}
            </h1>
            <div className="h-1.5 w-24 bg-linear-to-r from-[#ffd000] via-[#00d670] to-[#ffd000] rounded-full mb-5" aria-hidden="true"></div>
            <p className="flex items-center gap-2 text-white/90 text-sm sm:text-base font-semibold mb-4">
              <FaCalendarAlt className="w-4 h-4 text-[#ffd000] shrink-0" aria-hidden="true" />
              <span>{formatPeriod(campaign)}</span>
            </p>
            {campaign.summary && (
              <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed">
                {campaign.summary}
              </p>
            )}
          </div>
        </div>
      </section>

      {paragraphs.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5 text-gray-700 text-base sm:text-lg leading-relaxed">
              {paragraphs.map((paragraph, index) => (
                <Paragraph key={index} text={paragraph} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CampaignActivities campaignId={campaign.id} />

      <div className="py-8 sm:py-10 bg-white text-center px-4">
        <Link
          href="/imprensa/campanhas"
          className="inline-flex items-center justify-center gap-2 border-2 border-[#003f7f] text-[#003f7f] px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-[#003f7f] hover:text-white transition-all duration-300 group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Voltar para campanhas
        </Link>
      </div>
    </>
  );
};

export default CampaignDetail;
