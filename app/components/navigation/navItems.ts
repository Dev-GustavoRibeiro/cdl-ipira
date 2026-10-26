import type { IconType } from 'react-icons';
import {
  FaBalanceScale,
  FaBook,
  FaBoxOpen,
  FaBriefcase,
  FaBroadcastTower,
  FaBuilding,
  FaBullhorn,
  FaBullseye,
  FaCalendarAlt,
  FaCertificate,
  FaEnvelope,
  FaEye,
  FaGift,
  FaHandshake,
  FaHistory,
  FaImages,
  FaNewspaper,
  FaRegNewspaper,
  FaShieldAlt,
  FaStoreAlt,
  FaUserCircle,
  FaUserPlus,
  FaUsers,
  FaVideo,
} from 'react-icons/fa';

/** Fonte única da navegação do site: Header (mega menu), menu lateral, barra inferior, busca e Footer leem daqui. */

export const ASSOCIE_URL = 'https://app.higestor.com.br/inscricao/empresa/cdl-ipira';
export const PORTAL_URL = 'https://app.higestor.com.br/portal/cdl-ipira';

// CEP num lugar só: o endereço visível e o JSON-LD da organização (lib/seo.ts) leem daqui
const CEP = '44600-000';

export const CONTACT = {
  phone: { label: '(75) 99914-5061', href: 'tel:+5575999145061' },
  whatsapp: { label: '(75) 3254-1599', href: 'https://wa.me/557532541599' },
  email: { label: 'cdlipira@ipiratech.com.br', href: 'mailto:cdlipira@ipiratech.com.br' },
  address: ['Av. Cesár Cabral, Nº 164 - Passarela Center, L02', `Centro, Ipirá-BA, ${CEP}`],
  cep: CEP,
  // Mesmo horário da página de contato (imprensa/contato/components/InfoCardsSection.tsx)
  hours: [
    { day: 'Segunda a Sexta', time: '08:00–18:00' },
    { day: 'Sábado', time: '08:00–12:00' },
    { day: 'Domingo', time: 'Fechado' },
  ],
  cnpj: '63.110.076/0001-90',
  razaoSocial: 'CDL - Câmara de Dirigentes Lojistas de Ipirá',
} as const;

