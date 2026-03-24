import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { fetchCampaigns, syncAds } from '../lib/api';
import { KpiCards } from '../components/dashboard/KpiCards';
import { CampaignTable } from '../components/dashboard/CampaignTable';

export const MetaAdsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: campaigns = [], error } = useQuery({
    queryKey: ['campaigns', 'meta'],
    queryFn: () => fetchCampaigns('meta'),
  });

  const syncMutation = useMutation({
    mutationFn: syncAds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsSyncing(false);
    },
    onError: () => setIsSyncing(false)
  });

  const handleSync = () => {
    setIsSyncing(true);
    syncMutation.mutate();
  };

  // Calcular KPIs basados en los datos filtrados
  const kpis = {
    totalSpend: { value: campaigns.reduce((acc, c) => acc + c.spend, 0), trend: 0 },
    cpa: { value: campaigns.length > 0 ? campaigns.reduce((acc, c) => acc + c.cpa, 0) / campaigns.length : 0, trend: 0 },
    roas: { value: 0, trend: 0 }, // El ROAS requeriría datos de ingresos
    totalConversions: { value: campaigns.reduce((acc, c) => acc + c.conversions, 0), trend: 0 },
  };

  if (error) return (
    <div className="p-8 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center shadow-sm">
      <AlertCircle className="w-5 h-5 mr-3" />
      Error al cargar campañas de Meta: {(error as Error).message}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Consola de Meta Ads</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión avanzada de Facebook e Instagram.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50 transition-all shadow-sm ${isSyncing ? 'opacity-50' : ''}`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Datos'}
        </button>
      </div>

      <KpiCards data={kpis} />

      <div className="grid md:grid-cols-1 gap-6">
        <CampaignTable 
          campaigns={campaigns.filter(c => c.platform.toLowerCase() === 'meta')} 
          onAnalyze={(c) => console.log('Analyze', c)} 
        />
      </div>
    </div>
  );
};
