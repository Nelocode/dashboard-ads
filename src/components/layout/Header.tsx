import React, { useState } from 'react';
import { Menu, LogOut, User, Settings, Globe, X, Mail, Shield } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  onLogout, 
  userName, 
  userEmail, 
  userRole,
  setActiveTab 
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 transition-all">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-brand transition-all mr-3 border border-transparent hover:border-brand-muted/20"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-brand" />
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Consola de Control</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-6 w-px bg-gray-100 hidden md:block"></div>
          
          <div className="relative group">
            <div className="flex items-center space-x-3 cursor-pointer p-1.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-gray-900 leading-none">{userName || 'Usuario Admin'}</p>
                <p className="text-[10px] text-gray-400 mt-1">{userRole === 'ADMIN' ? 'Administrador' : 'Operador Premium'}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-brand-muted flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand/20 group-hover:scale-105 transition-transform">
                {(userName || 'AD').substring(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="absolute top-12 right-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-indigo-100/20 py-2 z-20 overflow-hidden hidden group-hover:block transition-all transform origin-top-right animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Cuenta Personal</p>
              </div>
              <button 
                onClick={() => setIsProfileModalOpen(true)} 
                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-brand/5 hover:text-brand flex items-center transition-colors font-medium"
              >
                <User className="w-4 h-4 mr-2.5 opacity-70"/> Mi Perfil
              </button>
              <button 
                onClick={() => setActiveTab?.('skins')}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-brand/5 hover:text-brand flex items-center transition-colors font-medium"
              >
                <Settings className="w-4 h-4 mr-2.5 opacity-70"/> Ajustes del Tema
              </button>
              <div className="border-t border-gray-50 my-1.5 mx-2"></div>
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center transition-colors font-semibold"
              >
                <LogOut className="w-4 h-4 mr-2.5 opacity-70"/> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-24 bg-gradient-to-r from-brand to-brand-muted">
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 pb-8 -mt-10 text-center">
              <div className="inline-flex w-20 h-20 rounded-2xl bg-white p-1 shadow-xl mb-4">
                <div className="w-full h-full rounded-xl bg-gray-50 flex items-center justify-center text-brand font-black text-2xl border border-gray-100">
                  {(userName || 'AD').substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <h2 className="text-xl font-black text-gray-900 leading-tight">{userName || 'Usuario Admin'}</h2>
              <div className="flex items-center justify-center mt-1 space-x-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Activo</span>
                <span className="px-2 py-0.5 bg-brand/5 text-brand text-[10px] font-black uppercase tracking-widest rounded-full border border-brand/10">{userRole || 'ADMIN'}</span>
              </div>

              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center p-3 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Email</p>
                    <p className="text-sm font-bold text-gray-700 mt-1">{userEmail || 'admin@empresa.com'}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                  <Shield className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Acceso</p>
                    <p className="text-sm font-bold text-gray-700 mt-1">Nivel {userRole === 'ADMIN' ? 'Control Total' : 'Operador'}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full mt-8 bg-gray-900 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
