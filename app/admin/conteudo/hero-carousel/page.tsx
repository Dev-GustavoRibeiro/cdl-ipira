'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaImage, FaSave, FaSpinner } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Modal from '@/components/Modal';

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
  imagePosition: string;
  imageFit: string;
  pattern: string;
  order: number;
}

export default function AdminHeroCarouselPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Slide>({
    id: 0,
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    gradient: '',
    accentColor: '',
    image: '',
    imagePosition: 'center',
    imageFit: 'cover',
    pattern: 'music',
    order: 1
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      if (data) {
        const mappedSlides = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          buttonText: item.button_text,
          buttonLink: item.button_link,
          gradient: item.gradient,
          accentColor: item.accent_color,
          image: item.image,
          imagePosition: item.image_position || 'center',
          imageFit: item.image_fit || 'cover',
          pattern: item.pattern,
          order: item.order_index
        }));
        setSlides(mappedSlides);
      }
    } catch (error) {
      console.error('Erro ao carregar slides:', error);
      toast.error('Erro ao carregar slides');
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setFormData({ ...slide });
    setIsAdding(false);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      id: 0,
      title: '',
      subtitle: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      gradient: '',
      accentColor: '',
      image: '',
      imagePosition: 'center',
      imageFit: 'cover',
      pattern: 'music',
      order: slides.length + 1
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);

    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        gradient: formData.gradient,
        accentColor: formData.accentColor,
        image: formData.image,
        imagePosition: formData.imagePosition,
        imageFit: formData.imageFit,
        pattern: formData.pattern,
        order: formData.order
      };

      const method = isAdding ? 'POST' : 'PUT';
      const body = isAdding ? payload : { id: editingId, ...payload };

      const response = await fetch('/api/hero', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Erro ao salvar');

      toast.success(isAdding ? 'Slide criado!' : 'Slide atualizado!');
      fetchSlides();
      setIsModalOpen(false);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Erro ao salvar slide:', error);
      toast.error('Erro ao salvar slide');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este slide?')) return;

    try {
      const response = await fetch(`/api/hero?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir');
      
      toast.success('Slide excluído!');
      fetchSlides();
    } catch (error) {
      console.error('Erro ao excluir slide:', error);
      toast.error('Erro ao excluir slide');
    }
  };

  const handleChange = (field: keyof Slide, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'heroes');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }

      const data = await response.json();
      handleChange('image', data.url);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao enviar imagem:', error);
      toast.error(`Erro ao enviar imagem: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isAdding ? 'Adicionar Novo Slide' : 'Editar Slide'}
      >
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
                <option value="">Nenhum (transparente)</option>
                <optgroup label="Cores CDL">
                  <option value="from-[#003f7f] via-[#0052a3] to-[#0066cc]">Azul CDL</option>
                  <option value="from-[#00a859] via-[#00c46a] to-[#00d670]">Verde CDL</option>
                  <option value="from-[#ffd000] via-[#ffda33] to-[#ffed4e]">Amarelo CDL</option>
                </optgroup>
                <optgroup label="Tons de Azul">
                  <option value="from-blue-600 via-blue-700 to-blue-800">Azul Escuro</option>
                  <option value="from-blue-400 via-blue-500 to-blue-600">Azul Médio</option>
                  <option value="from-sky-400 via-sky-500 to-sky-600">Azul Céu</option>
                  <option value="from-cyan-400 via-cyan-500 to-cyan-600">Ciano</option>
                  <option value="from-indigo-500 via-indigo-600 to-indigo-700">Índigo</option>
                </optgroup>
                <optgroup label="Tons de Verde">
                  <option value="from-green-500 via-green-600 to-green-700">Verde</option>
                  <option value="from-emerald-400 via-emerald-500 to-emerald-600">Esmeralda</option>
                  <option value="from-teal-400 via-teal-500 to-teal-600">Teal</option>
                </optgroup>
                <optgroup label="Tons Quentes">
                  <option value="from-orange-400 via-orange-500 to-orange-600">Laranja</option>
                  <option value="from-amber-400 via-amber-500 to-amber-600">Âmbar</option>
                  <option value="from-red-500 via-red-600 to-red-700">Vermelho</option>
                  <option value="from-rose-400 via-rose-500 to-rose-600">Rosa</option>
                  <option value="from-pink-400 via-pink-500 to-pink-600">Pink</option>
                </optgroup>
                <optgroup label="Tons Neutros">
                  <option value="from-gray-600 via-gray-700 to-gray-800">Cinza Escuro</option>
                  <option value="from-slate-600 via-slate-700 to-slate-800">Ardósia</option>
                  <option value="from-zinc-600 via-zinc-700 to-zinc-800">Zinco</option>
                </optgroup>
                <optgroup label="Multicoloridos">
                  <option value="from-purple-500 via-pink-500 to-red-500">Roxo → Rosa → Vermelho</option>
                  <option value="from-blue-500 via-purple-500 to-pink-500">Azul → Roxo → Rosa</option>
                  <option value="from-green-400 via-cyan-500 to-blue-500">Verde → Ciano → Azul</option>
                  <option value="from-yellow-400 via-orange-500 to-red-500">Amarelo → Laranja → Vermelho</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cor do Botão</label>
              <select
                value={formData.accentColor}
                onChange={(e) => handleChange('accentColor', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              >
                <option value="">Nenhum (transparente)</option>
                <optgroup label="Cores CDL">
                  <option value="bg-[#ffd000]">Amarelo CDL</option>
                  <option value="bg-[#003f7f]">Azul CDL</option>
                  <option value="bg-[#00a859]">Verde CDL</option>
                </optgroup>
                <optgroup label="Cores Sólidas">
                  <option value="bg-blue-600">Azul</option>
                  <option value="bg-sky-500">Azul Céu</option>
                  <option value="bg-cyan-500">Ciano</option>
                  <option value="bg-indigo-600">Índigo</option>
                  <option value="bg-purple-600">Roxo</option>
                  <option value="bg-pink-500">Pink</option>
                  <option value="bg-rose-500">Rosa</option>
                  <option value="bg-red-600">Vermelho</option>
                  <option value="bg-orange-500">Laranja</option>
                  <option value="bg-amber-500">Âmbar</option>
                  <option value="bg-yellow-500">Amarelo</option>
                  <option value="bg-lime-500">Lima</option>
                  <option value="bg-green-600">Verde</option>
                  <option value="bg-emerald-500">Esmeralda</option>
                  <option value="bg-teal-500">Teal</option>
                  <option value="bg-gray-700">Cinza Escuro</option>
                  <option value="bg-slate-700">Ardósia</option>
                  <option value="bg-white">Branco</option>
                  <option value="bg-black">Preto</option>
                </optgroup>
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
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  title="Fazer upload de imagem"
                >
                  {isUploading ? <FaSpinner className="animate-spin w-5 h-5" /> : <FaImage className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Posição da Imagem</label>
              <select
                value={formData.imagePosition}
                onChange={(e) => handleChange('imagePosition', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              >
                <optgroup label="Centro">
                  <option value="center">Centro</option>
                </optgroup>
                <optgroup label="Cima / Baixo">
                  <option value="top">Topo</option>
                  <option value="bottom">Base</option>
                </optgroup>
                <optgroup label="Esquerda / Direita">
                  <option value="left">Esquerda</option>
                  <option value="right">Direita</option>
                </optgroup>
                <optgroup label="Cantos">
                  <option value="left top">Canto Superior Esquerdo</option>
                  <option value="right top">Canto Superior Direito</option>
                  <option value="left bottom">Canto Inferior Esquerdo</option>
                  <option value="right bottom">Canto Inferior Direito</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ajuste da Imagem</label>
              <select
                value={formData.imageFit}
                onChange={(e) => handleChange('imageFit', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              >
                <option value="cover">Preencher (corta se necessário)</option>
                <option value="contain">Conter (mostra tudo, pode ter bordas)</option>
                <option value="fill">Esticar (distorce para preencher)</option>
                <option value="none">Original (tamanho real)</option>
              </select>
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
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          </div>
      </Modal>

      {/* Lista de Slides */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <FaSpinner className="animate-spin text-[#003f7f] text-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`h-32 p-6 flex items-center justify-between ${slide.gradient ? `bg-linear-to-r ${slide.gradient}` : 'bg-gray-500'}`}>
                <div className={slide.gradient ? 'text-white' : 'text-white'}>
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
      )}
    </div>
  );
}
