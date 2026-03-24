import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck } from 'lucide-react';
import api from '../lib/api';

export const ApiSettings: React.FC = () => {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<any>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data: any = await api.get('/config');
      setConfigs(data);
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (platform: string, formData: any) => {
    try {
      setSaveStatus({ platform, status: 'saving' });
      await api.post('/config', { platform, ...formData });
      setSaveStatus({ platform, status: 'success' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ platform, status: 'error' });
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-gray-500">Cargando configuración...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Settings className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración de APIs de Ads</h1>
      </div>

      <p className="text-gray-600 max-w-2xl">
        Ingresa las credenciales de tus aplicaciones de desarrollador de Meta y Google. Estos datos son necesarios para que la plataforma pueda solicitar acceso a tus cuentas de anuncios.
      </p>

      <div className="grid gap-8">
        {/* Meta Config */}
        <PlatformConfigForm 
          platform="meta"
          title="Meta Ads (Marketing API)"
          config={configs.find(c => c.platform === 'meta')}
          onSave={handleSave}
          saveStatus={saveStatus?.platform === 'meta' ? saveStatus.status : null}
          color="blue"
        />

        {/* Google Config */}
        <PlatformConfigForm 
          platform="google"
          title="Google Ads API"
          config={configs.find(c => c.platform === 'google')}
          onSave={handleSave}
          saveStatus={saveStatus?.platform === 'google' ? saveStatus.status : null}
          color="gray"
          showDeveloperToken
        />
      </div>
    </div>
  );
};

const PlatformConfigForm = ({ platform, title, config, onSave, saveStatus, color, showDeveloperToken = false }: any) => {
  const [formData, setFormData] = useState({
    clientId: config?.clientId || '',
    clientSecret: config?.clientSecret || '',
    developerToken: config?.developerToken || ''
  });

  const isSaving = saveStatus === 'saving';

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
        <span className={`w-3 h-3 rounded-full bg-${color}-500 mr-2`}></span>
        {title}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CLIENT_ID</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
            value={formData.clientId}
            onChange={(e) => setFormData({...formData, clientId: e.target.value})}
            placeholder="Introduce tu Client ID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CLIENT_SECRET</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
            value={formData.clientSecret}
            onChange={(e) => setFormData({...formData, clientSecret: e.target.value})}
            placeholder="••••••••••••••••"
          />
        </div>

        {showDeveloperToken && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DEVELOPER_TOKEN</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
              value={formData.developerToken}
              onChange={(e) => setFormData({...formData, developerToken: e.target.value})}
              placeholder="Google Ads developer token"
            />
          </div>
        )}

        <div className="pt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
            Las credenciales se guardan de forma segura
          </div>
          
          <button 
            onClick={() => onSave(platform, formData)}
            disabled={isSaving}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              saveStatus === 'success' 
                ? 'bg-green-500 text-white shadow-green-100' 
                : 'bg-gray-900 text-white hover:bg-black shadow-gray-200'
            } shadow-lg disabled:opacity-50`}
          >
            {isSaving ? 'Guardando...' : saveStatus === 'success' ? '¡Guardado!' : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
