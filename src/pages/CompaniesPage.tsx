import React, { useState, useEffect } from 'react';
import { Building2, Plus, Users, ArrowRight, X, Globe, Trash2 } from 'lucide-react';
import api, { getCompanyDetails, deleteAccount } from '../lib/api';
import toast from 'react-hot-toast';

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [companyDetails, setCompanyDetails] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data: any = await api.get('/companies');
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    try {
      await api.post('/companies', { name: newCompanyName });
      setNewCompanyName('');
      fetchCompanies();
      toast.success('Empresa creada correctamente');
    } catch (error) {
       toast.error('Error al crear empresa');
    }
  };

  const handleOpenAccountsModal = async (company: any) => {
    setSelectedCompany(company);
    setIsLoadingDetails(true);
    try {
      const details = await getCompanyDetails(company.id);
      setCompanyDetails(details);
    } catch (error) {
      toast.error('Error al cargar cuentas de la empresa');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('¿Estás seguro de que deseas desvincular esta cuenta? Todos los datos sincronizados se perderán.')) {
      try {
        await deleteAccount(accountId);
        toast.success('Cuenta desvinculada');
        // Refresh details
        const details = await getCompanyDetails(selectedCompany.id);
        setCompanyDetails(details);
        fetchCompanies(); // To update the counts
      } catch (error) {
        toast.error('Error al desvincular cuenta');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand/10 rounded-lg text-brand">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
        </div>
        
        <form onSubmit={handleCreateCompany} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nombre de la nueva empresa..." 
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand/5 focus:border-brand w-64 text-sm font-medium transition-all"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-brand text-white px-5 py-2 rounded-xl font-bold text-sm hover:scale-[1.02] shadow-lg shadow-brand/20 transition-all flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Empresa
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-500">Cargando empresas...</div>
        ) : companies.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium whitespace-pre-wrap">No tienes empresas creadas aún.\nEmpieza añadiendo una arriba.</p>
          </div>
        ) : (
          companies.map((company) => (
            <div key={company.id} className="card-premium p-6 hover:shadow-2xl transition-all group flex flex-col justify-between h-48">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-brand/30">
                    {company.name.charAt(0)}
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] font-black text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-gray-100">
                    <Users className="w-3 h-3" />
                    <span>{company._count?.accounts || 0} Cuentas</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand transition-colors tracking-tight">{company.name}</h3>
              </div>
              
              <button
                onClick={() => handleOpenAccountsModal(company)}
                className="mt-4 flex items-center text-sm font-bold text-gray-400 group-hover:text-brand transition-all"
              >
                Administrar Cuentas
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Accounts Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {selectedCompany.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">Cuentas Vinculadas</h2>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{selectedCompany.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-gray-200 rounded-xl transition-all">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {isLoadingDetails ? (
                <div className="py-20 text-center text-gray-400">Cargando integraciones...</div>
              ) : companyDetails?.accounts?.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Globe className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm font-medium">Esta empresa no tiene cuentas conectadas.</p>
                  <p className="text-xs text-gray-400 mt-1">Ve a la sección de Integraciones para conectar una.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {companyDetails?.accounts?.map((acc: any) => (
                    <div key={acc.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand/30 transition-all hover:bg-gray-50/30 group">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                          acc.platform === 'meta' ? 'bg-gradient-to-br from-blue-600 to-blue-400' : 'bg-gradient-to-br from-rose-500 to-rose-400'
                        }`}>
                          {acc.platform.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{acc.name || 'Cuenta sin nombre'}</p>
                          <div className="flex items-center mt-0.5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">ID: {acc.platformId}</span>
                            <span className="mx-2 w-1 h-1 bg-gray-200 rounded-full"></span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-brand">{acc.platform} Ads</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDeleteAccount(acc.id)}
                          className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Desvincular Cuenta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedCompany(null)}
                className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
