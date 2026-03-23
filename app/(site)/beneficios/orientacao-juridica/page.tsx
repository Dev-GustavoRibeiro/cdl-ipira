'use client';

import React, { useState } from 'react';
import {
  Breadcrumb,
  HeroSection,
  ServicesSection,
  BenefitsSection,
  ContactForm,
  FAQSection,
  CTASection,
  services,
  faqs
} from './components';

export default function OrientacaoJuridicaPage() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFaqToggle = (id: number) => {
    setSelectedFaq(selectedFaq === id ? null : id);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    setFormStatus('idle');

    const formData = new FormData(e.currentTarget);
    const requestData = {
      nome: formData.get('nome'),
      empresa: formData.get('empresa'),
      contato: formData.get('contato'),
      email: formData.get('email'),
      assunto: formData.get('assunto'),
      descricao: formData.get('descricao'),
      dataSolicitacao: new Date().toISOString(),
    };

    try {
      console.log('Solicitação de orientação jurídica:', requestData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormStatus('success');
      e.currentTarget.reset();
      
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setFormStatus('error');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb />
      <HeroSection />
      <ServicesSection services={services} />
      <BenefitsSection />
      <ContactForm 
        isFormSubmitting={isFormSubmitting}
        formStatus={formStatus}
        onSubmit={handleFormSubmit}
      />
      <FAQSection 
        faqs={faqs}
        selectedFaq={selectedFaq}
        onFaqToggle={handleFaqToggle}
      />
      <CTASection />
    </>
  );
}
