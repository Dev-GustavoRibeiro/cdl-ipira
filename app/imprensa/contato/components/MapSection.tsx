import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MapSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-[#003f7f] mb-4">Nossa Localização</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Venha nos visitar! Estamos localizados no centro de Ipirá, na Passarela Center.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="aspect-video bg-gray-200 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.7698049399102!2d-39.73938862155856!3d-12.158816444321067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x714db85e6de07eb%3A0xec56058059003bed!2sCDL%20-%20C%C3%A2mara%20de%20Dirigentes%20Lojistas%20de%20Ipir%C3%A1!5e0!3m2!1spt-BR!2sbr!4v1764212197479!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Localização CDL Ipirá"
            />
          </div>
          <div className="p-6 bg-white">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="w-6 h-6 text-[#003f7f]" />
              <div>
                <p className="font-bold text-gray-900">CDL Ipirá</p>
                <p className="text-gray-600 text-sm">
                  Avenida Cesár Cabral, Nº 164 - Passarela Center, L02, Centro, Ipirá-BA, 44600-000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;



