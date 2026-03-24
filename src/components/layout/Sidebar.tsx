import React from 'react';
import { 
  LayoutDashboard, 
  PieChart, 
  Target, 
  Settings, 
  Share2, 
  Building2, 
  Users, 
  Palette 
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { type: 'header', label: 'Análisis' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Resumen Global' },
  { id: 'meta', icon: PieChart, label: 'Meta Ads' },
  { id: 'google', icon: Target, label: 'Google Ads' },
  { type: 'header', label: 'Gestión' },
  { id: 'companies', icon: Building2, label: 'Empresas' },
  { id: 'users', icon: Users, label: 'Usuarios' },
  { id: 'skins', icon: Palette, label: 'Skins' },
  { id: 'integrations', icon: Share2, label: 'Integraciones' },
  { id: 'settings', icon: Settings, label: 'Ajustes API' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, activeTab, setActiveTab }) => {
  return (
    <div
      className={`bg-[var(--bg-card)] border-r border-[var(--border-color)] h-screen transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-center border-b border-[var(--border-color)] px-4">
        {isCollapsed ? (
          <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand/20">
            D
          </div>
        ) : (
          <div className="flex items-center space-x-3 w-full">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-md shadow-brand/20">
              D
            </div>
            <span className="text-xl font-bold text-[var(--text-main)] truncate">DashAds</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          if (item.type === 'header') {
            return (
              <div
                key={`header-${index}`}
                className={`mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${
                  isCollapsed ? 'hidden' : 'block'
                } ${index > 0 ? 'mt-6' : ''}`}
              >
                {item.label}
              </div>
            );
          }
          const Icon = item.icon!;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id!)}
              className={`
                w-full flex items-center py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${activeTab === item.id 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20 scale-[1.02]' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand'
                }
                ${isCollapsed ? 'justify-center' : 'px-3'}
              `}
            >
              <Icon className={`
                w-5 h-5 ${isCollapsed ? '' : 'mr-3'} transition-colors
                ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-brand'}
              `} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <span>v1.5 Enterprise</span>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Sistema Activo</span>
          </div>
        </div>
      )}
    </div>
  );
};
