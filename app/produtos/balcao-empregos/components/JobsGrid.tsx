'use client';

import React from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

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

interface JobsGridProps {
  jobs: Job[];
  isLoading: boolean;
  onJobClick: (job: Job) => void;
}

const JobsGrid = ({ jobs, isLoading, onJobClick }: JobsGridProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg sm:text-xl">Carregando vagas...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
        <FaBriefcase className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg sm:text-xl">Nenhuma vaga encontrada com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {jobs.map((job, index) => (
        <article
          key={job.id}
          className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#003f7f] hover:shadow-lg transition-all duration-300 animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1">
              <h3 
                onClick={() => onJobClick(job)}
                className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 cursor-pointer hover:underline"
              >
                {job.title}
              </h3>
              {job.company && (
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  {job.company}
                </p>
              )}
            </div>
            <div className="bg-[#003f7f] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base ml-3 sm:ml-4 shrink-0">
              {job.quantity.toString().padStart(2, '0')}
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-5 leading-relaxed text-justify line-clamp-3">
            {job.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
            {job.location && (
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#00a859]" />
                <span>{job.location}</span>
              </div>
            )}
            {job.date && (
              <div className="flex items-center gap-1.5">
                <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffd000]" />
                <span>{job.date}</span>
              </div>
            )}
            {job.category && (
              <div className="flex items-center gap-1.5">
                <FaBriefcase className="w-3 h-3 sm:w-4 sm:h-4 text-[#003f7f]" />
                <span>{job.category}</span>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-200">
            <button 
              onClick={() => onJobClick(job)}
              className="text-[#00a859] font-bold hover:text-[#0066cc] transition-colors text-sm sm:text-base inline-flex items-center gap-2 group"
            >
              Ver detalhes
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default JobsGrid;



