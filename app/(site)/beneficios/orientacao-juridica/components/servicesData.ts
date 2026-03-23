import React from 'react';
import { FaGavel, FaFileContract, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import { Service, FAQ } from './types';

export const services: Service[] = [
  {
    id: 1,
    title: 'Consultoria Jurídica',
    description: 'Orientações jurídicas personalizadas para questões trabalhistas, tributárias, contratuais e empresariais.',
    icon: React.createElement(FaGavel, { className: "w-6 h-6 sm:w-8 sm:h-8" }),
    color: 'from-[#003f7f] to-[#0066cc]'
  },
  {
    id: 2,
    title: 'Análise de Contratos',
    description: 'Revisão e análise de contratos comerciais, parcerias, fornecedores e acordos diversos.',
    icon: React.createElement(FaFileContract, { className: "w-6 h-6 sm:w-8 sm:h-8" }),
    color: 'from-[#00a859] to-[#00d670]'
  },
  {
    id: 3,
    title: 'Mediação e Conciliação',
    description: 'Serviços de mediação para resolução de conflitos comerciais de forma rápida e eficiente.',
    icon: React.createElement(FaHandshake, { className: "w-6 h-6 sm:w-8 sm:h-8" }),
    color: 'from-[#ffd000] to-[#ffed4e]'
  },
  {
    id: 4,
    title: 'Proteção Legal',
    description: 'Assessoria para proteção dos direitos do comerciante e orientações sobre legislação comercial.',
    icon: React.createElement(FaShieldAlt, { className: "w-6 h-6 sm:w-8 sm:h-8" }),
    color: 'from-[#003f7f] to-[#0066cc]'
  },
];

export const faqs: FAQ[] = [
  {
    id: 1,
    question: 'Quem pode utilizar o serviço de Orientação Jurídica?',
    answer: 'O serviço é exclusivo para associados da CDL Ipirá. Basta estar em dia com as mensalidades para ter acesso gratuito às orientações jurídicas.'
  },
  {
    id: 2,
    question: 'Quais tipos de questões podem ser orientadas?',
    answer: 'Oferecemos orientação em questões trabalhistas, tributárias, contratuais, comerciais, consumeristas e outras relacionadas ao comércio e negócios.'
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
    answer: 'Sim, oferecemos atendimento presencial, por telefone e online, conforme a disponibilidade e necessidade do associado.'
  },
];



