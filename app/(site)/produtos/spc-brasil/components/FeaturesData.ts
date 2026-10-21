import { FaBell, FaHandshake, FaChartLine } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { Accent } from '../../_components/ProductUI';

// type e mainBenefit alimentam o painel do hero e a tabela comparativa

export const features: {
  id: number;
  anchor: string;
  title: string;
  icon: IconType;
  accent: Accent;
  type: string;
  mainBenefit: string;
  description: string;
  benefits: string[];
  howItWorks: string[];
  useCases: string[];
}[] = [
  {
    id: 1,
    anchor: 'spc-avisa',
    title: 'SPC AVISA',
    icon: FaBell,
    accent: 'blue',
    type: 'Monitoramento',
    mainBenefit: 'Proteção',
    description: 'Sistema de alertas que notifica sobre consultas e movimentações de CPF/CNPJ em tempo real.',
    benefits: [
      'Alertas em tempo real sobre consultas ao seu CPF/CNPJ',
      'Monitoramento 24/7 de movimentações financeiras',
      'Proteção contra fraudes e uso indevido de dados',
      'Notificações por e-mail e SMS',
      'Histórico completo de consultas realizadas'
    ],
    howItWorks: [
      'Cadastre-se no SPC AVISA gratuitamente',
      'Receba alertas instantâneos quando seu CPF/CNPJ for consultado',
      'Acompanhe todas as movimentações em um painel exclusivo',
      'Tome decisões rápidas com informações em tempo real'
    ],
    useCases: [
      'Empresários que querem monitorar consultas ao CNPJ',
      'Pessoas físicas preocupadas com segurança de dados',
      'Empresas que precisam rastrear consultas de clientes',
      'Profissionais que desejam proteger sua reputação creditícia'
    ]
  },
  {
    id: 2,
    anchor: 'spc-conciliador',
    title: 'SPC CONCILIADOR',
    icon: FaHandshake,
    accent: 'green',
    type: 'Negociação',
    mainBenefit: 'Regularização',
    description: 'Plataforma que facilita a negociação e conciliação de dívidas entre empresas e consumidores.',
    benefits: [
      'Negocie dívidas de forma rápida e segura',
      'Descontos especiais para quitação antecipada',
      'Parcelamento facilitado sem burocracia',
      'Ambiente seguro e confiável para negociações',
      'Histórico de negociações disponível online'
    ],
    howItWorks: [
      'Acesse o portal SPC CONCILIADOR',
      'Consulte suas dívidas registradas',
      'Negocie condições especiais diretamente online',
      'Efetue o pagamento e regularize sua situação'
    ],
    useCases: [
      'Consumidores que desejam quitar dívidas antigas',
      'Empresas que querem recuperar créditos',
      'Pessoas que buscam descontos na negociação',
      'Quem precisa regularizar o nome para obter crédito'
    ]
  },
  {
    id: 3,
    anchor: 'cadastro-positivo',
    title: 'CADASTRO POSITIVO',
    icon: FaChartLine,
    accent: 'yellow',
    type: 'Histórico Positivo',
    mainBenefit: 'Score de Crédito',
    description: 'Sistema que registra seu histórico positivo de pagamentos, melhorando seu score de crédito.',
    benefits: [
      'Aumente seu score de crédito com histórico positivo',
      'Facilite a aprovação de crédito e financiamentos',
      'Tenha acesso a melhores condições e taxas',
      'Construa uma reputação creditícia sólida',
      'Seus pagamentos em dia são registrados automaticamente'
    ],
    howItWorks: [
      'Cadastre-se no Cadastro Positivo',
      'Autorize o compartilhamento de seus dados positivos',
      'Seus pagamentos em dia são registrados automaticamente',
      'Acompanhe a evolução do seu score de crédito'
    ],
    useCases: [
      'Pessoas que pagam em dia e querem melhorar o score',
      'Jovens que estão construindo histórico creditício',
      'Empresas que buscam melhorar relacionamento com bancos',
      'Quem deseja ter acesso a crédito com melhores condições'
    ]
  }
];
