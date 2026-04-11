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
  user: any;
}

const navItems = [
  { type: 'header', label: 'Análisis' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Resumen Global', permission: 'view_dashboard' },
  { id: 'meta', icon: PieChart, label: 'Meta Ads', permission: 'manage_ads' },
  { id: 'google', icon: Target, label: 'Google Ads', permission: 'manage_ads' },
  { type: 'header', label: 'Gestión' },
  { id: 'companies', icon: Building2, label: 'Empresas', permission: 'manage_companies' },
  { id: 'users', icon: Users, label: 'Usuarios', permission: 'manage_users', adminOnly: true },
  { id: 'skins', icon: Palette, label: 'Skins' },
  { id: 'integrations', icon: Share2, label: 'Integraciones', permission: 'manage_config' },
  { id: 'settings', icon: Settings, label: 'Ajustes API', permission: 'manage_config' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, activeTab, setActiveTab, user }) => {
  return (
    <div
      className={`bg-[var(--bg-card)] border-r border-[var(--border-color)] h-screen transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-20 flex items-center justify-center border-b border-[var(--border-color)] px-4">
        {isCollapsed ? (
          <img src="/logo.png" className="w-12 h-12 object-contain" alt="Logo" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-4">
            <img src="/logo.png" className="h-12 w-auto object-contain mb-1" alt="7SecMedia" />
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

          // RBAC Check
          if (user?.role !== 'ADMIN') {
            if (item.adminOnly) return null;
            if (item.permission && !user?.permissions?.includes(item.permission)) return null;
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
        <div className="p-4 border-t border-[var(--border-color)] flex flex-col gap-2 text-[10px] text-[var(--text-muted)]">
          <div className="flex items-center justify-between">
            <span>v1.5 Enterprise</span>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Sistema Activo</span>
            </div>
          </div>
          <div className="text-center italic opacity-75">
            creado con amor ❤️ por 7SecMedia
          </div>
        </div>
      )}
    </div>
  );
};
