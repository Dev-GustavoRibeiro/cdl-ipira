'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { useEffect } from 'react';

export default function AdminLoginPage() {
  const router                                  = useRouter();
  const [username, setUsername]                 = useState('');
  const [password, setPassword]                 = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [isLoading, setIsLoading]               = useState(false);
  const [error, setError]                       = useState('');
  const [turnstileToken, setTurnstileToken]     = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady]     = useState(false);
  const [lockoutSeconds, setLockoutSeconds]     = useState(0);
  const [attempts, setAttempts]                 = useState(0);
  const turnstileRef                            = useRef<TurnstileInstance>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA';

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
        body: JSON.stringify({ username, password, turnstileToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        router.replace('/admin/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-[#001a3d] via-[#003f7f] to-[#001a3d] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Grid de fundo */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Orbes decorativos */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00a859] rounded-full blur-[120px] opacity-15 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#ffd000] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.4)] p-8 sm:p-10 border border-white/30">

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
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.style.display = 'none';
                  const icon = img.nextElementSibling as HTMLElement | null;
                  if (icon) icon.style.display = 'flex';
                }}
              />
              <FaShieldAlt className="w-12 h-12 text-[#003f7f]" style={{ display: 'none' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-1">
              Acesso Administrativo
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              CDL Ipirá — Sistema de Gestão
            </p>
          </div>

          {/* Lockout banner */}
          {isLocked && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                  <FaLock className="w-3.5 h-3.5 text-orange-600" />
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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <FaLock className="w-3 h-3 text-red-600" />
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

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Usuário */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Usuário
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  data-testid="admin-login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading || isLocked}
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#003f7f] focus:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400 text-sm"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <input
                  data-testid="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isLocked}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#003f7f] focus:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400 text-sm"
                  placeholder="Digite sua senha"
                />
                <button
                  data-testid="admin-login-toggle-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Verificação de Segurança
              </label>
              <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 flex items-center justify-center min-h-[70px]">
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
                    size: 'normal',
                  }}
                />
              </div>
              {!turnstileReady && !isLocked && (
                <p className="text-xs text-gray-400 mt-1.5 text-center">
                  Aguardando verificação Cloudflare...
                </p>
              )}
            </div>

            {/* Botão */}
            <button
              data-testid="admin-login-submit"
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-gradient-to-r from-[#003f7f] to-[#0066cc] text-white py-4 rounded-xl font-bold text-sm hover:shadow-xl hover:from-[#004d99] hover:to-[#0077e6] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : isLocked ? (
                <>
                  <FaLock className="w-4 h-4" />
                  <span>Bloqueado por {formatLockout(lockoutSeconds)}</span>
                </>
              ) : (
                <>
                  <FaLock className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>
          </form>

          {/* Badges de segurança */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <FaShieldAlt className="w-3 h-3 text-[#00a859]" />
              <span>Cloudflare Turnstile</span>
            </div>
            <span className="text-gray-200 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <FaLock className="w-3 h-3 text-[#003f7f]" />
              <span>Rate limiting ativo</span>
            </div>
            <span className="text-gray-200 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#ffd000]" />
              <span>Auditoria registrada</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-white/40 text-xs">
          <p suppressHydrationWarning>© {new Date().getFullYear()} CDL Ipirá — Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