export type NavItem = {
  label: string;
  href: string;
  description: string;
  icon: IconType;
  external?: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  description: string;
  icon: IconType;
  /** Cor de destaque dos ícones do grupo */
  accent: 'blue' | 'green';
  items: NavItem[];
  /** Card de destaque à direita do mega menu */
  featured: NavItem & { eyebrow: string; cta: string };
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'institucional',
    label: 'Institucional',
    description: 'Quem somos e como trabalhamos',
    icon: FaBuilding,
    accent: 'blue',
    items: [
      { label: 'História', href: '/institucional/historia', description: 'Nossa trajetória no comércio de Ipirá', icon: FaHistory },
      { label: 'Diretoria', href: '/institucional/diretoria', description: 'Quem lidera a CDL Ipirá', icon: FaUsers },
      { label: 'Missão, Visão e Valores', href: '/institucional/missao-visao-valores', description: 'O que nos move e nos orienta', icon: FaBullseye },
      { label: 'Compromisso CDL', href: '/institucional/compromisso-cdl', description: 'Nosso compromisso com o associado', icon: FaHandshake },
      { label: 'Portal da Transparência', href: '/institucional/portal-transparencia', description: 'Prestação de contas e documentos', icon: FaEye },
    ],
    featured: {
      eyebrow: 'Atendimento',
      label: 'Fale com a CDL Ipirá',
      description: 'Tire dúvidas sobre serviços, associação e eventos com a nossa equipe.',
      cta: 'Entrar em contato',
      href: '/imprensa/contato',
      icon: FaEnvelope,
    },
  },
  {
    id: 'imprensa',
    label: 'Imprensa',
    description: 'Notícias, campanhas e eventos',
    icon: FaNewspaper,
    accent: 'green',
    items: [
      { label: 'Notícias', href: '/imprensa/noticias', description: 'Novidades do comércio local', icon: FaRegNewspaper },
      { label: 'Campanhas', href: '/imprensa/campanhas', description: 'Promoções e ações do comércio', icon: FaBullhorn },
      { label: 'TV Lojista', href: '/imprensa/tv-lojista', description: 'Vídeos, dicas e entrevistas', icon: FaVideo },
      { label: 'Galeria de Fotos', href: '/imprensa/galeria-fotos', description: 'Registros dos nossos eventos', icon: FaImages },
      { label: 'Eventos', href: '/imprensa/eventos', description: 'Agenda de cursos e encontros', icon: FaCalendarAlt },
      { label: 'Revista CDL', href: '/imprensa/revista-cdl', description: 'Edições da nossa revista', icon: FaBook },
      { label: 'Contato', href: '/imprensa/contato', description: 'Fale com a nossa equipe', icon: FaEnvelope },
    ],
    featured: {
      eyebrow: 'Em destaque',
      label: 'Campanhas do comércio',
      description: 'Promoções e ações que movimentam as lojas de Ipirá.',
      cta: 'Ver campanhas',
      href: '/imprensa/campanhas',
      icon: FaBullhorn,
    },
  },
  {
    id: 'produtos',
    label: 'Produtos',
    description: 'Soluções para o seu negócio',
    icon: FaBoxOpen,
    accent: 'blue',
    items: [
      { label: 'SPC Brasil', href: '/produtos/spc-brasil', description: 'Consultas e proteção ao crédito', icon: FaShieldAlt },
      { label: 'Certificado Digital', href: '/produtos/certificado-digital', description: 'e-CPF e e-CNPJ com agilidade', icon: FaCertificate },
      { label: 'CDL Mídia', href: '/produtos/cdl-midia', description: 'Divulgue sua marca em nossos canais', icon: FaBroadcastTower },
      { label: 'Balcão de Empregos', href: '/produtos/balcao-empregos', description: 'Vagas e cadastro de currículos', icon: FaBriefcase },
    ],
    featured: {
      eyebrow: 'Proteção ao crédito',
      label: 'Venda com mais segurança',
      description: 'Consulte CPF e CNPJ no SPC Brasil antes de vender a prazo.',
      cta: 'Conhecer o SPC',
      href: '/produtos/spc-brasil',
      icon: FaShieldAlt,
    },
  },
  {
    id: 'beneficios',
    label: 'Benefícios',
    description: 'Vantagens de ser associado',
    icon: FaGift,
    accent: 'green',
    items: [
      { label: 'Orientação Jurídica', href: '/beneficios/orientacao-juridica', description: 'Apoio jurídico para associados', icon: FaBalanceScale },
      { label: 'Empresas Associadas', href: '/beneficios/empresas', description: 'Conheça quem faz parte da CDL', icon: FaStoreAlt },
      { label: 'Filie-se', href: ASSOCIE_URL, description: 'Associe sua empresa à CDL', icon: FaUserPlus, external: true },
      { label: 'Portal do Associado', href: PORTAL_URL, description: 'Área exclusiva do associado', icon: FaUserCircle, external: true },
    ],
    featured: {
      eyebrow: 'Seja um associado',
      label: 'Faça parte da CDL Ipirá',
      description: 'SPC, orientação jurídica, capacitações e muito mais para a sua empresa.',
      cta: 'Associe-se',
      href: ASSOCIE_URL,
      icon: FaUserPlus,
      external: true,
    },
  },
];

/** Rota atual pertence ao link (inclui páginas de detalhe, ex.: /imprensa/noticias/123). */
export const isActivePath = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

/** Cores dos ícones por grupo (classes completas para o Tailwind encontrar). */
export const ACCENT_TILE: Record<NavGroup['accent'], string> = {
  blue: 'bg-[#003f7f]/[0.07] text-[#003f7f] ring-[#003f7f]/10 group-hover:bg-[#003f7f] group-hover:text-white group-focus-visible:bg-[#003f7f] group-focus-visible:text-white',
  green: 'bg-[#00a859]/10 text-[#00a859] ring-[#00a859]/15 group-hover:bg-[#00a859] group-hover:text-white group-focus-visible:bg-[#00a859] group-focus-visible:text-white',
};
