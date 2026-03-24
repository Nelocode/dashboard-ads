import React, { useState } from 'react';
import { Bot, Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import api from '../lib/api';

interface LoginPageProps {
  onLogin: (user: any, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@dashads.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response: any = await api.post('/auth/login', { email, password });
      onLogin(response.user, response.token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand flex items-center justify-center p-4 transition-colors duration-500 overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-muted rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/20 p-8 md:p-10 border border-white/20 relative">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-brand rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-brand/30 group hover:rotate-6 transition-transform">
              <Bot className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              Dash<span className="text-brand">Ads</span>
            </h1>
            <p className="text-gray-500 font-medium">Control inteligente de tus campañas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center text-rose-600 text-sm animate-shake">
                <AlertCircle className="w-4 h-4 mr-3 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Corporativo</label>
              <div className="relative group">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all font-medium"
                  placeholder="ejemplo@empresa.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contraseña</label>
                <button type="button" className="text-[10px] font-bold text-brand uppercase hover:underline">¿Olvidaste?</button>
              </div>
              <div className="relative group">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand/20 hover:shadow-brand/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Entrar al Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col items-center">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
              <Sparkles className="w-4 h-4 text-brand-muted" />
              <span>SISTEMA ENTERPRISE v1.5</span>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-white/60 text-xs font-medium tracking-wide">
          &copy; 2026 DashAds Intelligence. Reservados todos los derechos.
        </p>
      </div>
    </div>
  );
};
