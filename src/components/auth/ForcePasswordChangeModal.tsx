import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, X, ShieldAlert, KeyRound, Eye, EyeOff, Sparkles } from 'lucide-react';
import { changePassword } from '../../lib/api';
import toast from 'react-hot-toast';

interface Props {
  onSuccess: (updatedUser: any) => void;
  user: any;
}

export const ForcePasswordChangeModal: React.FC<Props> = ({ onSuccess, user }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation Logic
  const validations = {
    length: newPassword.length >= 8,
    hasNumber: /\d/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    match: newPassword === confirmPassword && newPassword !== ''
  };

  const isFormValid = Object.values(validations).every(v => v === true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await changePassword({ newPassword });
      toast.success('¡Contraseña actualizada con éxito!', {
         icon: '🚀',
         style: { borderRadius: '15px', background: '#333', color: '#fff' }
      });
      
      // Update local user object
      const updatedUser = { ...user, requiresPasswordChange: false };
      onSuccess(updatedUser);
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ label, met }: { label: string; met: boolean }) => (
    <div className={`flex items-center space-x-2 text-xs font-bold transition-colors ${met ? 'text-emerald-500' : 'text-gray-400'}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${met ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200'}`}>
        {met && <Check className="w-2.5 h-2.5" />}
      </div>
      <span className="uppercase tracking-tight">{label}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Heavy Backdrop Blur for focus */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl"
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-white/20"
      >
        <div className="relative p-10">
           {/* Top Icon */}
           <div className="w-20 h-20 bg-brand/10 text-brand rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
              <KeyRound className="w-10 h-10" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-brand/20 rounded-3xl"
              />
           </div>

           <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Seguridad Requerida</h2>
              <p className="text-sm text-gray-500 font-medium mt-2 px-4">
                Detectamos que estás usando una clave temporal. Para proteger tu cuenta de 7secMedia, debes definir una nueva contraseña.
              </p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nueva Contraseña</label>
                 <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-bold"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirmar Contraseña</label>
                 <input 
                   type="password"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   placeholder="••••••••"
                   className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-bold"
                 />
              </div>

              {/* Status Validations */}
              <div className="bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100 grid grid-cols-2 gap-y-3">
                 <ValidationItem label="8+ Caracteres" met={validations.length} />
                 <ValidationItem label="Incluye Número" met={validations.hasNumber} />
                 <ValidationItem label="Carácter Especial" met={validations.hasSpecial} />
                 <ValidationItem label="Coinciden" met={validations.match} />
              </div>

              <button 
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all relative overflow-hidden group ${
                  isFormValid && !loading 
                  ? 'bg-brand text-white shadow-brand/20 hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                   <span className="flex items-center justify-center">
                     Actualizar Acceso
                     <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                   </span>
                )}
              </button>
           </form>
        </div>
        
        {/* Decorative Footer */}
        <div className="bg-gray-50 p-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100">
           7SEC MEDIA SECURITY SYSTEM V2.0
        </div>
      </motion.div>
    </div>
  );
};
