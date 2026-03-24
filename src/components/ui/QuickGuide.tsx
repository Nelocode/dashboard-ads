import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Building2, Key, Share2, X } from 'lucide-react';

interface QuickGuideProps {
  onComplete?: () => void;
  onNavigate?: (tab: string) => void;
}

export const QuickGuide: React.FC<QuickGuideProps> = ({ onComplete, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Retraso para que aparezca de forma suave
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: "Paso 1: Crea tu Empresa",
      description: "El primer paso es registrar tu empresa o la de tu cliente en la sección 'Empresas'. Esto nos permite organizar tus cuentas de forma independiente.",
      icon: <Building2 className="w-6 h-6 text-indigo-500" />,
      button: "Ir a Empresas",
      target: "companies"
    },
    {
      title: "Paso 2: Configura tus APIs",
      description: "Ingresa tus credenciales de Meta (Facebook) y Google en 'Ajustes API'. No necesitas editar archivos, ¡hazlo todo desde aquí de forma segura!",
      icon: <Key className="w-6 h-6 text-purple-500" />,
      button: "Configurar APIs",
      target: "settings"
    },
    {
      title: "Paso 3: Conecta tus Cuentas",
      description: "Finalmente, ve a 'Integraciones', selecciona tu empresa y conecta tus campañas reales para empezar a analizarlas con IA.",
      icon: <Share2 className="w-6 h-6 text-emerald-500" />,
      button: "Realizar Conexión",
      target: "integrations"
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-2xl shadow-brand/20 border border-brand/5 w-80 md:w-96 overflow-hidden">
        <div className="bg-brand p-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-sm">Guía de Configuración</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                    s === step ? 'bg-brand w-12' : s < step ? 'bg-emerald-400' : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Paso {step} de 3</span>
          </div>

          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-2xl shrink-0">
              {steps[step - 1].icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{steps[step - 1].title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed italic">
                {steps[step - 1].description}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all"
              >
                Atrás
              </button>
            )}
            <button 
              onClick={() => {
                if (onNavigate) onNavigate(steps[step - 1].target);
                if (step < 3) setStep(step + 1);
                else {
                  setIsVisible(false);
                  if (onComplete) onComplete();
                }
              }}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/20 flex items-center justify-center group"
            >
              {step === 3 ? '¡Entendido!' : 'Ir a ' + steps[step-1].button}
              {step < 3 && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              {step === 3 && <CheckCircle2 className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Sugerencia: Empieza creando tu primera empresa hoy.
          </p>
        </div>
      </div>
    </div>
  );
};
