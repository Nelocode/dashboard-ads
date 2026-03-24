import React, { useState, useEffect } from 'react';
import { Building2, Plus, Users, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data: any = await api.get('/companies');
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
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
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
        </div>
        
        <form onSubmit={handleCreateCompany} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Nombre de la nueva empresa..." 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64 text-sm"
            value={newCompanyName}
            onChange={(e) => setNewCompanyName(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center"
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
            <div key={company.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-48">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold">
                    {company.name.charAt(0)}
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase">
                    <Users className="w-3 h-3" />
                    <span>{company._count?.accounts || 0} Cuentas</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
              </div>
              
              <button
                onClick={() => alert(`Administrando cuentas para: ${company.name}`)}
                className="mt-4 flex items-center text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors"
              >
                Administrar Cuentas
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
