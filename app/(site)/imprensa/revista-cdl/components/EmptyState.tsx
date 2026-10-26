import React from 'react';
import Link from 'next/link';
import { FaBookOpen } from 'react-icons/fa';
import { StateBlock, secondaryButton } from '../../noticias/components/LoadStates';

const EmptyState = () => {
  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <StateBlock
          icon={FaBookOpen}
          title="Nenhuma edição disponível"
          description="Ainda não há edições publicadas da Revista CDL. Enquanto isso, acompanhe as notícias da CDL Ipirá."
        >
          <Link href="/imprensa/noticias" className={secondaryButton}>
            Ver notícias
          </Link>
        </StateBlock>
      </div>
    </section>
  );
};

export default EmptyState;
