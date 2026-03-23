'use client';

import React from 'react';
import { Video } from './types';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

const VideoPlayer = ({ video, onClose }: VideoPlayerProps) => {
  return (
    <section id="video-player" className="py-8 sm:py-12 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto animate-blur-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-[#003f7f]">
              {video.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2"
              aria-label="Fechar vídeo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-black">
            <iframe
              src={video.videoUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>

          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{video.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{video.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{video.views} visualizações</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#003f7f] text-white px-3 py-1 rounded-full text-xs font-bold">
                  {video.category}
                </span>
              </div>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;



