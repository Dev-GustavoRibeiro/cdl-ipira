'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Salvar informações do usuário no localStorage
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00a859] rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#003f7f] rounded-full blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 animate-scale-in">
          {/* Logo/Icon Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-2xl mb-6 shadow-lg">
              <FaShieldAlt className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Acesso Administrativo
            </h1>
            <p className="text-gray-500 text-sm sm:text-base font-medium">
              CDL Ipirá - Sistema de Gestão
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm animate-blur-fade-in">
              <div className="flex items-center gap-2">
                <FaLock className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Usuário
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#00a859] focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-[#00a859] focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-[#00a859] to-[#00d670] text-white py-3.5 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <FaLock className="w-4 h-4" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 text-xs text-gray-600">
              <p className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaShieldAlt className="w-3 h-3 text-[#00a859]" />
                Credenciais de Acesso
              </p>
              <div className="space-y-1 font-mono text-gray-600">
                <p><span className="font-semibold">Usuário:</span> cdlipiraadmin</p>
                <p><span className="font-semibold">Senha:</span> @CDL!Ipira@2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white/60 text-xs">
          <p>© 2025 CDL Ipirá. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}

