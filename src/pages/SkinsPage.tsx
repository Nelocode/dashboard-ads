import React from 'react';
import { Palette, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const SkinsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'default', name: 'Original Dash', color: '#4f46e5', desc: 'El clásico azul corporativo elegante.' },
    { id: 'midnight', name: 'Media Noche', color: '#2563eb', desc: 'Modo oscuro profundo para enfoque total.' },
    { id: 'emerald', name: 'Esmeralda', color: '#059669', desc: 'Tonos frescos y orgánicos para balance visual.' },
    { id: 'rose', name: 'Rose Premium', color: '#e11d48', desc: 'Estética audaz y vibrante de alta gama.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center text-center md:text-left flex-col md:flex-row gap-4">
        <div>
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
            <Palette className="w-5 h-5 text-brand" />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Personalización de Skins</h1>
          </div>
          <p className="text-sm text-gray-500">Cambia la atmósfera de tu dashboard con un solo clic.</p>
        </div>
        <div className="bg-brand/10 px-4 py-2 rounded-2xl flex items-center space-x-2 border border-brand/20">
          <Sparkles className="w-4 h-4 text-brand" />
          <span className="text-xs font-black text-brand uppercase tracking-widest">Personalización VIP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as any)}
            className={`group relative card-premium p-6 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              theme === t.id ? 'ring-4 ring-brand/20 border-brand' : 'hover:border-brand/40'
            }`}
          >
            <div 
              className="w-16 h-16 rounded-2xl mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center text-white"
              style={{ backgroundColor: t.color }}
            >
               {theme === t.id ? <Check className="w-8 h-8 font-bold" /> : <ImageIcon className="w-6 h-6 opacity-30" />}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t.name}</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">{t.desc}</p>

            {theme === t.id && (
              <div className="absolute top-4 right-4 bg-brand text-white p-1 rounded-full shadow-md animate-in zoom-in">
                <Check className="w-3 h-3" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="card-premium p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Palette className="w-48 h-48" />
        </div>
        
        <div className="max-w-xl">
          <h2 className="text-xl font-black text-[var(--text-main)] mb-4">Integración de Marca Personalizada</h2>
          <p className="text-sm text-[var(--text-muted)] leading-loose">
            ¿Necesitas colores específicos para tu agencia? Soporte para la inyección automática de paletas desde URL o Branding Assets próximamente.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200" />
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200" />
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200" />
        </div>
      </div>
    </div>
  );
};
