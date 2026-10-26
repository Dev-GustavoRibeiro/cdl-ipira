'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

const INPUT_CLASS =
  'w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 transition-[border-color,background-color] duration-200 focus:border-[#003f7f] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';

export default function AdminLoginPage() {
  const router                                  = useRouter();
  const [username, setUsername]                 = useState('');
  const [password, setPassword]                 = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [capsLock, setCapsLock]                 = useState(false);
  const [isLoading, setIsLoading]               = useState(false);
  const [error, setError]                       = useState('');
  const [turnstileToken, setTurnstileToken]     = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady]     = useState(false);
  const [lockoutSeconds, setLockoutSeconds]     = useState(0);
  const [attempts, setAttempts]                 = useState(0);
  const turnstileRef                            = useRef<TurnstileInstance>(null);

  // Chave de teste da Cloudflare (sempre passa) só fora de produção: em produção, sem a chave real, o login fica
  // indisponível em vez de aceitar qualquer um sem captcha
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    (process.env.NODE_ENV !== 'production' ? '1x00000000000000000000AA' : '');

  // Contagem regressiva de lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const t = setInterval(() => {
      setLockoutSeconds(s => {
        if (s <= 1) { clearInterval(t); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [lockoutSeconds]);

  const formatLockout = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  const resetTurnstile = () => {
    setTurnstileToken(null);
    setTurnstileReady(false);
    turnstileRef.current?.reset();
  };

  const handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      setError('Aguarde a verificação de segurança ser concluída.');
      return;
    }

    if (lockoutSeconds > 0) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password, turnstileToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.replace('/admin/dashboard');
        router.refresh();
      } else if (response.status === 429) {
        setLockoutSeconds(data.retryAfter ?? 900);
        setError('');
        resetTurnstile();
      } else {
        setAttempts(a => a + 1);
        setError(data.error || 'Usuário ou senha incorretos');
        resetTurnstile();
      }
    } catch {
      setError('Erro ao conectar com o servidor. Tente novamente.');
      resetTurnstile();
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked   = lockoutSeconds > 0;
  const canSubmit  = !!turnstileToken && turnstileReady && !isLoading && !isLocked;

  return (
    <div className="min-h-dvh bg-linear-to-br from-[#001a3d] via-[#003f7f] to-[#001a3d] flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">

      {/* Grid de fundo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Orbes decorativos */}
      <div aria-hidden="true" className="absolute -top-32 -left-32 w-96 h-96 bg-[#00a859] rounded-full blur-[120px] opacity-15 pointer-events-none" />
      <div aria-hidden="true" className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#ffd000] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <main className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,10,30,0.6)] ring-1 ring-white/40">
          {/* Faixa com as três cores da marca */}
          <div aria-hidden="true" className="h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000]" />

          <div className="p-7 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-5">
                <Image
                  src="/logo-cdl.png"
                  alt="CDL Ipirá"
                  width={180}
                  height={90}
                  priority
                  loading="eager"
                  className="h-20 w-auto object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#003f7f] text-balance">
                Acesso Administrativo
              </h1>
              <p className="mt-1.5 text-gray-500 text-sm font-medium">
                CDL Ipirá — Sistema de Gestão
              </p>
            </div>

            {/* Lockout banner */}
            {isLocked && (
              <div role="alert" className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FaLock className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-orange-800 text-sm">Acesso temporariamente bloqueado</p>
                    <p className="text-orange-700 text-xs mt-1">
                      Muitas tentativas incorretas. Aguarde{' '}
                      <span className="font-black text-orange-900 tabular-nums">
                        {formatLockout(lockoutSeconds)}
                      </span>{' '}
                      para tentar novamente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Erro */}
            {error && !isLocked && (
              <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <FaLock className="w-3 h-3 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-700 text-sm font-semibold">{error}</p>
                    {attempts > 0 && attempts < 5 && (
                      <p className="text-red-500 text-xs mt-0.5">
                        {5 - attempts} tentativa{5 - attempts !== 1 ? 's' : ''} restante{5 - attempts !== 1 ? 's' : ''} antes do bloqueio
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Usuário */}
              <div>
                <label htmlFor="admin-username" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  E-mail ou usuário
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" aria-hidden="true" />
                  <input
                    id="admin-username"
                    data-testid="admin-login-username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading || isLocked}
                    autoComplete="username"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className={`${INPUT_CLASS} pl-11 pr-4`}
                    placeholder="seu@email.com.br ou usuário"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="admin-password" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Senha
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" aria-hidden="true" />
                  <input
                    id="admin-password"
                    data-testid="admin-login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handlePasswordKey}
                    onKeyUp={handlePasswordKey}
                    onBlur={() => setCapsLock(false)}
                    required
                    disabled={isLoading || isLocked}
                    autoComplete="current-password"
                    aria-describedby={capsLock ? 'admin-capslock' : undefined}
                    className={`${INPUT_CLASS} pl-11 pr-12`}
                    placeholder="Digite sua senha"
                  />
                  <button
                    data-testid="admin-login-toggle-password"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-[#003f7f] transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {capsLock && (
                  <p id="admin-capslock" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <FaExclamationTriangle className="w-3 h-3" aria-hidden="true" />
                    Caps Lock está ativado
                  </p>
                )}
              </div>

              {/* Cloudflare Turnstile */}
              <div>
                <p className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Verificação de Segurança
                </p>
                <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 flex items-center justify-center min-h-[74px]">
                  {siteKey ? (
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={siteKey}
                      onSuccess={(token) => {
                        setTurnstileToken(token);
                        setTurnstileReady(true);
                      }}
                      onError={() => {
                        setTurnstileToken(null);
                        setTurnstileReady(false);
                        setError('Erro na verificação de segurança. Recarregue a página.');
                      }}
                      onExpire={() => {
                        setTurnstileToken(null);
                        setTurnstileReady(false);
                      }}
                      options={{
                        theme: 'light',
                        language: 'pt-br',
                        size: 'flexible',
                      }}
                    />
                  ) : (
                    <p role="alert" className="text-sm font-semibold text-red-700 text-center">
                      Login indisponível: a verificação de segurança não está configurada.
                    </p>
                  )}
                </div>
                {siteKey && !turnstileReady && !isLocked && (
                  <p className="text-xs text-gray-500 mt-2 text-center" aria-live="polite">
                    Aguardando verificação da Cloudflare...
                  </p>
                )}
              </div>

              {/* Botão */}
              <button
                data-testid="admin-login-submit"
                type="submit"
                disabled={!canSubmit}
                className="w-full min-h-[52px] bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white py-4 rounded-xl font-bold text-sm shadow-[0_14px_30px_-12px_rgba(0,63,127,0.7)] transition-[translate,scale,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(0,63,127,0.8)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    <span>Autenticando...</span>
                  </>
                ) : isLocked ? (
                  <>
                    <FaLock className="w-4 h-4" aria-hidden="true" />
                    <span>Bloqueado por {formatLockout(lockoutSeconds)}</span>
                  </>
                ) : (
                  <>
                    <FaLock className="w-4 h-4" aria-hidden="true" />
                    <span>Entrar no Sistema</span>
                  </>
                )}
              </button>
            </form>

            {/* Selos de segurança */}
            <ul className="mt-7 pt-5 border-t border-gray-100 flex items-center justify-center gap-x-4 gap-y-2 flex-wrap text-gray-500 text-xs">
              <li className="flex items-center gap-1.5">
                <FaShieldAlt className="w-3 h-3 text-[#00a859]" aria-hidden="true" />
                Cloudflare Turnstile
              </li>
              <li className="flex items-center gap-1.5">
                <FaLock className="w-3 h-3 text-[#003f7f]" aria-hidden="true" />
                Rate limiting ativo
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffd000]" aria-hidden="true" />
                Auditoria registrada
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-white/60 text-xs" suppressHydrationWarning>
          © {new Date().getFullYear()} CDL Ipirá — Todos os direitos reservados
        </p>
      </main>
    </div>
  );
}
