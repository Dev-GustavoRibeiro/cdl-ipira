'use client';

import React from 'react';
import Image from 'next/image';
import { FaYoutube, FaFacebook, FaInstagram, FaWhatsapp, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#003f7f] text-white">
      {/* Footer Principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Logos e Redes Sociais */}
        <div className="flex flex-col items-center mb-12 pb-8 border-b border-white/20">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg">
              <Image 
                src="/logo-cdl.png" 
                alt="CDL Ipirá" 
                width={220}
                height={88}
                className="h-22 w-auto object-contain"
              />
            </div>
            <div className="bg-white p-4 rounded-lg">
              <Image 
                src="/spc-brasil-logo.png" 
                alt="SPC Brasil" 
                width={220}
                height={88}
                className="h-22 w-auto object-contain"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="bg-white text-[#003f7f] p-3 rounded-lg hover:bg-[#ffd000] hover:text-[#003f7f] transition-all transform hover:scale-110">
              <FaYoutube size={24} />
            </a>
            <a href="#" className="bg-white text-[#003f7f] p-3 rounded-lg hover:bg-[#ffd000] hover:text-[#003f7f] transition-all transform hover:scale-110">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="bg-white text-[#003f7f] p-3 rounded-lg hover:bg-[#ffd000] hover:text-[#003f7f] transition-all transform hover:scale-110">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Menu de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Institucional */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b-2 border-[#ffd000] pb-2">
              Institucional
            </h3>
            <ul className="space-y-2.5">
              <li><a href="/institucional/historia" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> História
              </a></li>
              <li><a href="/institucional/diretoria" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Diretoria
              </a></li>
              <li><a href="/institucional/compromisso-cdl" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Compromisso CDL
              </a></li>
              <li><a href="/institucional/missao-visao-valores" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Missão e Valores
              </a></li>
            </ul>
          </div>

          {/* Produtos & Serviços */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b-2 border-[#ffd000] pb-2">
              Produtos
            </h3>
            <ul className="space-y-2.5">
              <li><a href="/produtos/spc-brasil" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> SPC Brasil
              </a></li>
              <li><a href="/produtos/cdl-midia" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> CDL Mídia
              </a></li>
              <li><a href="/produtos/certificado-digital" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Certificado Digital
              </a></li>
              <li><a href="/produtos/balcao-empregos" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Balcão de Empregos
              </a></li>
            </ul>
          </div>

          {/* Benefícios */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b-2 border-[#ffd000] pb-2">
              Benefícios
            </h3>
            <ul className="space-y-2.5">
              <li><a href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Filie-se Agora
              </a></li>
              <li><a href="/beneficios/empresas" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Empresas Associadas
              </a></li>
              <li><a href="/beneficios/orientacao-juridica" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Orientação Jurídica
              </a></li>
              <li><a href="/beneficios/projeto-conduz" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Projeto Conduz
              </a></li>
            </ul>
          </div>

          {/* Imprensa */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b-2 border-[#ffd000] pb-2">
              Imprensa
            </h3>
            <ul className="space-y-2.5">
              <li><a href="/imprensa/noticias" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Notícias
              </a></li>
              <li><a href="/imprensa/tv-lojista" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> TV Lojista
              </a></li>
              <li><a href="/imprensa/galeria-fotos" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Galeria de Fotos
              </a></li>
              <li><a href="/imprensa/eventos" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Eventos
              </a></li>
              <li><a href="/imprensa/revista-cdl" className="hover:text-[#ffd000] transition-colors flex items-center gap-2">
                <span className="text-[#ffd000]">→</span> Revista CDL
              </a></li>
            </ul>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6 text-center text-[#ffd000]">Entre em Contato</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all">
              <p className="font-bold mb-3 text-[#ffd000] text-sm uppercase">E-mail</p>
              <a href="mailto:cdlipira@ipiratech.com.br" className="hover:text-[#ffd000] transition-colors text-sm break-all">
                cdlipira@ipiratech.com.br
              </a>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all">
              <p className="font-bold mb-3 text-[#ffd000] text-sm uppercase">WhatsApp</p>
              <a href="https://wa.me/557532541599" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffd000] flex items-center gap-2 transition-colors">
                <FaWhatsapp size={18} /> (75) 3254-1599
              </a>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all">
              <p className="font-bold mb-3 text-[#ffd000] text-sm uppercase">Telefone</p>
              <a href="tel:557599914-5061" className="hover:text-[#ffd000] flex items-center gap-2 transition-colors">
                <FaPhone size={16} /> (75) 99914-5061
              </a>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all">
              <p className="font-bold mb-3 text-[#ffd000] text-sm uppercase">Endereço</p>
              <p className="text-sm leading-relaxed">Avenida Cesár Cabral, Nº 164 - Passarela Center, L02<br />Centro, 44600-000<br />Ipirá-BA</p>
            </div>
          </div>
          
          <div className="text-center border-t border-white/20 pt-6">
            <p className="text-sm mb-1"><span className="font-bold text-[#ffd000]">CNPJ:</span> 63.110.076/0001-90</p>
            <p className="text-sm"><span className="font-bold text-[#ffd000]">Razão Social:</span> CDL - CÂMARA DE DIRIGENTES LOJISTAS DE IPIRÁ</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#002855] py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 CDL Ipirá - Câmara de Dirigentes Lojistas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
