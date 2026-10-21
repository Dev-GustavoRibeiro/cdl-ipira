'use client';

import React from 'react';
import { Mark, QuoteBlock } from '../../_components/ui';

const QuoteSection = () => {
  return (
    <QuoteBlock cite="Diretoria CDL Ipirá">
      &ldquo;Construímos diariamente uma entidade forte, comprometida com o <Mark>sucesso de cada associado</Mark> e com o{' '}
      <Mark>desenvolvimento</Mark> de toda nossa comunidade.&rdquo;
    </QuoteBlock>
  );
};

export default QuoteSection;
