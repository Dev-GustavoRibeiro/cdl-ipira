'use client';

import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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

    // Simulação de envio (substitua pela sua API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="inline-block bg-[#ffd000] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
              📞 Entre em Contato
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-2xl">
              Fale Conosco
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Estamos prontos para ajudar você. Entre em contato e tire suas dúvidas!
            </p>
          </div>
        </div>
      </section>

      {/* Informações de Contato e Formulário */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-black text-[#003f7f] mb-6">Informações de Contato</h2>
                <p className="text-gray-600 mb-8">
                  Estamos à disposição para atendê-lo. Escolha a forma de contato que preferir.
                </p>
              </div>

              {/* Cards de Contato */}
              <div className="space-y-6">
                {/* Telefone */}
                <a
                  href="tel:5575999145061"
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 border-2 border-transparent hover:border-[#003f7f]"
                >
                  <div className="bg-[#003f7f] text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FaPhone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#003f7f] transition-colors">
                      Telefone
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">Ligue para nós</p>
                    <p className="text-xl font-semibold text-[#003f7f]">(75) 99914-5061</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/557532541599"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 border-2 border-transparent hover:border-[#00a859]"
                >
                  <div className="bg-[#00a859] text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#00a859] transition-colors">
                      WhatsApp
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">Fale conosco pelo WhatsApp</p>
                    <p className="text-xl font-semibold text-[#00a859]">(75) 3254-1599</p>
                  </div>
                </a>

                {/* E-mail */}
                <a
                  href="mailto:cdlipira@ipiratech.com.br"
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 border-2 border-transparent hover:border-[#ffd000]"
                >
                  <div className="bg-[#ffd000] text-[#003f7f] p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FaEnvelope className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#003f7f] transition-colors">
                      E-mail
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">Envie-nos um e-mail</p>
                    <p className="text-lg font-semibold text-[#003f7f] break-all">cdlipira@ipiratech.com.br</p>
                  </div>
                </a>

                {/* Endereço */}
                <div className="bg-white rounded-2xl p-6 shadow-lg flex items-start gap-4 border-2 border-gray-200">
                  <div className="bg-gray-100 text-[#003f7f] p-4 rounded-xl">
                    <FaMapMarkerAlt className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Endereço</h3>
                    <p className="text-gray-600 text-sm mb-2">Venha nos visitar</p>
                    <p className="text-gray-800 leading-relaxed">
                      Avenida Cesár Cabral, Nº 164 - Passarela Center, L02<br />
                      Centro, 44600-000<br />
                      Ipirá-BA
                    </p>
                  </div>
                </div>

                {/* Horário de Atendimento */}
                <div className="bg-white rounded-2xl p-6 shadow-lg flex items-start gap-4 border-2 border-gray-200">
                  <div className="bg-gray-100 text-[#003f7f] p-4 rounded-xl">
                    <FaClock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Horário de Atendimento</h3>
                    <div className="space-y-2 text-gray-800">
                      <div className="flex justify-between">
                        <span className="font-semibold">Segunda a Sexta:</span>
                        <span>08:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Sábado:</span>
                        <span>08:00 - 12:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Domingo:</span>
                        <span className="text-gray-500">Fechado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-[#003f7f] mb-3">Envie sua Mensagem</h2>
                <p className="text-gray-600">
                  Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                {/* E-mail */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors"
                    placeholder="(75) 99999-9999"
                  />
                </div>

                {/* Assunto */}
                <div>
                  <label htmlFor="assunto" className="block text-sm font-semibold text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <select
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="associacao">Associação</option>
                    <option value="spc">Consulta SPC</option>
                    <option value="certificado">Certificado Digital</option>
                    <option value="eventos">Eventos</option>
                    <option value="duvidas">Dúvidas Gerais</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#003f7f] focus:outline-none transition-colors resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </div>

                {/* Status de Envio */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <FaCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-green-800 font-semibold">
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <FaTimesCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-red-800 font-semibold">
                      Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.
                    </p>
                  </div>
                )}

                {/* Botão de Envio */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#003f7f] text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-[#0066cc] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-5 h-5" />
                      <span>Enviar Mensagem</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#003f7f] mb-4">Nossa Localização</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Venha nos visitar! Estamos localizados no centro de Ipirá, na Passarela Center.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.7698049399102!2d-39.73938862155856!3d-12.158816444321067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x714db85e6de07eb%3A0xec56058059003bed!2sCDL%20-%20C%C3%A2mara%20de%20Dirigentes%20Lojistas%20de%20Ipir%C3%A1!5e0!3m2!1spt-BR!2sbr!4v1764212197479!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Localização CDL Ipirá"
              />
            </div>
            <div className="p-6 bg-white">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="w-6 h-6 text-[#003f7f]" />
                <div>
                  <p className="font-bold text-gray-900">CDL Ipirá</p>
                  <p className="text-gray-600 text-sm">
                    Avenida Cesár Cabral, Nº 164 - Passarela Center, L02, Centro, Ipirá-BA, 44600-000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informações Adicionais */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-[#003f7f] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Atendimento Rápido</h3>
              <p className="text-gray-600">
                Nossa equipe está pronta para atender você de segunda a sábado.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-[#00a859] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaWhatsapp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600">
                Fale conosco pelo WhatsApp e receba respostas rápidas e diretas.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-[#ffd000] text-[#003f7f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">E-mail</h3>
              <p className="text-gray-600">
                Envie sua mensagem por e-mail e responderemos em até 24 horas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContatoPage;



