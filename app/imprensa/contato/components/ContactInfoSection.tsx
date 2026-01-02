import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock } from 'react-icons/fa';

const ContactInfoSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-[#003f7f] mb-6">Informações de Contato</h2>
        <p className="text-gray-600 mb-8">
          Estamos à disposição para atendê-lo. Escolha a forma de contato que preferir.
        </p>
      </div>

      {/* Cards de Contato */}
      <div className="space-y-6">
        {/* Telefone */}
        <a
          href="tel:5575999145061"
          className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 border-2 border-transparent hover:border-[#003f7f]"
        >
          <div className="bg-[#003f7f] text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
            <FaPhone className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#003f7f] transition-colors">
              Telefone
            </h3>
            <p className="text-gray-600 text-sm mb-1">Ligue para nós</p>
            <p className="text-xl font-semibold text-[#003f7f]">(75) 99914-5061</p>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/557532541599"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 border-2 border-transparent hover:border-[#00a859]"
        >
          <div className="bg-[#00a859] text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
            <FaWhatsapp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#00a859] transition-colors">
              WhatsApp
            </h3>
            <p className="text-gray-600 text-sm mb-1">Fale conosco pelo WhatsApp</p>
            <p className="text-xl font-semibold text-[#00a859]">(75) 3254-1599</p>
          </div>
        </a>

        {/* E-mail */}
        <a
          href="mailto:cdlipira@ipiratech.com.br"
          className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 border-2 border-transparent hover:border-[#ffd000]"
        >
          <div className="bg-[#ffd000] text-[#003f7f] p-4 rounded-xl group-hover:scale-110 transition-transform">
            <FaEnvelope className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#003f7f] transition-colors">
              E-mail
            </h3>
            <p className="text-gray-600 text-sm mb-1">Envie-nos um e-mail</p>
            <p className="text-lg font-semibold text-[#003f7f] break-all">cdlipira@ipiratech.com.br</p>
          </div>
        </a>

        {/* Endereço */}
        <div className="bg-white rounded-2xl p-6 shadow-lg flex items-start gap-4 border-2 border-gray-200">
          <div className="bg-gray-100 text-[#003f7f] p-4 rounded-xl">
            <FaMapMarkerAlt className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Endereço</h3>
            <p className="text-gray-600 text-sm mb-2">Venha nos visitar</p>
            <p className="text-gray-800 leading-relaxed">
              Avenida Cesár Cabral, Nº 164 - Passarela Center, L02<br />
              Centro, 44600-000<br />
              Ipirá-BA
            </p>
          </div>
        </div>

        {/* Horário de Atendimento */}
        <div className="bg-white rounded-2xl p-6 shadow-lg flex items-start gap-4 border-2 border-gray-200">
          <div className="bg-gray-100 text-[#003f7f] p-4 rounded-xl">
            <FaClock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Horário de Atendimento</h3>
            <div className="space-y-2 text-gray-800">
              <div className="flex justify-between">
                <span className="font-semibold">Segunda a Sexta:</span>
                <span>08:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sábado:</span>
                <span>08:00 - 12:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Domingo:</span>
                <span className="text-gray-500">Fechado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;



