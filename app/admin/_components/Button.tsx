import React from 'react';
import type { IconType } from 'react-icons';
import { cx, focusRing } from './styles';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'sm';

const VARIANTS: Record<ButtonVariant, string> = {
  // Texto branco só sobre azul-escuro/vermelho (contraste AA)
  primary: 'bg-[#003f7f] text-white shadow-[0_10px_24px_-14px_rgba(0,63,127,0.8)] hover:bg-[#0052a3]',
  secondary: 'bg-white text-[#003f7f] ring-1 ring-inset ring-gray-300 hover:bg-[#003f7f]/[0.04] hover:ring-[#003f7f]/40',
  danger: 'bg-red-600 text-white shadow-[0_10px_24px_-14px_rgba(220,38,38,0.8)] hover:bg-red-700',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-[#003f7f]',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 text-sm',
  // 44px em telas de toque; mais compacto com mouse
  sm: 'min-h-11 px-4 text-sm pointer-fine:min-h-9 pointer-fine:px-3.5 pointer-fine:text-[13px]',
};

/**
 * Classes de botão para usar também em <Link>/<a>:
 * `<Link href="/admin/noticias" className={buttonClass('secondary')}>Ver todas</Link>`
 */
export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cx(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap select-none',
    'transition-[background-color,color,box-shadow,scale] duration-200 active:scale-[0.98] motion-reduce:transition-none',
    'disabled:pointer-events-none disabled:opacity-50',
    focusRing,
    VARIANTS[variant],
    SIZES[size],
    className
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícone à esquerda do texto (some durante o loading) */
  icon?: IconType;
  /** Mostra spinner, desabilita e marca aria-busy */
  loading?: boolean;
}

/**
 * Botão de ação do painel.
 * - primary: azul-marinho (ação principal da tela: "Nova notícia", "Salvar")
 * - secondary: contorno (ações de apoio: "Cancelar", "Exportar")
 * - danger: vermelho (excluir)
 * - ghost: sem fundo (ações discretas)
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, className)}
      {...props}
    >
      {loading ? (
        <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      )}
      {children}
    </button>
  );
}

const ICON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-[#003f7f] text-white hover:bg-[#0052a3]',
  secondary: 'bg-white text-gray-600 ring-1 ring-inset ring-gray-300 hover:text-[#003f7f] hover:ring-[#003f7f]/40',
  danger: 'text-gray-500 hover:bg-red-50 hover:text-red-600',
  ghost: 'text-gray-500 hover:bg-gray-100 hover:text-[#003f7f]',
};

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Obrigatório: vira aria-label e title (o botão só tem ícone) */
  label: string;
  icon: IconType;
  variant?: ButtonVariant;
}

/** Botão só com ícone (editar, excluir, fechar...). 44px no toque, 36px com mouse. */
export function IconButton({ label, icon: Icon, variant = 'ghost', className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-xl pointer-fine:size-9',
        'transition-[background-color,color,box-shadow,scale] duration-200 active:scale-95 motion-reduce:transition-none',
        'disabled:pointer-events-none disabled:opacity-50',
        focusRing,
        ICON_VARIANTS[variant],
        className
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
