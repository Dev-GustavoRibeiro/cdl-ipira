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
    // e.currentTarget vira null depois do await, então guardamos o form antes
    const form = e.currentTarget;
    setIsFormSubmitting(true);
    setFormStatus('idle');

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/juridico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.get('nome'),
          empresa: formData.get('empresa'),
          telefone: formData.get('telefone'),
          email: formData.get('email'),
          assunto: formData.get('assunto'),
          descricao: formData.get('descricao'),
        }),
      });

      if (!response.ok) throw new Error('Falha ao enviar solicitação');

      setFormStatus('success');
      form.reset();

      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    } catch {
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
