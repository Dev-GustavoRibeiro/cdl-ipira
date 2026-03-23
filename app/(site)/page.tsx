import HeroCarousel from '@/app/components/HeroCarousel';
import ServicesCards from '@/app/components/ServicesCards';
import PartnersCarousel from '@/app/components/PartnersCarousel';
import NewsCarousel from '@/app/components/NewsCarousel';
import EventsCarousel from '@/app/components/EventsCarousel';
import TVLojista from '@/app/components/TVLojista';
import GaleriaFotos from '@/app/components/GaleriaFotos';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <ServicesCards />
      <PartnersCarousel />
      <NewsCarousel />
      <EventsCarousel />
      <TVLojista />
      <GaleriaFotos />
    </>
  );
}
