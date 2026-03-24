import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartProps {
  data: any[];
}

export const PerformanceChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Inversión vs Conversiones</h2>
          <p className="text-sm text-gray-500">Comparativa de rendimiento por plataforma</p>
        </div>
        <div className="flex space-x-2">
          {/* Custom legends could go here if not using Recharts standard */}
        </div>
      </div>
      
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1877F2" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1877F2" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4285F4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} tickFormatter={(value) => `$${value}`} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={10} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            
            <Area yAxisId="left" type="monotone" name="Inversión Meta" dataKey="metaSpend" stroke="#1877F2" strokeWidth={3} fillOpacity={1} fill="url(#colorMeta)" />
            <Area yAxisId="left" type="monotone" name="Inversión Google" dataKey="googleSpend" stroke="#4285F4" strokeWidth={3} fillOpacity={1} fill="url(#colorGoogle)" />
            
            <Area yAxisId="right" type="step" name="Conv. Meta" dataKey="metaConv" stroke="#1052A3" strokeWidth={2} fill="none" strokeDasharray="4 4" />
            <Area yAxisId="right" type="step" name="Conv. Google" dataKey="googleConv" stroke="#1A73E8" strokeWidth={2} fill="none" strokeDasharray="4 4" />
            
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
