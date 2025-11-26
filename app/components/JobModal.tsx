'use client';

import React, { useState } from 'react';
import { FaTimes, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import { createPortal } from 'react-dom';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    company: string;
    quantity: number;
    description: string;
    location?: string;
    date?: string;
    category?: string;
  } | null;
}

export default function JobModal({ isOpen, onClose, job }: JobModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !job) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative z-10 flex flex-col animate-scale-in">
        {/* Header com Gradiente */}
        <div className="relative bg-linear-to-br from-[#003f7f] to-[#0066cc] p-6 sm:p-8 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-full transition-all"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="mt-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-4">
              <FaBriefcase className="w-4 h-4 text-[#ffd000]" />
              <span>{job.category || 'Vaga de Emprego'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-2">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-white/90 text-lg font-medium">
              <FaBuilding className="w-5 h-5" />
              {job.company}
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 sm:p-8 flex flex-col grow">
          {/* Grid de Informações */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                <FaMapMarkerAlt className="text-[#00a859]" />
                Localização
              </div>
              <div className="text-gray-900 font-semibold">
                {job.location || 'Não informado'}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                <FaCalendarAlt className="text-[#ffd000]" />
                Publicado em
              </div>
              <div className="text-gray-900 font-semibold">
                {job.date || 'Recente'}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                <FaCheckCircle className="text-[#003f7f]" />
                Vagas
              </div>
              <div className="text-gray-900 font-semibold">
                {job.quantity} {job.quantity === 1 ? 'vaga disponível' : 'vagas disponíveis'}
              </div>
            </div>
          </div>

          <div className="prose prose-lg text-gray-600 text-justify mb-8">
            <h3 className="text-[#003f7f] font-bold text-xl mb-4">Descrição da Vaga</h3>
            <div className="whitespace-pre-wrap leading-relaxed">
              {job.description}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              Interessado? Entre em contato diretamente com a empresa ou envie seu currículo para a CDL.
            </p>
            <a 
              href={`https://wa.me/557532541356?text=${encodeURIComponent(`Olá, gostaria de me candidatar à vaga de *${job.title}* na empresa *${job.company}*.`)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#00a859] text-white px-6 py-3 rounded-full font-bold hover:bg-[#008f4c] transition-all shadow-lg hover:scale-105 whitespace-nowrap"
            >
              Candidatar-se via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

