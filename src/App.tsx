import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { KpiCards } from './components/dashboard/KpiCards';
import { PerformanceChart } from './components/dashboard/PerformanceChart';
import { CampaignTable } from './components/dashboard/CampaignTable';
import { AiAnalysisPanel } from './components/ai/AiAnalysisPanel';
import { fetchKpis, fetchCampaigns } from './lib/api';
import { kpiData as mockKpiData, chartData, mockCampaigns as mockCampaignsData, type Campaign } from './data/mockData';

const queryClient = new QueryClient();

import { IntegrationsPage } from './pages/IntegrationsPage';
import { LoginPage } from './pages/LoginPage';
import { UsersPage } from './pages/UsersPage';
import { MetaAdsPage } from './pages/MetaAdsPage';
import { GoogleAdsPage } from './pages/GoogleAdsPage';
import { SkinsPage } from './pages/SkinsPage';
import { AiSettingsPage } from './pages/AiSettingsPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { QuickGuide } from './components/ui/QuickGuide';
import { useTheme } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { setTheme } = useTheme();

  // Cargar sesión al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('dashads-token');
    const savedUser = localStorage.getItem('dashads-user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      const userData = JSON.parse(savedUser);
      setUser(userData);
      if (userData.skin) setTheme(userData.skin);
    }
  }, []);

  const handleLogin = (userData: any, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('dashads-token', userToken);
    localStorage.setItem('dashads-user', JSON.stringify(userData));
    if (userData.skin) setTheme(userData.skin);
    setShowGuide(true); // Mostrar guía solo al primer login real
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dashads-token');
    localStorage.removeItem('dashads-user');
  };

  // Queries con fallbacks a MockData si el servidor no está listo
  const { data: kpis = mockKpiData as any, isLoading: isLoadingKpis } : { data: any, isLoading: boolean } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => fetchKpis(),
    retry: 1,
    enabled: !!token
  });

  const { data: campaigns = mockCampaignsData as any, isLoading: isLoadingCampaigns } : { data: any, isLoading: boolean } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => fetchCampaigns(),
    retry: 1,
    enabled: !!token
  });

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const handleAnalyze = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsAiPanelOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'meta':
        return <MetaAdsPage />;
      case 'google':
        return <GoogleAdsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'companies':
        return <CompaniesPage />; // Changed from CompanyManagement to CompaniesPage
      case 'users':
        return user?.permissions?.includes('manage_users')
          ? <UsersPage />
          : <div className="p-10 card-premium text-center">Sin permisos para gestionar usuarios</div>;
      case 'skins':
        return <SkinsPage />;
      case 'settings':
        return user?.permissions?.includes('manage_config')
          ? <AiSettingsPage />
          : <div className="p-10 card-premium text-center">Sin permisos para ajustes de API</div>;
      case 'dashboard':
        return (
          <>
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resumen Global de Rendimiento</h1>
                <p className="text-sm text-gray-500 mt-1">Hola {user?.name}, visualizando datos con IA local.</p>
              </div>
              <div className="flex gap-2">
                { (isLoadingKpis || isLoadingCampaigns) && (
                  <span className="text-xs text-indigo-500 animate-pulse flex items-center bg-indigo-50 px-3 py-1 rounded-full font-medium">
                    Sincronizando...
                  </span>
                ) }
              </div>
            </div>
            <KpiCards data={kpis} />
            <PerformanceChart data={chartData} />
            <div className="mb-10">
              <CampaignTable campaigns={campaigns} onAnalyze={handleAnalyze} />
            </div>
          </>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="text-3xl font-bold">{activeTab.charAt(0)}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vista de {activeTab}</h2>
            <p className="text-gray-500 max-w-md">Esta sección está en desarrollo.</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-6 font-medium text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
            >
              Volver al Resumen Global
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          onLogout={handleLogout}
          userName={user?.name}
          userEmail={user?.email}
          userRole={user?.role}
          setActiveTab={setActiveTab}
        />
        
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Guía Rápida para el Usuario */}
      {showGuide && (
        <QuickGuide 
          onComplete={() => setShowGuide(false)} 
          onNavigate={(tab: string) => setActiveTab(tab)}
        />
      )}

      {/* Panel de IA Lateral */}
      <AiAnalysisPanel 
        isOpen={isAiPanelOpen} 
        onClose={() => setIsAiPanelOpen(false)} 
        campaign={selectedCampaign} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <DashboardContent />
    </QueryClientProvider>
  );
}

export default App;
