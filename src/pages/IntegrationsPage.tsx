import React, { useState, useEffect } from 'react';
import { Share2, CheckCircle2, Building2, ChevronRight, Zap, Settings2, Globe, ShieldCheck } from 'lucide-react';
import api from '../lib/api';

export const IntegrationsPage: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'easy' | 'expert'>('easy');
  
  const queryParams = new URLSearchParams(window.location.search);
  const status = queryParams.get('status');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data: any = await api.get('/companies');
      setCompanies(data);
      if (data.length > 0) setSelectedCompanyId(data[0].id);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform: string) => {
    if (!selectedCompanyId) {
      alert('Por favor, selecciona una empresa primero');
      return;
    }
    window.location.href = `http://localhost:3001/api/auth/connect/${platform}?companyId=${selectedCompanyId}`;
  };

  if (loading) return <div className="p-8 text-[var(--text-muted)] text-center">Cargando empresas...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-brand/10 rounded-2xl text-brand shadow-sm">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Centro de Conexiones</h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">Vincula tus fuentes de datos en segundos.</p>
          </div>
        </div>

        <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)] self-start">
          <button 
            onClick={() => setViewMode('easy')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              viewMode === 'easy' ? 'bg-brand text-white shadow-md' : 'text-[var(--text-muted)] hover:text-brand'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Conexión Rápida</span>
          </button>
          <button 
            onClick={() => setViewMode('expert')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              viewMode === 'expert' ? 'bg-brand text-white shadow-md' : 'text-[var(--text-muted)] hover:text-brand'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Modo Experto</span>
          </button>
        </div>
      </div>

      {status === 'success' && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl flex items-center space-x-3 mb-6 animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-bold text-xs uppercase tracking-wider">¡Cuenta conectada y vinculada con éxito!</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lado Izquierdo: Configuración */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-premium p-6 space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-4 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-2" />
                1. Selección de Empresa
              </h3>
              <select 
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-brand outline-none transition-all text-sm font-bold text-[var(--text-main)]"
              >
                {companies.length === 0 ? (
                  <option disabled>No hay empresas creadas</option>
                ) : (
                  companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                )}
              </select>
            </div>

            <div className="pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-[10px] font-black text-brand uppercase tracking-[0.2em] mb-4 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                Seguridad de Datos
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] leading-loose">
                Utilizamos cifrado de grado bancario para tus tokens de acceso. Nunca compartimos tu información con terceros.
              </p>
            </div>
          </div>

          <div className="bg-brand p-6 rounded-3xl text-white shadow-xl shadow-brand/20 relative overflow-hidden group">
            <Globe className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <h4 className="font-black text-sm mb-2 uppercase tracking-widest">Sincronización Total</h4>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Tus datos se actualizan automáticamente cada hora para garantizar análisis precisos por la IA.
            </p>
          </div>
        </div>

        {/* Lado Derecho: Plataformas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <IntegrationCard 
              title="Meta Ads"
              description="Conecta Facebook e Instagram Ads en un paso."
              platform="meta"
              onConnect={() => handleConnect('meta')}
              active={true}
              disabled={!selectedCompanyId}
              viewMode={viewMode}
            />

            <IntegrationCard 
              title="Google Ads"
              description="Sincroniza campañas de Search, YouTube y Display."
              platform="google"
              onConnect={() => handleConnect('google')}
              active={true}
              disabled={!selectedCompanyId}
              viewMode={viewMode}
            />
          </div>

          {viewMode === 'expert' && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 animate-in slide-in-from-top-2">
              <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-widest flex items-center mb-2">
                <Settings2 className="w-4 h-4 mr-2" />
                Configuración de Desarrollador
              </h3>
              <p className="text-[11px] text-amber-600/80 leading-relaxed font-medium">
                En Modo Experto, debes haber configurado tus propios <b>CLIENT_ID</b> y <b>CLIENT_SECRET</b> en el panel de Ajustes de API. Esto permite usar tus propios entornos de Sandbox o Apps de Meta/Google personalizadas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IntegrationCard = ({ title, description, platform, onConnect, active, disabled, viewMode }: any) => {
  return (
    <div className={`card-premium p-8 transition-all duration-300 relative overflow-hidden group ${disabled ? 'opacity-50 grayscale' : 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand/10'}`}>
      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6 duration-300 ${
          platform === 'meta' ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'
        }`}>
          {platform === 'meta' ? (
            <span className="text-2xl font-black">Meta</span>
          ) : (
            <span className="text-2xl font-black">Ads</span>
          )}
        </div>
        
        <h2 className="text-xl font-black text-[var(--text-main)] mb-2 tracking-tight">{title}</h2>
        <p className="text-[var(--text-muted)] text-xs mb-8 leading-relaxed font-medium flex-1">
          {description}
        </p>
        
        <button 
          onClick={onConnect}
          disabled={disabled || !active}
          className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
            active 
              ? 'bg-brand text-white shadow-lg shadow-brand/20 hover:brightness-110' 
              : 'bg-[var(--bg-main)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-color)]'
          }`}
        >
          {viewMode === 'easy' ? <Zap className="w-3.5 h-3.5" /> : <Settings2 className="w-3.5 h-3.5" />}
          <span>{active ? `Conectar ${title}` : 'Próximamente...'}</span>
        </button>
      </div>
    </div>
  );
};
