import React from 'react';
import { Users, Shield, UserPlus, MoreVertical, Trash2, Edit2, Lock } from 'lucide-react';

export const UsersPage: React.FC = () => {
  // En un MVP real, esto vendría de una query a /api/users
  const mockUsers = [
    { id: 1, name: 'Nelson Admin', email: 'admin@dashads.com', role: 'ADMIN', status: 'Active', permissions: ['all'] },
    { id: 2, name: 'Operador Meta', email: 'meta@empresa.com', role: 'USER', status: 'Active', permissions: ['view_meta'] },
    { id: 3, name: 'Analista Google', email: 'google@empresa.com', role: 'USER', status: 'Inactive', permissions: ['view_google'] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Administra accesos, roles y permisos granulares por integrante.</p>
        </div>
        <button className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">
          <UserPlus className="w-4 h-4 mr-2" />
          Crear Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-premium p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Usuarios</p>
            <p className="text-2xl font-black text-gray-900">12</p>
          </div>
        </div>
        <div className="card-premium p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Administradores</p>
            <p className="text-2xl font-black text-gray-900">2</p>
          </div>
        </div>
        <div className="card-premium p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Roles Definidos</p>
            <p className="text-2xl font-black text-gray-900">3</p>
          </div>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Usuario</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Rol</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Permisos</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold mr-3 border border-gray-200 group-hover:bg-brand/10 group-hover:text-brand transition-all">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    user.role === 'ADMIN' ? 'bg-brand/10 text-brand border-brand/20' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                    <span className="text-xs font-bold text-gray-600">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map(p => (
                      <span key={p} className="bg-gray-50 text-gray-400 text-[9px] px-1.5 py-0.5 rounded border border-gray-100 font-bold">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all"><Edit2 className="w-4 h-4"/></button>
                    <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 className="w-4 h-4"/></button>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical className="w-4 h-4"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
