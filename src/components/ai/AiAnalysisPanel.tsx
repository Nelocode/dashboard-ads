import { useState, useEffect } from 'react';
import { X, Bot, AlertTriangle, Lightbulb, Activity, CheckCircle2 } from 'lucide-react';
import type { Campaign } from '../../data/mockData';
import { analyzeCampaign } from '../../lib/api';

interface AiAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

export const AiAnalysisPanel: React.FC<AiAnalysisPanelProps> = ({ isOpen, onClose, campaign }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set([]));

  const toggleCheck = (idx: number) => {
    const newKeys = new Set(checkedItems);
    if (newKeys.has(idx)) newKeys.delete(idx);
    else newKeys.add(idx);
    setCheckedItems(newKeys);
  };

  const handleApply = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  useEffect(() => {
    if (isOpen && campaign) {
      setIsAnalyzing(true);
      setIsSuccess(false);
      
      const metrics = {
        id: campaign.id,
        name: campaign.name,
        spend: campaign.spend,
        conversions: campaign.conversions,
        cpa: campaign.cpa,
        roas: campaign.spend > 0 ? (campaign.conversions * 100) / campaign.spend : 0, // Mock ROAS calculation
        platform: campaign.platform,
        status: campaign.status
      };

      analyzeCampaign(campaign.name, metrics)
        .then((data: any) => {
          setAnalysis(data);
          if (data.suggestions) {
            setCheckedItems(new Set(data.suggestions.map((_: any, i: number) => i)));
          }
          setIsAnalyzing(false);
        })
        .catch((err) => {
          console.error("Error en análisis:", err.message);
          setAnalysis({
            diagnosis: "Error al conectar con el motor de IA local. Asegúrate de que Ollama esté corriendo con el modelo qwen2.5-coder.",
            budgetLeaks: "No se puede determinar.",
            suggestions: ["Reintentar conexión", "Verificar estado de Ollama"]
          });
          setIsAnalyzing(false);
        });
    }
  }, [isOpen, campaign]);

  if (!isOpen || !campaign) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col translate-x-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600 p-2 rounded-lg shadow-sm shadow-purple-200">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Análisis IA de DashAds</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          {isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-purple-100 rounded-full border-t-purple-600 animate-spin"></div>
                <Bot className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analizando rendimiento...</h3>
              <p className="text-sm text-gray-500">
                Cruzando datos de conversión, CTR e inversión para "{campaign.name}"
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              
              <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Campaña Analizada</h4>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">{campaign.name}</span>
                  <span className="text-sm font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {campaign.platform}
                  </span>
                </div>
              </div>

              {/* Diagnóstico de Rendimiento */}
              <div className="space-y-3">
                <div className="flex items-center text-indigo-700 font-semibold text-lg border-b border-gray-100 pb-2">
                  <Activity className="w-5 h-5 mr-2" />
                  Diagnóstico de Rendimiento
                </div>
                <div className="text-sm text-gray-600 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <p>
                    {analysis?.diagnosis || 'Analizando...'}
                  </p>
                </div>
              </div>

              {/* Fugas de Presupuesto */}
              <div className="space-y-3">
                <div className="flex items-center text-rose-600 font-semibold text-lg border-b border-gray-100 pb-2">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Fugas de Presupuesto detectadas
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-sm text-rose-800 space-y-2">
                  <p>{analysis?.budgetLeaks || 'No se detectan fugas críticas.'}</p>
                </div>
              </div>

              {/* Sugerencias de Optimización */}
              <div className="space-y-3">
                <div className="flex items-center text-emerald-600 font-semibold text-lg border-b border-gray-100 pb-2">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Sugerencias de Optimización
                </div>
                <div className="space-y-3">
                  {(analysis?.suggestions || []).map((suggestion: string, idx: number) => (
                    <label key={idx} className={`flex items-start p-3 bg-white border rounded-xl transition-colors cursor-pointer group ${checkedItems.has(idx) ? 'border-emerald-500 bg-emerald-50/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'border-gray-200 hover:bg-gray-50 hover:border-emerald-300'}`}>
                      <input 
                        type="checkbox" 
                        checked={checkedItems.has(idx)}
                        onChange={() => toggleCheck(idx)}
                        className="mt-1 flex-shrink-0 text-emerald-500 rounded focus:ring-emerald-500 border-gray-300 w-4 h-4 transition-all" 
                      />
                      <span className={`ml-3 text-sm transition-colors ${checkedItems.has(idx) ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{suggestion}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                {isSuccess ? (
                  <div className="w-full bg-emerald-50 text-emerald-600 font-semibold py-3 flex items-center justify-center rounded-xl border border-emerald-200 animate-pulse">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    ¡Optimizaciones aplicadas exitosamente!
                  </div>
                ) : (
                  <button 
                    disabled={checkedItems.size === 0}
                    onClick={handleApply}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Aplicar {checkedItems.size} {checkedItems.size === 1 ? 'optimización' : 'optimizaciones'}
                  </button>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};
