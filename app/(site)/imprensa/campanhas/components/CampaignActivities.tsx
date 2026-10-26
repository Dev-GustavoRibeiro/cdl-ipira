'use client';

import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaCalendarAlt, FaImages, FaNewspaper } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { formatDateBR, isTodayOrFuture, todayISO } from '@/lib/date';
import EventModal from '@/app/components/EventModal';
import NewsModal from '@/app/components/NewsModal';
import { PhotoModal, Album, AlbumPhoto } from '../../galeria-fotos/components';
import type { Event } from '../../eventos/components';
import type { NewsItem } from '../../noticias/components';
import { StateBlock } from '../../noticias/components/LoadStates';
import ContentCard from './ContentCard';
import SectionTitle from './SectionTitle';
import UpcomingEventsSection from './UpcomingEventsSection';
import { isMissingSchema } from './types';

interface CampaignActivitiesProps {
  /** Sem campanha: tudo que está vinculado a alguma campanha (página geral) */
  campaignId?: number;
}

// Mesmo formato montado pela página de eventos; o status deriva da data (a coluna status não é mantida)
const toEvent = (item: Event): Event => ({
  ...item,
  date: formatDateBR(item.date) || item.date || '',
  gradient: item.gradient || 'from-[#003f7f] to-[#0066cc]',
  status: isTodayOrFuture(item.date) ? 'upcoming' : 'past',
  time: item.time || '',
  location: item.location || '',
  image: item.image || '',
});

// Página geral: quantos itens "O que já fizemos" mostra (a página de cada campanha mostra todos)
const DONE_LIMIT = 6;

