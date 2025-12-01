import HeroCarousel from './components/HeroCarousel';
import ServicesCards from './components/ServicesCards';
import PartnersCarousel from './components/PartnersCarousel';
import NewsCarousel from './components/NewsCarousel';
import EventsCarousel from './components/EventsCarousel';
import TVLojista from './components/TVLojista';
import GaleriaFotos from './components/GaleriaFotos';

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
