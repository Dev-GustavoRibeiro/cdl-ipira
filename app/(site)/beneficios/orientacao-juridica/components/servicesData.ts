import React from 'react';
import { FaGavel, FaFileContract } from 'react-icons/fa';
import { Service, FAQ } from './types';

// "Mediação e Conciliação" e "Proteção Legal" saíram: só voltam se a CDL confirmar que oferece esses serviços
export const services: Service[] = [
  {
    id: 1,
    title: 'Dúvidas do Dia a Dia',
    description: 'Orientação sobre dúvidas jurídicas ligadas à rotina da sua empresa.',
    icon: React.createElement(FaGavel, { className: "w-6 h-6 sm:w-7 sm:h-7", "aria-hidden": true }),
    color: 'from-[#003f7f] to-[#0066cc] text-white'
  },
  {
    id: 2,
    title: 'Dúvidas sobre Contratos',
    description: 'Orientação para entender contratos com clientes, fornecedores e parceiros antes de assinar.',
    icon: React.createElement(FaFileContract, { className: "w-6 h-6 sm:w-7 sm:h-7", "aria-hidden": true }),
    color: 'from-[#00a859] to-[#00d670] text-white'
  },
];

export const faqs: FAQ[] = [
  {
    id: 1,
    question: 'Quem pode utilizar o serviço de Orientação Jurídica?',
    answer: 'O serviço é oferecido aos associados da CDL Ipirá. Basta estar em dia com as mensalidades para ter acesso gratuito às orientações jurídicas.'
  },
  {
    id: 2,
    question: 'Quais tipos de questões podem ser orientadas?',
    answer: 'Dúvidas jurídicas ligadas à atividade da sua empresa. Ao agendar, a equipe da CDL confirma se o assunto é atendido pelo benefício.'
  },
  {
    id: 3,
    question: 'Como agendar uma consulta?',
    answer: 'Você pode agendar através do formulário abaixo, por telefone ou pessoalmente na sede da CDL Ipirá. Nossa equipe entrará em contato para confirmar o horário.'
  },
  {
    id: 4,
    question: 'O serviço é gratuito?',
    answer: 'Sim, a orientação jurídica é um benefício gratuito para todos os associados da CDL Ipirá em dia com suas obrigações.'
  },
  {
    id: 5,
    question: 'Posso receber orientação por telefone ou online?',
    answer: 'A forma de atendimento é combinada com a equipe da CDL no agendamento, conforme a disponibilidade.'
  },
];



