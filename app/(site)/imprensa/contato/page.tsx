'use client';

import React, { use, useState } from 'react';
import {
  HeroSection,
  ContactInfoSection,
  ContactForm,
  MapSection,
  InfoCardsSection
} from './components';
import { formGuardFields } from '@/lib/form-guard';

const ContatoPage = ({ searchParams }: { searchParams: Promise<{ assunto?: string | string[] }> }) => {
  const { assunto } = use(searchParams);
  // O link "Exercer meus direitos" (política e rodapé) abre o formulário com o assunto já escolhido
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: assunto === 'privacidade' ? 'privacidade' : '',
    mensagem: ''
  });
  // Já na página de contato, o link do rodapé só troca a URL (o estado continua): escolhe o assunto também nesse caso
  const [linkedSubject, setLinkedSubject] = useState(assunto);
  if (assunto !== linkedSubject) {
    setLinkedSubject(assunto);
    if (assunto === 'privacidade') setFormData((data) => ({ ...data, assunto: 'privacidade' }));
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // e.currentTarget vira null depois do await, então guardamos o form antes
    const form = e.currentTarget;
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Campos anti-robô (armadilha e tempo de preenchimento) que a API exige
        body: JSON.stringify({ ...formData, ...formGuardFields(form) }),
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
    <>
      <HeroSection />
      <ContactInfoSection />

      {/* Formulário e horário de atendimento */}
      <section
        id="formulario"
        aria-label="Formulário de contato"
        className="scroll-mt-[calc(var(--header-height,0px)+1rem)] py-16 md:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
            <ContactForm
              formData={formData}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              submitMessage={submitMessage}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onReset={() => {
                setSubmitStatus(null);
                setSubmitMessage(null);
              }}
            />
            <InfoCardsSection />
          </div>
        </div>
      </section>

      <MapSection />
    </>
  );
};

export default ContatoPage;
