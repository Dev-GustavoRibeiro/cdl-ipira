'use client';

import React, { useState } from 'react';
import {
  HeroSection,
  ContactInfoSection,
  ContactForm,
  MapSection,
  InfoCardsSection
} from './components';

const ContatoPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Não foi possível enviar sua mensagem.');
      }

      setSubmitStatus('success');
      setSubmitMessage(result.message || 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <HeroSection />
      
      {/* Informações de Contato e Formulário */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactInfoSection />
            <ContactForm 
              formData={formData}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              submitMessage={submitMessage}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </section>

      <MapSection />
      <InfoCardsSection />
    </div>
  );
};

export default ContatoPage;
