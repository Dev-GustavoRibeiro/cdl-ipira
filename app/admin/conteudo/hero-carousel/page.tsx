'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaImage, FaSave } from 'react-icons/fa';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  gradient: string;
  accentColor: string;
  image: string;
  pattern: string;
  order: number;
}

const initialSlides: Slide[] = [
  {
    id: 1,
    title: 'Projeto Conduz',
    subtitle: 'Construindo um futuro melhor!',
    description: 'Aulas gratuitas de Violão, Cajon, Ukulele, Capoeira, Yoga, Judô e Palestras Educacionais para crianças e adolescentes a partir de 8 anos.',
    buttonText: 'Saiba Mais',
    buttonLink: '/projeto-conduz',
    gradient: 'from-[#003f7f] via-[#0052a3] to-[#0066cc]',
    accentColor: 'bg-[#ffd000]',
    image: '/projeto-conduz.jpg',
    pattern: 'music',
    order: 1
  },
  {
    id: 2,
    title: 'Seja um Associado',
    subtitle: 'Faça parte da maior rede de empresários',
    description: 'Tenha acesso a consultas SPC ilimitadas, assessoria jurídica, certificado digital e muito mais! Invista no crescimento do seu negócio.',
    buttonText: 'Associe-se Agora',
    buttonLink: '/seja-associado',
    gradient: 'from-[#00a859] via-[#00c46a] to-[#00d670]',
    accentColor: 'bg-[#ffd000]',
    image: '/associados.jpg',
    pattern: 'business',
    order: 2
  },
  {
    id: 3,
    title: 'Consulta SPC Brasil',
    subtitle: 'Proteção e segurança para seu negócio',
    description: 'Consulte CPF e CNPJ de forma rápida e segura. Tome decisões de crédito com confiança e proteja sua empresa.',
    buttonText: 'Consultar Agora',
    buttonLink: '/consulta-spc',
    gradient: 'from-[#ffd000] via-[#ffda33] to-[#ffed4e]',
    accentColor: 'bg-[#003f7f]',
    image: '/spc-consulta.jpg',
    pattern: 'security',
    order: 3
  }
];

export default function AdminHeroCarouselPage() {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Slide | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setFormData({ ...slide });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      id: Math.max(...slides.map(s => s.id)) + 1,
      title: '',
      subtitle: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      gradient: 'from-[#003f7f] via-[#0052a3] to-[#0066cc]',
      accentColor: 'bg-[#ffd000]',
      image: '',
      pattern: 'music',
      order: slides.length + 1
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);

    // Simulação de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isAdding) {
      setSlides([...slides, formData].sort((a, b) => a.order - b.order));
    } else {
      setSlides(slides.map(s => s.id === formData.id ? formData : s).sort((a, b) => a.order - b.order));
    }

    setIsSaving(false);
    setEditingId(null);
    setIsAdding(false);
    setFormData(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este slide?')) {
      setSlides(slides.filter(s => s.id !== id));
    }
  };

  const handleChange = (field: keyof Slide, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
              Hero Carousel
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Gerencie os slides do carrossel principal
            </p>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Slide
        </button>
      </div>

      {/* Formulário de Edição/Adição */}
      {(editingId !== null || isAdding) && formData && (
        <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8 border-2 border-[#003f7f]">
          <h2 className="text-xl font-black text-[#003f7f] mb-6">
            {isAdding ? 'Adicionar Novo Slide' : 'Editar Slide'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="Título do slide"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="Subtítulo"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ordem</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Descrição *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] resize-none"
                placeholder="Descrição do slide"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Texto do Botão *</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="Ex: Saiba Mais"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Link do Botão *</label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="/pagina ou https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gradiente</label>
              <select
                value={formData.gradient}
                onChange={(e) => handleChange('gradient', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              >
                <option value="from-[#003f7f] via-[#0052a3] to-[#0066cc]">Azul</option>
                <option value="from-[#00a859] via-[#00c46a] to-[#00d670]">Verde</option>
                <option value="from-[#ffd000] via-[#ffda33] to-[#ffed4e]">Amarelo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cor do Botão</label>
              <select
                value={formData.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              >
                <option value="bg-[#ffd000]">Amarelo</option>
                <option value="bg-[#003f7f]">Azul</option>
                <option value="bg-[#00a859]">Verde</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">URL da Imagem</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                  placeholder="/imagem.jpg ou https://..."
                />
                <button
                  type="button"
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaImage className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 disabled:opacity-50"
            >
              <FaSave />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setIsAdding(false);
                setFormData(null);
              }}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Slides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`h-32 bg-linear-to-r ${slide.gradient} p-6 flex items-center justify-between`}>
              <div className="text-white">
                <h3 className="text-xl font-black mb-1">{slide.title}</h3>
                <p className="text-sm opacity-90">{slide.subtitle}</p>
              </div>
              <span className="text-white/80 text-xs font-bold">#{slide.order}</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{slide.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Botão: {slide.buttonText}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded truncate">Link: {slide.buttonLink}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#00a859] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#00d670] transition-colors text-sm"
                >
                  <FaEdit />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




