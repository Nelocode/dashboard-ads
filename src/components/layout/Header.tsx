import { Menu, LogOut, User, Settings, Globe } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  onLogout?: () => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, onLogout, userName }) => {
  return (
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
              <p className="text-[10px] text-gray-400 mt-1">Nivel Enterprise</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-brand-muted flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand/20 group-hover:scale-105 transition-transform">
              {(userName || 'AD').substring(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="absolute top-12 right-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-indigo-100/20 py-2 z-20 overflow-hidden hidden group-hover:block transition-all transform origin-top-right animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Cuenta Personal</p>
            </div>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-brand/5 hover:text-brand flex items-center transition-colors">
              <User className="w-4 h-4 mr-2.5 opacity-70"/> Mi Perfil
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-brand/5 hover:text-brand flex items-center transition-colors">
              <Settings className="w-4 h-4 mr-2.5 opacity-70"/> Ajustes
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
  );
};
