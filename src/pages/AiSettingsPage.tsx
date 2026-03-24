import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bot, Save, AlertCircle, CheckCircle2, Cpu, Brain, Sparkles } from 'lucide-react';
import { fetchAiConfig, updateAiConfig } from '../lib/api';

export const AiSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: config, isLoading } = useQuery({
    queryKey: ['aiConfig'],
    queryFn: fetchAiConfig,
  });

  const mutation = useMutation({
    mutationFn: updateAiConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiConfig'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const [formData, setFormData] = useState({
    provider: config?.provider || 'ollama',
    apiKey: config?.apiKey || '',
    modelName: config?.modelName || 'qwen2.5-coder:latest',
  });

  // Update form data when config is loaded
  React.useEffect(() => {
    if (config) {
      setFormData({
        provider: config.provider,
        apiKey: config.apiKey || '',
        modelName: config.modelName || '',
      });
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando configuración de IA...</div>;

  const providers = [
    { id: 'ollama', name: 'Ollama (Local)', icon: Cpu, desc: 'Privacidad total, corre en tu propio hardware.' },
    { id: 'openai', name: 'OpenAI (Nube)', icon: Sparkles, desc: 'Máxima potencia con GPT-4o o GPT-3.5.' },
    { id: 'gemini', name: 'Google Gemini (Nube)', icon: Brain, desc: 'Integración fluida con el ecosistema Google.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Bot className="w-5 h-5 text-brand" />
            <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Motor de Análisis IA</h1>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Configura el cerebro que analiza tus campañas publicitarias.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((p) => {
          const Icon = p.icon;
          const isActive = formData.provider === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setFormData({ ...formData, provider: p.id, modelName: p.id === 'ollama' ? 'qwen2.5-coder:latest' : '' })}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                isActive 
                  ? 'border-brand bg-brand/5 ring-4 ring-brand/10' 
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-brand/40'
              }`}
            >
              <Icon className={`w-8 h-8 mb-4 ${isActive ? 'text-brand' : 'text-[var(--text-muted)]'}`} />
              <h3 className={`font-bold mb-1 ${isActive ? 'text-brand' : 'text-[var(--text-main)]'}`}>{p.name}</h3>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-medium">{p.desc}</p>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="card-premium p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Token / API Key
            </label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              placeholder={formData.provider === 'ollama' ? 'Opcional para Ollama' : 'Introduce tu clave de API...'}
              disabled={formData.provider === 'ollama'}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
            {formData.provider === 'ollama' && (
              <p className="text-[10px] text-brand font-medium">Ollama utiliza tu servidor local, no requiere API Key.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Nombre del Modelo
            </label>
            <input
              type="text"
              value={formData.modelName}
              onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
              placeholder="Ej: gpt-4o, gemini-1.5-pro, qwen2.5-coder"
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
          <div className="flex items-center space-x-2">
            {mutation.isPending && (
              <div className="flex items-center space-x-2 text-brand animate-pulse">
                <span className="w-2 h-2 rounded-full bg-brand"></span>
                <span className="text-xs font-bold uppercase tracking-widest">Guardando Cambios...</span>
              </div>
            )}
            {mutation.isError && (
              <div className="flex items-center space-x-2 text-rose-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Error al guardar</span>
              </div>
            )}
            {saveSuccess && (
              <div className="flex items-center space-x-2 text-emerald-500 animate-in zoom-in">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Configuración Guardada</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-8 py-3 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </form>

      <div className="bg-brand/5 border border-brand/20 p-6 rounded-2xl flex items-start space-x-4">
        <AlertCircle className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <div className="text-xs text-[var(--text-muted)] leading-relaxed">
          <p className="font-bold text-brand mb-1 uppercase tracking-wider">Nota de Seguridad:</p>
          Las claves de API se cifran en tránsito y se almacenan de forma segura en tu base de datos local. 
          Al cambiar el proveedor, todos los análisis futuros se realizarán utilizando el nuevo motor configurado.
        </div>
      </div>
    </div>
  );
};
