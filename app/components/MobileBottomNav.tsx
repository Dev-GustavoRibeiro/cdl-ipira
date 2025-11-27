'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaNewspaper, 
  FaBars, 
  FaTimes, 
  FaUserPlus,
  FaShieldAlt, 
  FaEnvelope,
  FaHistory, 
  FaUsers, 
  FaBullseye, 
  FaVideo, 
  FaImages, 
  FaCalendarAlt, 
  FaMobileAlt, 
  FaCertificate, 
  FaBolt, 
  FaHeartbeat, 
  FaTooth, 
  FaCreditCard, 
  FaStore, 
  FaBroadcastTower, 
  FaBriefcase, 
  FaGraduationCap, 
  FaHandshake, 
  FaBalanceScale, 
  FaStoreAlt, 
  FaInfoCircle, 
  FaMusic,
  FaChevronRight
} from 'react-icons/fa';

const MobileBottomNav = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('institucional');
  const prevPathname = useRef(pathname);

  // Bloquear scroll quando menu estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Fechar menu ao mudar de rota - usando queueMicrotask para evitar cascading renders
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      if (isMenuOpen) {
        queueMicrotask(() => setIsMenuOpen(false));
      }
    }
  }, [pathname, isMenuOpen]);

  const isActive = (path: string) => pathname === path;

  const categories = [
    { id: 'institucional', label: 'Institucional' },
    { id: 'produtos', label: 'Produtos' },
    { id: 'beneficios', label: 'Benefícios' },
    { id: 'imprensa', label: 'Imprensa' },
  ];

  const allItems = [
    // Destaques/Rápidos
    { href: '/produtos/spc-brasil', label: 'SPC Brasil', icon: FaShieldAlt, category: 'produtos', highlight: true },
    { href: '/imprensa/noticias', label: 'Notícias', icon: FaNewspaper, category: 'imprensa', highlight: true },
    { href: '/imprensa/contato', label: 'Contato', icon: FaEnvelope, category: 'imprensa', highlight: true },
    { href: '/beneficios/cartao-convenio', label: 'Cartão', icon: FaCreditCard, category: 'beneficios', highlight: true },

    // Institucional
    { href: '/institucional/historia', label: 'História', icon: FaHistory, category: 'institucional' },
    { href: '/institucional/diretoria', label: 'Diretoria', icon: FaUsers, category: 'institucional' },
    { href: '/institucional/missao-visao-valores', label: 'Missão/Visão', icon: FaBullseye, category: 'institucional' },

    // Produtos
    { href: '/produtos/cdl-celular', label: 'CDL Celular', icon: FaMobileAlt, category: 'produtos' },
    { href: '/produtos/certificado-digital', label: 'Certificado', icon: FaCertificate, category: 'produtos' },
    { href: '/produtos/cdl-energia', label: 'Energia', icon: FaBolt, category: 'produtos' },
    { href: '/produtos/cdl-saude', label: 'Saúde', icon: FaHeartbeat, category: 'produtos' },
    { href: '/produtos/cdl-odonto', label: 'Odonto', icon: FaTooth, category: 'produtos' },
    { href: '/produtos/cartao-credito-cdl', label: 'Crédito', icon: FaCreditCard, category: 'produtos' },
    { href: '/produtos/espaco-cdl', label: 'Espaço CDL', icon: FaStore, category: 'produtos' },
    { href: '/produtos/cdl-midia', label: 'Mídia', icon: FaBroadcastTower, category: 'produtos' },
    { href: '/produtos/balcao-empregos', label: 'Empregos', icon: FaBriefcase, category: 'produtos' },
    { href: '/produtos/cursos-palestras', label: 'Cursos', icon: FaGraduationCap, category: 'produtos' },

    // Benefícios
    { href: '/beneficios/projeto-conduz', label: 'Conduz', icon: FaMusic, category: 'beneficios' },
    { href: '/beneficios/orientacao-juridica', label: 'Jurídico', icon: FaBalanceScale, category: 'beneficios' },
    { href: '/beneficios/convenios', label: 'Convênios', icon: FaHandshake, category: 'beneficios' },
    { href: '/beneficios/empresas', label: 'Empresas', icon: FaStoreAlt, category: 'beneficios' },
    { href: '/beneficios/nucleo-informacoes', label: 'Informações', icon: FaInfoCircle, category: 'beneficios' },

    // Imprensa
    { href: '/imprensa/tv-lojista', label: 'TV Lojista', icon: FaVideo, category: 'imprensa' },
    { href: '/imprensa/galeria-fotos', label: 'Fotos', icon: FaImages, category: 'imprensa' },
    { href: '/imprensa/eventos', label: 'Eventos', icon: FaCalendarAlt, category: 'imprensa' },
  ];

  const filteredItems = allItems.filter(item => item.category === activeCategory);

  return (
    <>
      {/* Overlay Escuro */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-60 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsMenuOpen(false)} 
      />

      {/* Bottom Sheet (Menu Principal) */}
      <div 
        className={`fixed inset-x-0 bottom-0 bg-gray-50 rounded-t-4xl z-70 md:hidden flex flex-col max-h-[85vh] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 cubic-bezier(0.32, 0.72, 0, 1) ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Puxador (Handle) */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsMenuOpen(false)}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header do Menu */}
        <div className="px-6 py-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-[#003f7f]">Menu</h2>
            <p className="text-xs text-gray-500">Explore nossos serviços</p>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Categorias (Scroll Horizontal) */}
        <div className="px-6 pb-2 flex gap-3 overflow-x-auto scrollbar-hide shrink-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#003f7f] text-white shadow-lg shadow-blue-900/30'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Ícones */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="grid grid-cols-4 gap-4 gap-y-6">
            {filteredItems.map((item, idx) => (
              <Link 
                key={idx}
                href={item.href}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform active:scale-90 group-hover:scale-105 ${
                  item.highlight 
                    ? 'bg-linear-to-br from-[#003f7f] to-[#0066cc] text-white shadow-blue-900/20' 
                    : 'bg-white text-[#003f7f] border border-gray-100'
                }`}>
                  <item.icon />
                </div>
                <span className="text-[10px] font-medium text-center text-gray-600 leading-tight line-clamp-2 w-full">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Banner Filie-se */}
          <a 
            href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-8 flex items-center justify-between p-4 rounded-2xl bg-linear-to-r from-[#ffd000] to-[#ffed4e] text-[#003f7f] shadow-lg shadow-yellow-500/20 mb-safe"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/30 rounded-xl backdrop-blur-sm">
                <FaUserPlus className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Filie-se</span>
                <span className="text-xs font-medium opacity-80">Seja um associado CDL</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
              <FaChevronRight className="w-4 h-4" />
            </div>
          </a>
          
          <div className="h-24"></div> {/* Espaço extra para footer */}
        </div>
      </div>

      {/* Barra de Navegação Inferior (App-like) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center px-2 py-2">
          <NavButton 
            href="/" 
            icon={FaHome} 
            label="Início" 
            isActive={isActive('/')} 
          />
          
          <NavButton 
            href="/imprensa/noticias" 
            icon={FaNewspaper} 
            label="Notícias" 
            isActive={pathname.includes('/imprensa/noticias')} 
          />

          {/* Botão Central de Menu (Floating Action Button Style) */}
          <div className="relative -top-5">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-white transition-transform duration-300 active:scale-95 ${
                isMenuOpen 
                  ? 'bg-gray-800 rotate-90' 
                  : 'bg-[#003f7f] hover:bg-[#003366]'
              }`}
            >
              {isMenuOpen ? <FaTimes className="w-7 h-7" /> : <FaBars className="w-7 h-7" />}
            </button>
          </div>

          <NavButton 
            href="/produtos/spc-brasil" 
            icon={FaShieldAlt} 
            label="SPC" 
            isActive={pathname.includes('/produtos/spc-brasil')} 
          />

          <NavButton 
            href="/imprensa/contato" 
            icon={FaEnvelope} 
            label="Contato" 
            isActive={pathname.includes('/imprensa/contato')} 
          />
        </div>
      </div>
    </>
  );
};

const NavButton = ({ href, icon: Icon, label, isActive }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; isActive: boolean }) => (
  <Link 
    href={href} 
    className={`flex flex-col items-center gap-1 p-2 rounded-xl w-16 transition-colors ${
      isActive 
        ? 'text-[#003f7f]' 
        : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : 'stroke-current'}`} />
    <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
  </Link>
);

export default MobileBottomNav;
