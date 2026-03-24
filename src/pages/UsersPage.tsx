import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Trash2, Edit2, Lock, X, Check } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser, type User } from '../lib/api';
import toast from 'react-hot-toast';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'USER',
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'view_dashboard', label: 'Ver Dashboard' },
    { id: 'manage_ads', label: 'Gestionar Anuncios' },
    { id: 'manage_companies', label: 'Gestionar Empresas' },
    { id: 'manage_config', label: 'Gestionar Ajustes' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || '',
        email: user.email,
        password: '', // Don't show password
        role: user.role,
        permissions: user.permissions
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        permissions: ['view_dashboard']
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        toast.success('Usuario actualizado');
      } else {
        if (!formData.password) throw new Error('La contraseña es obligatoria para nuevos usuarios');
        await createUser(formData);
        toast.success('Usuario creado');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Error en la operación');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${name}?`)) {
      try {
        await deleteUser(id);
        toast.success('Usuario eliminado');
        fetchUsers();
      } catch (error: any) {
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Administra accesos, roles y permisos granulares por integrante.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all"
        >
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
            <p className="text-2xl font-black text-gray-900">{users.length}</p>
          </div>
        </div>
        <div className="card-premium p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Administradores</p>
            <p className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'ADMIN').length}</p>
          </div>
        </div>
        <div className="card-premium p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Reglas Activas</p>
            <p className="text-2xl font-black text-gray-900">{availablePermissions.length}</p>
          </div>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-medium">Cargando usuarios...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Rol</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Permisos</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold mr-3 border border-gray-200 group-hover:bg-brand/10 group-hover:text-brand transition-all">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : (user.email.substring(0, 2).toUpperCase())}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name || 'Sin nombre'}</p>
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
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map(p => (
                        <span key={p} className="bg-gray-50 text-gray-400 text-[9px] px-1.5 py-0.5 rounded border border-gray-100 font-bold">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-gray-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all"
                        title="Editar Usuario"
                      >
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.name || user.email)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Eliminar Usuario"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej. Nelson Admin"
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-medium" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="email@empresa.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                     {editingUser ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
                   </label>
                   <input 
                     type="password" 
                     required={!editingUser}
                     value={formData.password}
                     onChange={e => setFormData({...formData, password: e.target.value})}
                     className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-medium" 
                   />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Rol de Acceso</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as any})}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-medium"
                  >
                    <option value="USER">Usuario estándar</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Permisos Grantizados</label>
                <div className="grid grid-cols-2 gap-3">
                  {availablePermissions.map(perm => (
                    <button
                      key={perm.id}
                      type="button"
                      onClick={() => togglePermission(perm.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                        formData.permissions.includes(perm.id)
                        ? 'bg-brand/5 border-brand text-brand'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-tight">{perm.label}</span>
                      {formData.permissions.includes(perm.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-200" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-brand text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                >
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
