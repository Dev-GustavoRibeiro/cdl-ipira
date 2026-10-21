'use client';

import React from 'react';
import { Mark, QuoteBlock } from '../../_components/ui';

const QuoteSection = () => {
  return (
    <QuoteBlock cite="Fundadores da CDL Ipirá">
      &ldquo;Construímos nossa história com <Mark>trabalho</Mark>, <Mark>dedicação</Mark> e o compromisso inabalável de ver o
      comércio de Ipirá <Mark>prosperar</Mark>.&rdquo;
    </QuoteBlock>
  );
};

export default QuoteSection;
