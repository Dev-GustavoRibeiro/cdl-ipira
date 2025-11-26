'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaSpinner, FaSave, FaEyeSlash, FaUpload, FaImages, FaTimes, FaCloudUploadAlt, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Album {
  id: number;
  title: string;
  description?: string;
  category: string;
  date: string;
  location?: string;
  cover_url?: string;
  cover?: string; // Compatibilidade
  is_active?: boolean;
  photo_count?: number;
}

interface AlbumPhoto {
  id: number;
  album_id: number;
  url: string;
  title?: string;
  display_order: number;
}

const categorias = [
  'Eventos',
  'Networking',
  'Capacitação',
  'Institucional',
  'Comercial',
  'Política',
  'Outros'
];

export default function AdminGaleriaFotosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal de álbum
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState<Partial<Album>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal de fotos
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  // Upload states
  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [initialPhotos, setInitialPhotos] = useState<File[]>([]); // Fotos para novo álbum
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const initialPhotosInputRef = useRef<HTMLInputElement>(null);

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, id: number | null, title: string, type: 'album' | 'photo'}>({
    isOpen: false,
    id: null,
    title: '',
    type: 'album'
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [successDialog, setSuccessDialog] = useState<{isOpen: boolean, message: string, type: 'success' | 'edit' | 'delete'}>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const fetchAlbums = async () => {
    setIsLoading(true);
    try {
      // Buscar álbuns com contagem de fotos
      const { data: albumsData, error } = await supabase
        .from('albums')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar álbuns:', error);
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          toast.error('Tabela "albums" não existe. Execute o script SQL no Supabase.');
        }
        throw error;
      }

      // Buscar contagem de fotos para cada álbum
      const albumsWithCount = await Promise.all(
        (albumsData || []).map(async (album) => {
          const { count } = await supabase
            .from('album_photos')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);
          
          // Normalizar campos (cover pode ser cover_url ou cover)
          return { 
            ...album, 
            cover_url: album.cover_url || album.cover,
            is_active: album.is_active !== false,
            photo_count: count || 0 
          };
        })
      );

      setAlbums(albumsWithCount);
    } catch (error) {
      console.error('Erro ao carregar álbuns:', error);
      toast.error('Erro ao carregar álbuns');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlbumPhotos = async (albumId: number) => {
    setIsLoadingPhotos(true);
    try {
      const { data, error } = await supabase
        .from('album_photos')
        .select('*')
        .eq('album_id', albumId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setAlbumPhotos(data || []);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      toast.error('Erro ao carregar fotos');
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo: 20MB');
        return;
      }
      setSelectedCover(file);
    }
  };

  const handlePhotosSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} é muito grande. Máximo: 20MB`);
        return false;
      }
      return true;
    });
    setSelectedPhotos(prev => [...prev, ...validFiles]);
  };

  const handleInitialPhotosSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} é muito grande. Máximo: 20MB`);
        return false;
      }
      return true;
    });
    setInitialPhotos(prev => [...prev, ...validFiles]);
  };

  const removeInitialPhoto = (index: number) => {
    setInitialPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('gallery')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsUploading(true);

    try {
      let coverUrl = currentAlbum.cover_url;

      if (selectedCover) {
        coverUrl = await uploadImage(selectedCover, 'covers');
      }

      const albumData: Record<string, any> = {
        title: currentAlbum.title,
        description: currentAlbum.description || null,
        category: currentAlbum.category,
        date: currentAlbum.date,
        location: currentAlbum.location || null,
        is_active: currentAlbum.is_active !== false,
      };
      
      // Adicionar cover/cover_url dependendo da estrutura da tabela
      if (coverUrl) {
        albumData.cover_url = coverUrl;
        albumData.cover = coverUrl; // Para compatibilidade
      }

      let albumId = currentAlbum.id;
      
      if (isEditing && currentAlbum.id) {
        const { error } = await supabase
          .from('albums')
          .update(albumData)
          .eq('id', currentAlbum.id);
        if (error) {
          console.error('Erro Supabase (update):', error);
          throw new Error(error.message || error.details || 'Erro ao atualizar álbum');
        }
      } else {
        const { data, error } = await supabase
          .from('albums')
          .insert([albumData])
          .select()
          .single();
        if (error) {
          console.error('Erro Supabase (insert):', error);
          throw new Error(error.message || error.details || 'Erro ao criar álbum. Verifique se as tabelas foram criadas no Supabase.');
        }
        albumId = data.id;
      }

      // Upload das fotos iniciais (apenas para novo álbum)
      if (!isEditing && initialPhotos.length > 0 && albumId) {
        const totalPhotos = initialPhotos.length;
        let uploaded = 0;
        
        for (const file of initialPhotos) {
          const url = await uploadImage(file, `albums/${albumId}`);
          await supabase.from('album_photos').insert({
            album_id: albumId,
            url,
            title: file.name.replace(/\.[^/.]+$/, ''),
            display_order: uploaded
          });
          uploaded++;
          setUploadProgress(Math.round((uploaded / totalPhotos) * 100));
        }
      }

      const wasEditing = isEditing;
      const photosUploaded = initialPhotos.length;
      await fetchAlbums();
      closeAlbumModal();

      setSuccessDialog({
        isOpen: true,
        message: wasEditing
          ? 'O álbum foi atualizado com sucesso!'
          : photosUploaded > 0 
            ? `Álbum criado com ${photosUploaded} foto(s)!`
            : 'O novo álbum foi criado com sucesso!',
        type: wasEditing ? 'edit' : 'success'
      });
    } catch (error: any) {
      console.error('Erro ao salvar álbum:', error);
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error);
      toast.error(`Erro ao salvar álbum: ${errorMessage}`);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUploadPhotos = async () => {
    if (!selectedAlbum || selectedPhotos.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalPhotos = selectedPhotos.length;
      let uploaded = 0;

      for (const file of selectedPhotos) {
        const url = await uploadImage(file, `albums/${selectedAlbum.id}`);
        
        await supabase.from('album_photos').insert({
          album_id: selectedAlbum.id,
          url,
          title: file.name.replace(/\.[^/.]+$/, ''),
          display_order: albumPhotos.length + uploaded
        });

        uploaded++;
        setUploadProgress(Math.round((uploaded / totalPhotos) * 100));
      }

      toast.success(`${totalPhotos} foto(s) enviada(s) com sucesso!`);
      setSelectedPhotos([]);
      fetchAlbumPhotos(selectedAlbum.id);
      fetchAlbums();
    } catch (error) {
      console.error('Erro ao enviar fotos:', error);
      toast.error('Erro ao enviar fotos');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const openDeleteDialog = (id: number, title: string, type: 'album' | 'photo') => {
    setDeleteDialog({ isOpen: true, id, title, type });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;

    setIsDeleting(true);
    try {
      if (deleteDialog.type === 'album') {
        const { error } = await supabase.from('albums').delete().eq('id', deleteDialog.id);
        if (error) throw error;
        setAlbums(current => current.filter(a => a.id !== deleteDialog.id));
      } else {
        const { error } = await supabase.from('album_photos').delete().eq('id', deleteDialog.id);
        if (error) throw error;
        setAlbumPhotos(current => current.filter(p => p.id !== deleteDialog.id));
        fetchAlbums();
      }

      setDeleteDialog({ isOpen: false, id: null, title: '', type: 'album' });
      setSuccessDialog({
        isOpen: true,
        message: deleteDialog.type === 'album' 
          ? 'O álbum foi excluído permanentemente.'
          : 'A foto foi excluída permanentemente.',
        type: 'delete'
      });
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (album: Album) => {
    try {
      const { error } = await supabase
        .from('albums')
        .update({ is_active: !album.is_active })
        .eq('id', album.id);
      if (error) throw error;
      toast.success(album.is_active ? 'Álbum ocultado' : 'Álbum ativado');
      fetchAlbums();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const openAlbumModal = (album?: Album) => {
    if (album) {
      setCurrentAlbum(album);
      setIsEditing(true);
    } else {
      setCurrentAlbum({
        date: new Date().toISOString().split('T')[0],
        is_active: true,
        category: 'Eventos'
      });
      setIsEditing(false);
    }
    setSelectedCover(null);
    setIsModalOpen(true);
  };

  const closeAlbumModal = () => {
    setIsModalOpen(false);
    setCurrentAlbum({});
    setIsEditing(false);
    setSelectedCover(null);
    setInitialPhotos([]);
    setUploadProgress(0);
  };

  const openPhotosModal = async (album: Album) => {
    setSelectedAlbum(album);
    setIsPhotosModalOpen(true);
    await fetchAlbumPhotos(album.id);
  };

  const closePhotosModal = () => {
    setIsPhotosModalOpen(false);
    setSelectedAlbum(null);
    setAlbumPhotos([]);
    setSelectedPhotos([]);
  };

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = album.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || album.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#003f7f] mb-2">
            Galeria de Fotos
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie álbuns e fotos do site
          </p>
        </div>
        <button
          onClick={() => openAlbumModal()}
          className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] transition-all duration-300 shadow-lg"
        >
          <FaPlus />
          Novo Álbum
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total de Álbuns</div>
          <div className="text-2xl font-black text-gray-900">{albums.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-[#00a859] text-xs font-bold uppercase mb-1">Álbuns Ativos</div>
          <div className="text-2xl font-black text-gray-900">{albums.filter(a => a.is_active).length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent">
          <div className="text-[#003f7f] text-xs font-bold uppercase mb-1">Total de Fotos</div>
          <div className="text-2xl font-black text-gray-900">{albums.reduce((acc, a) => acc + (a.photo_count || 0), 0)}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar álbuns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent bg-white"
          >
            <option value="all">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de álbuns */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex items-center gap-3 text-[#003f7f]">
            <FaSpinner className="animate-spin w-6 h-6" />
            <span className="text-lg font-medium">Carregando álbuns...</span>
          </div>
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaImages className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum álbum encontrado</h3>
          <p className="text-gray-500">Clique em &quot;Novo Álbum&quot; para criar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${!album.is_active ? 'opacity-60' : ''}`}
            >
              {/* Capa */}
              <div className="relative h-48 bg-gradient-to-br from-[#003f7f] to-[#0052a3]">
                {album.cover_url ? (
                  <Image src={album.cover_url} alt={album.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaImages className="w-16 h-16 text-white/30" />
                  </div>
                )}
                {/* Badge de status e contagem */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${album.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {album.is_active ? 'Ativo' : 'Oculto'}
                  </span>
                  <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {album.photo_count || 0} fotos
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="inline-block bg-[#003f7f]/10 text-[#003f7f] px-2 py-0.5 rounded text-xs font-bold mb-2">
                  {album.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{album.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {new Date(album.date).toLocaleDateString('pt-BR')}
                  </div>
                  {album.location && (
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{album.location}</span>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPhotosModal(album)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-3 py-2 rounded-lg font-bold hover:bg-[#0066cc] transition-colors text-sm"
                  >
                    <FaImages className="w-3 h-3" />
                    Fotos
                  </button>
                  <button
                    onClick={() => handleToggleActive(album)}
                    className={`p-2 rounded-lg transition-colors ${album.is_active ? 'text-green-600 hover:bg-green-100' : 'text-gray-500 hover:bg-gray-100'}`}
                    title={album.is_active ? 'Ocultar' : 'Ativar'}
                  >
                    {album.is_active ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openAlbumModal(album)}
                    className="p-2 text-[#00a859] hover:bg-[#00a859] hover:text-white rounded-lg transition-colors"
                    title="Editar"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(album.id, album.title, 'album')}
                    className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Álbum */}
      <Modal isOpen={isModalOpen} onClose={closeAlbumModal} title={isEditing ? 'Editar Álbum' : 'Novo Álbum'}>
        <form onSubmit={handleSaveAlbum} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              required
              value={currentAlbum.title || ''}
              onChange={(e) => setCurrentAlbum({ ...currentAlbum, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              placeholder="Ex: Encontro de Lojistas 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
            <textarea
              value={currentAlbum.description || ''}
              onChange={(e) => setCurrentAlbum({ ...currentAlbum, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoria *</label>
              <select
                required
                value={currentAlbum.category || ''}
                onChange={(e) => setCurrentAlbum({ ...currentAlbum, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Data *</label>
              <input
                type="date"
                required
                value={currentAlbum.date ? currentAlbum.date.split('T')[0] : ''}
                onChange={(e) => setCurrentAlbum({ ...currentAlbum, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Local</label>
              <input
                type="text"
                value={currentAlbum.location || ''}
                onChange={(e) => setCurrentAlbum({ ...currentAlbum, location: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f7f]"
                placeholder="Ex: CDL Ipirá"
              />
            </div>
          </div>

          {/* Upload de Capa */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagem de Capa</label>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
            
            {!selectedCover && !currentAlbum.cover_url ? (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#003f7f] hover:bg-[#003f7f]/5 transition-all"
              >
                <FaCloudUploadAlt className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Clique para selecionar uma imagem</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-200">
                  {selectedCover ? (
                    <Image src={URL.createObjectURL(selectedCover)} alt="Preview" fill className="object-cover" />
                  ) : currentAlbum.cover_url ? (
                    <Image src={currentAlbum.cover_url} alt="Capa atual" fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{selectedCover ? selectedCover.name : 'Capa atual'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="text-sm text-[#003f7f] hover:underline"
                >
                  Trocar
                </button>
              </div>
            )}
          </div>

          {/* Upload de Fotos (apenas para novo álbum) */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Fotos do Álbum <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input 
                ref={initialPhotosInputRef} 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleInitialPhotosSelect} 
                className="hidden" 
              />
              
              <div
                onClick={() => initialPhotosInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-[#003f7f] hover:bg-[#003f7f]/5 transition-all"
              >
                <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Clique para selecionar fotos</p>
                <p className="text-gray-400 text-xs mt-1">Múltiplas fotos permitidas (máx. 20MB cada)</p>
              </div>

              {initialPhotos.length > 0 && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {initialPhotos.length} foto(s) selecionada(s)
                    </span>
                    <button
                      type="button"
                      onClick={() => setInitialPhotos([])}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Limpar todas
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[150px] overflow-y-auto">
                    {initialPhotos.map((file, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image 
                          src={URL.createObjectURL(file)} 
                          alt={file.name} 
                          fill 
                          className="object-cover" 
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeInitialPhoto(index); }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => initialPhotosInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#003f7f] hover:bg-[#003f7f]/5 transition-all"
                    >
                      <FaPlus className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="is_active"
              checked={currentAlbum.is_active !== false}
              onChange={(e) => setCurrentAlbum({ ...currentAlbum, is_active: e.target.checked })}
              className="w-5 h-5 text-[#00a859] border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Álbum visível no site</label>
          </div>

          {/* Barra de progresso */}
          {isSaving && initialPhotos.length > 0 && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Enviando fotos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#00a859] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0066cc] disabled:opacity-50"
            >
              {isSaving ? <><FaSpinner className="animate-spin" /> Salvando...</> : <><FaSave /> Salvar</>}
            </button>
            <button type="button" onClick={closeAlbumModal} disabled={isSaving} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Fotos do Álbum */}
      <Modal isOpen={isPhotosModalOpen} onClose={closePhotosModal} title={`Fotos: ${selectedAlbum?.title || ''}`}>
        <div className="space-y-5">
          {/* Upload de novas fotos */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Adicionar Fotos</label>
            <input ref={photosInputRef} type="file" accept="image/*" multiple onChange={handlePhotosSelect} className="hidden" />
            
            <div
              onClick={() => photosInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#003f7f] hover:bg-[#003f7f]/5 transition-all"
            >
              <FaCloudUploadAlt className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Clique para selecionar fotos (múltiplas)</p>
              <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP (máx. 20MB cada)</p>
            </div>

            {selectedPhotos.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{selectedPhotos.length} foto(s) selecionada(s)</span>
                  <button
                    onClick={() => setSelectedPhotos([])}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Limpar
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {selectedPhotos.slice(0, 8).map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image src={URL.createObjectURL(file)} alt={file.name} fill className="object-cover" />
                    </div>
                  ))}
                  {selectedPhotos.length > 8 && (
                    <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-bold">+{selectedPhotos.length - 8}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleUploadPhotos}
                  disabled={isUploading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00a859] text-white px-4 py-2.5 rounded-lg font-bold hover:bg-[#00d670] disabled:opacity-50"
                >
                  {isUploading ? (
                    <><FaSpinner className="animate-spin" /> Enviando... {uploadProgress}%</>
                  ) : (
                    <><FaUpload /> Enviar {selectedPhotos.length} foto(s)</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Fotos existentes */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">Fotos do Álbum ({albumPhotos.length})</h4>
            {isLoadingPhotos ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin w-6 h-6 text-[#003f7f]" />
              </div>
            ) : albumPhotos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma foto neste álbum ainda.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
                {albumPhotos.map((photo) => (
                  <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image src={photo.url} alt={photo.title || ''} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => openDeleteDialog(photo.id, photo.title || 'esta foto', 'photo')}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={closePhotosModal} className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50">
            Fechar
          </button>
        </div>
      </Modal>

      {/* Dialog de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, title: '', type: 'album' })}
        onConfirm={handleConfirmDelete}
        title={deleteDialog.type === 'album' ? 'Excluir Álbum' : 'Excluir Foto'}
        message={`Tem certeza que deseja excluir ${deleteDialog.title}? ${deleteDialog.type === 'album' ? 'Todas as fotos serão removidas.' : ''}`}
        type="delete"
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />

      {/* Dialog de Sucesso */}
      <ConfirmDialog
        isOpen={successDialog.isOpen}
        onClose={() => setSuccessDialog({ isOpen: false, message: '', type: 'success' })}
        title={successDialog.type === 'delete' ? 'Excluído' : successDialog.type === 'edit' ? 'Atualizado' : 'Cadastrado'}
        message={successDialog.message}
        type={successDialog.type === 'delete' ? 'success' : successDialog.type}
        confirmText="OK"
        showCancel={false}
        onConfirm={() => setSuccessDialog({ isOpen: false, message: '', type: 'success' })}
      />
    </div>
  );
}