const CampaignActivities = ({ campaignId }: CampaignActivitiesProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Modal de fotos (mesma lógica da galeria de fotos)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      let eventsQuery = supabase.from('events').select('*').eq('is_active', true);
      let newsQuery = supabase.from('news').select('*').eq('is_published', true);
      // Contagem de fotos embutida na mesma consulta (como na galeria de fotos)
      let albumsQuery = supabase.from('albums').select('*, album_photos(count)').eq('is_active', true);

      // Página geral: os próximos e, à parte, os realizados mais recentes ("O que já fizemos")
      let pastEventsQuery = null;

      if (campaignId) {
        eventsQuery = eventsQuery.eq('campaign_id', campaignId);
        newsQuery = newsQuery.eq('campaign_id', campaignId);
        albumsQuery = albumsQuery.eq('campaign_id', campaignId);
      } else {
        // Só conteúdo de campanhas ativas (o RLS de campaigns já esconde as desativadas)
        const { data: activeCampaigns } = await supabase.from('campaigns').select('id');
        const ids = (activeCampaigns || []).map((c) => c.id);
        const today = todayISO();
        eventsQuery = eventsQuery.in('campaign_id', ids).gte('date', today).limit(6);
        pastEventsQuery = supabase.from('events').select('*').eq('is_active', true).in('campaign_id', ids).lt('date', today).order('date', { ascending: false }).limit(DONE_LIMIT);
        newsQuery = newsQuery.in('campaign_id', ids).limit(6);
        albumsQuery = albumsQuery.in('campaign_id', ids).limit(DONE_LIMIT);
      }

      try {
        const [eventsResult, newsResult, albumsResult, pastEventsResult] = await Promise.all([
          eventsQuery.order('date', { ascending: true }),
          newsQuery.order('date', { ascending: false }),
          albumsQuery.order('date', { ascending: false }),
          pastEventsQuery,
        ]);

        // Seções com erro ficam vazias (e somem); coluna/tabela ausente não é erro
        for (const result of [eventsResult, newsResult, albumsResult, pastEventsResult]) {
          if (result?.error && !isMissingSchema(result.error)) console.error('Erro ao carregar conteúdo das campanhas:', result.error.message);
        }

        setEvents([...(eventsResult.data || []), ...(pastEventsResult?.data || [])].map(toEvent));
        setNews((newsResult.data || []).map((item: NewsItem) => ({ ...item, date: formatDateBR(item.date) || item.date || '' })));
        setAlbums((albumsResult.data || []).map(({ album_photos, ...album }) => ({
          ...album,
          cover_url: album.cover_url || album.cover,
          photo_count: album_photos?.[0]?.count ?? 0,
        })));
      } catch (error) {
        console.error('Erro ao carregar conteúdo das campanhas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [campaignId]);

  const openAlbum = async (album: Album) => {
    setSelectedAlbum(album);
    setSelectedPhotoIndex(0);
    setAlbumPhotos([]);
    setIsLoadingPhotos(true);
    try {
      const { data, error } = await supabase
        .from('album_photos')
        .select('*')
        .eq('album_id', album.id)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAlbumPhotos(data || []);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setAlbumPhotos([]);
    setSelectedPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (albumPhotos.length > 0) {
      setSelectedPhotoIndex((prev) => (prev === albumPhotos.length - 1 ? 0 : prev + 1));
    }
  };

  const prevPhoto = () => {
    if (albumPhotos.length > 0) {
      setSelectedPhotoIndex((prev) => (prev === 0 ? albumPhotos.length - 1 : prev - 1));
    }
  };

  if (isLoading) return null;

  const upcomingEvents = events.filter((event) => event.status === 'upcoming');
  // Eventos realizados e álbuns numa linha do tempo só, do mais recente ao mais antigo (empate: evento antes do álbum)
  const done = [
    ...events
      .filter((event) => event.status === 'past')
      .map((event) => ({ event, album: null, iso: event.date.split('/').reverse().join('-') })),
    ...albums.map((album) => ({ event: null, album, iso: album.date || '' })),
  ]
    .sort((a, b) => b.iso.localeCompare(a.iso))
    .slice(0, campaignId ? undefined : DONE_LIMIT);

  return (
    <>
      <UpcomingEventsSection events={upcomingEvents} onOpenModal={setSelectedEvent} />

      {news.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              title={campaignId ? 'Notícias' : 'Notícias das campanhas'}
              subtitle="Fique por dentro das novidades e resultados das nossas campanhas."
            />
            <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
              {news.map((item, index) => (
                <ContentCard
                  key={item.id}
                  index={index}
                  title={item.title}
                  date={item.date}
                  badge={item.category}
                  text={item.excerpt}
                  image={item.image}
                  gradient={item.color || undefined}
                  icon={FaNewspaper}
                  actionLabel="Leia mais"
                  onOpen={() => setSelectedNews(item)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              title="O que já fizemos"
              subtitle="Relembre as ações e os eventos que já movimentaram o comércio de Ipirá."
            />
            <div className="cards-grid gap-5 sm:gap-6 md:gap-8">
              {/* Selo com o tipo (não a categoria): evento e álbum da mesma ocasião não parecem duplicados */}
              {done.map(({ event, album }, index) =>
                event ? (
                  <ContentCard
                    key={`evento-${event.id}`}
                    index={index}
                    title={event.title}
                    date={event.date}
                    badge="Evento"
                    text={event.description}
                    image={event.image}
                    gradient={event.gradient}
                    icon={FaCalendarAlt}
                    actionLabel="Ver detalhes"
                    onOpen={() => setSelectedEvent(event)}
                  />
                ) : (
                  album && (
                    <ContentCard
                      key={`album-${album.id}`}
                      index={index}
                      title={album.title}
                      date={formatDateBR(album.date)}
                      badge="Álbum de fotos"
                      text={album.description}
                      image={album.cover_url}
                      icon={FaImages}
                      actionLabel={`Ver ${album.photo_count || 0} fotos`}
                      onOpen={() => openAlbum(album)}
                    />
                  )
                )
              )}
            </div>
          </div>
        </section>
      )}

      {campaignId && events.length === 0 && news.length === 0 && albums.length === 0 && (
        <section className="py-10 sm:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaBullhorn}
              title="Novidades em breve"
              description="Notícias, eventos e fotos desta campanha aparecerão aqui assim que forem publicados."
            />
          </div>
        </section>
      )}

      <EventModal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
      <NewsModal
        isOpen={selectedNews !== null}
        onClose={() => setSelectedNews(null)}
        news={selectedNews}
      />
      <PhotoModal
        isOpen={selectedAlbum !== null}
        album={selectedAlbum}
        photos={albumPhotos}
        selectedPhotoIndex={selectedPhotoIndex}
        isLoadingPhotos={isLoadingPhotos}
        onClose={closeAlbum}
        onPrevPhoto={prevPhoto}
        onNextPhoto={nextPhoto}
        onSelectPhoto={setSelectedPhotoIndex}
      />
    </>
  );
};

export default CampaignActivities;
