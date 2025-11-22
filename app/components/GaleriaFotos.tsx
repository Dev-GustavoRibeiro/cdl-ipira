'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Gallery {
  id: number;
  title: string;
  image: string;
  photos: number;
}

const GaleriaFotos = () => {
  const [galleries, setGalleries] = React.useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/albums?limit=3').then(res => res.json()).then(setGalleries)
    const fetchGalleries = async () => {
      try {
        // const response = await fetch('/api/albums?limit=3');
        // const data = await response.json();
        // setGalleries(data);
        setGalleries([]); // Array vazio até implementar a API
      } catch (error) {
        console.error('Erro ao carregar galerias:', error);
        setGalleries([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  // Renderiza a estrutura mesmo sem galerias
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-[#003f7f] mb-12">Galeria de Fotos</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando galerias...</p>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-8">Nenhuma galeria disponível no momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {galleries.map((gallery) => (
              <article 
                key={gallery.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative h-48 group">
                  <Image 
                    src={gallery.image} 
                    alt={gallery.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {gallery.photos} fotos
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 hover:text-[#003f7f] transition-colors">
                    {gallery.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link 
            href="/galeria-fotos"
            className="inline-block bg-white border-2 border-[#003f7f] text-[#003f7f] px-8 py-3 rounded-full font-semibold hover:bg-[#003f7f] hover:text-white transition-all"
          >
            Veja mais fotos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GaleriaFotos;

