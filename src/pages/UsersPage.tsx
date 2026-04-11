import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Trash2, Edit2, Lock, X, Check, Copy, Key, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUsers, createUser, updateUser, deleteUser, type User } from '../lib/api';
import toast from 'react-hot-toast';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Success Modal State
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

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
        password: '', 
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
        toast.success('Usuario actualizado con éxito');
        setIsModalOpen(false);
      } else {
        const response: any = await createUser(formData);
        if (response.generatedPassword) {
          setGeneratedPassword(response.generatedPassword);
        } else {
          toast.success('Usuario creado');
          setIsModalOpen(false);
        }
      }
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Error en la operación');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
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
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Administra accesos, roles y permisos granulares por integrante.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Crear Usuario
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Usuarios', value: users.length, icon: Users, color: 'brand' },
          { label: 'Administradores', value: users.filter(u => u.role === 'ADMIN').length, icon: Shield, color: 'emerald' },
          { label: 'Reglas Activas', value: availablePermissions.length, icon: Lock, color: 'amber' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="card-premium p-6 flex items-center space-x-4"
          >
            <div className={`w-12 h-12 bg-${stat.color === 'brand' ? 'brand' : stat.color + '-600'}/10 rounded-2xl flex items-center justify-center text-${stat.color === 'brand' ? 'brand' : stat.color + '-600'}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card-premium overflow-hidden"
      >
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-medium">
            <div className="inline-block w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin mb-4" />
            <p>Cargando integrantes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Rol</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Permisos</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode='popLayout'>
                  {users.map((user, i) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold mr-3 border border-gray-200 group-hover:bg-brand/10 group-hover:text-brand group-hover:scale-110 transition-all duration-300">
                            {user.name ? user.name.substring(0, 2).toUpperCase() : (user.email.substring(0, 2).toUpperCase())}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors">{user.name || 'Sin nombre'}</p>
                            <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          user.role === 'ADMIN' ? 'bg-brand/10 text-brand border-brand/20' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.map(p => (
                            <span key={p} className="bg-gray-100/50 text-gray-400 text-[9px] px-1.5 py-0.5 rounded border border-gray-100 font-bold uppercase tracking-tighter">
                              {p.replace('manage_', '').replace('view_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
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
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Main Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border border-white/20"
            >
              <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">
                    {editingUser ? 'Editar Integrante' : 'Nuevo Integrante'}
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Configuración de acceso</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nombre</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Nombre Completo"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="email@corporativo.com"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-bold" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                      {editingUser ? 'Nueva Clave (Opcional)' : 'Contraseña Custom'}
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        placeholder={editingUser ? "Sin cambios" : "Auto-generar si vacío"}
                        className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-bold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Rol Maestra</label>
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value as any})}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-bold appearance-none cursor-pointer"
                    >
                      <option value="USER">USUARIO ESTÁNDAR</option>
                      <option value="ADMIN">ADMINISTRADOR TOTAL</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Permisos Granulares</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availablePermissions.map(perm => (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => togglePermission(perm.id)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all text-left ${
                          formData.permissions.includes(perm.id)
                          ? 'bg-brand/5 border-brand text-brand ring-4 ring-brand/5'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-tight">{perm.label}</span>
                        {formData.permissions.includes(perm.id) ? (
                          <div className="bg-brand text-white p-0.5 rounded-full"><Check className="w-3 h-3" /></div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-100" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:bg-gray-100 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-brand text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {editingUser ? 'Sincronizar Cambios' : 'Crear Acceso'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generated Password Modal - SUCCESS */}
      <AnimatePresence>
        {generatedPassword && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-brand/90 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 text-center relative z-10"
             >
                <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-brand/40 animate-bounce">
                  <Sparkles className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">¡Acceso Creado!</h2>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                  El usuario se ha creado correctamente. <br/>
                  Copia esta contraseña temporal y entrégala al integrante.
                </p>

                <div className="relative group mb-8">
                   <div className="absolute -inset-1 bg-brand/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                   <div className="relative flex items-center justify-between px-6 py-5 bg-gray-50 rounded-2xl border-2 border-brand/10">
                      <span className="text-xl font-mono font-black text-brand tracking-widest">{generatedPassword}</span>
                      <button 
                         onClick={() => copyToClipboard(generatedPassword)}
                         className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl hover:bg-brand hover:text-white transition-all active:scale-90"
                      >
                         <Copy className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start text-left mb-8">
                   <AlertCircle className="w-5 h-5 text-amber-600 mr-3 shrink-0 mt-0.5" />
                   <p className="text-xs text-amber-800 font-bold leading-relaxed">
                     NOTA: El sistema obligará al usuario a cambiar esta contraseña en su primer inicio de sesión por motivos de seguridad.
                   </p>
                </div>

                <button
                  onClick={() => {
                    setGeneratedPassword(null);
                    setIsModalOpen(false);
                  }}
                  className="w-full bg-gray-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl"
                >
                  Entendido, cerrar
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
