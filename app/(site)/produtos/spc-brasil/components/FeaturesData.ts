import { FaBell, FaHandshake, FaChartLine } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type { Accent } from '../../_components/ProductUI';

// type e mainBenefit alimentam o painel do hero e a tabela comparativa.
// Só descreve como cada serviço funciona: resultado (score, taxa, desconto) depende do SPC e de cada credor, não da CDL.

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
    mainBenefit: 'Aviso de consultas',
    description: 'Serviço do SPC Brasil que avisa quando o seu CPF ou CNPJ é consultado.',
    benefits: [
      'Aviso quando o seu CPF ou CNPJ é consultado',
      'Ajuda a identificar consultas ao seu CPF/CNPJ que você não reconhece',
      'Canais de aviso e condições definidos pelo SPC Brasil'
    ],
    howItWorks: [
      'Faça a adesão ao SPC AVISA pelo site do SPC Brasil',
      'Receba um aviso quando o seu CPF ou CNPJ for consultado',
      'Não reconheceu a consulta? Procure a empresa que consultou ou o SPC Brasil'
    ],
    useCases: [
      'Empresas que querem acompanhar consultas ao CNPJ',
      'Pessoas que querem acompanhar consultas ao CPF'
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
    description: 'Plataforma do SPC Brasil para negociar dívidas entre consumidores e empresas credoras.',
    benefits: [
      'Negociação online das dívidas registradas',
      'As condições de pagamento são definidas por cada empresa credora',
      'Depois do pagamento, a empresa credora deve pedir a baixa do registro em até 5 dias úteis (Súmula 548 do STJ)'
    ],
    howItWorks: [
      'Acesse o SPC CONCILIADOR pelo site do SPC Brasil',
      'Consulte as dívidas registradas no seu CPF ou CNPJ',
      'Veja as condições oferecidas por cada empresa credora',
      'Pague o acordo e guarde o comprovante'
    ],
    useCases: [
      'Consumidores que querem quitar dívidas registradas',
      'Empresas que querem receber valores em atraso',
      'Quem precisa regularizar o nome'
    ]
  },
  {
    id: 3,
    anchor: 'cadastro-positivo',
    title: 'CADASTRO POSITIVO',
    icon: FaChartLine,
    accent: 'yellow',
    type: 'Histórico Positivo',
    mainBenefit: 'Histórico de pagamentos',
    description: 'Banco de dados com o histórico de pagamentos de pessoas e empresas, usado na análise de crédito (Lei 12.414/2011).',
    benefits: [
      'Os pagamentos em dia passam a contar na análise de crédito',
      'Pode facilitar a análise de crédito',
      'Você pode consultar os seus dados e pedir a exclusão quando quiser'
    ],
    // Desde a LC 166/2019 a inclusão é automática (não há cadastro nem autorização prévia)
    howItWorks: [
      'A inclusão é automática desde a Lei Complementar 166/2019',
      'Consulte o seu histórico no site do SPC Brasil',
      'Se preferir, peça a exclusão quando quiser'
    ],
    useCases: [
      'Quem paga as contas em dia',
      'Quem está começando a construir histórico de crédito',
      'Empresas que querem mostrar o histórico de pagamentos ao pedir crédito'
    ]
  }
];
