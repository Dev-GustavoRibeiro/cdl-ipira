'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, []);

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
