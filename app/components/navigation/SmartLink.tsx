import Link from 'next/link';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<'a'>, 'href'> & { href: string; external?: boolean };

/** Link interno (next/link) ou externo (nova aba, com aviso para leitores de tela). */
export default function SmartLink({ href, external, children, ...props }: Props) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
