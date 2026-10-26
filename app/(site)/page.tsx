import HeroCarousel from '@/app/components/HeroCarousel';
import ServicesCards from '@/app/components/ServicesCards';
import PartnersCarousel from '@/app/components/PartnersCarousel';
import NewsCarousel from '@/app/components/NewsCarousel';
import EventsCarousel from '@/app/components/EventsCarousel';
import TVLojista from '@/app/components/TVLojista';
import GaleriaFotos from '@/app/components/GaleriaFotos';
import JsonLd from '@/app/components/seo/JsonLd';
import { fetchActiveHeroSlides } from '@/lib/hero';
import { organizationJsonLd, pageMetadata, SITE_DESCRIPTION, websiteJsonLd } from '@/lib/seo';

// Os slides do hero vêm no HTML (a foto do 1º slide começa a baixar junto com a página); o painel revalida ao salvar
export const revalidate = 300;

export const metadata = pageMetadata({ description: SITE_DESCRIPTION, path: '/' });

// Seções em blocos de cor com borda reta (branco, névoa, azul da TV); a vida vem das entradas do conteúdo
export default async function Home() {
  // Falhou no servidor: o carrossel busca no navegador
  const heroSlides = await fetchActiveHeroSlides().catch(() => null);
  return (
    <>
      <HeroCarousel rows={heroSlides} />
      <ServicesCards />
      <PartnersCarousel />
      <NewsCarousel />
      <EventsCarousel />
      <TVLojista />
      <GaleriaFotos />
      {/* Quem é a CDL (endereço, contatos, logo) e a busca do site, para o painel de informações do Google */}
      <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
    </>
  );
}
