import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, MousePointerClick } from 'lucide-react';

interface KpiData {
  totalSpend: { value: number; trend: number };
  cpa: { value: number; trend: number };
  roas: { value: number; trend: number };
  totalConversions: { value: number; trend: number };
}

export const KpiCards: React.FC<{ data: KpiData }> = ({ data }) => {
  const cards = [
    {
      title: 'Inversión Total',
      value: `$${data.totalSpend.value.toLocaleString()}`,
      trend: data.totalSpend.trend,
      icon: DollarSign,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Costo por Adquisición (CPA)',
      value: `$${data.cpa.value}`,
      trend: data.cpa.trend,
      icon: Target,
      color: 'bg-rose-50 text-rose-600',
      invertTrend: true, // Lower CPA is better
    },
    {
      title: 'ROAS',
      value: `${data.roas.value}x`,
      trend: data.roas.trend,
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Total Conversiones',
      value: data.totalConversions.value.toLocaleString(),
      trend: data.totalConversions.trend,
      icon: MousePointerClick,
      color: 'bg-blue-50 text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositiveTrend = card.trend > 0;
        const isGood = card.invertTrend ? !isPositiveTrend : isPositiveTrend;

        return (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${isGood ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {isPositiveTrend ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(card.trend)}%
              </div>
            </div>
            <span className="text-sm font-medium text-gray-500 mb-1">{card.title}</span>
            <span className="text-2xl font-bold text-gray-900">{card.value}</span>
          </div>
        );
      })}
    </div>
  );
};
