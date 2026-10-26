'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FaExclamationTriangle } from 'react-icons/fa';
import { StateBlock } from '@/app/(site)/imprensa/noticias/components/LoadStates';
import { btnPrimary } from '../_components/ui';
import {
  Breadcrumb,
  HeaderSection,
  LoadingState,
  PresidenteSection,
  VicePresidenteSection,
  DiretoresSection,
  SuplentesSection,
  ColaboradoresSection,
  InfoSection,
  TeamMember
} from './components';

export default function DiretoriaPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Recarrega quando reloadKey muda (botão "Tentar novamente")
  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error('Erro ao carregar equipe:', error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const presidente = members.find(m => m.role === 'presidente');
  const vicePresidentes = members.filter(m => m.role === 'vice_presidente');
  const diretores = members.filter(m => m.role === 'diretor');
  const suplentes = members.filter(m => m.role === 'suplente');
  const colaboradores = members.filter(m => m.role === 'colaborador');

  return (
    <>
      <Breadcrumb />
      <HeaderSection />

      {isLoading ? (
        <LoadingState />
      ) : loadError ? (
        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StateBlock
              icon={FaExclamationTriangle}
              title="Não foi possível carregar a equipe"
              description="Verifique sua conexão e tente novamente."
            >
              <button type="button" onClick={handleRetry} className={btnPrimary}>
                Tentar novamente
              </button>
            </StateBlock>
          </div>
        </section>
      ) : (
        <>
          {presidente && <PresidenteSection presidente={presidente} />}
          <VicePresidenteSection vicePresidentes={vicePresidentes} />
          <DiretoresSection diretores={diretores} />
          <SuplentesSection suplentes={suplentes} />
          <ColaboradoresSection colaboradores={colaboradores} />
        </>
      )}

      <InfoSection />
    </>
  );
}
