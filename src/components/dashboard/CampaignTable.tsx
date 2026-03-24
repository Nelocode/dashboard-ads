import { useState } from 'react';
import { ArrowUpDown, Play, Pause, Zap } from 'lucide-react';
import type { Campaign, Platform } from '../../data/mockData';

interface TableProps {
  campaigns: Campaign[];
  onAnalyze: (campaign: Campaign) => void;
}

export const CampaignTable: React.FC<TableProps> = ({ campaigns, onAnalyze }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Campaign; direction: 'ascending' | 'descending' } | null>(null);

  const reactStableSort = (array: Campaign[], config: { key: keyof Campaign; direction: 'ascending' | 'descending' } | null) => {
    if (!config) return array;
    return [...array].sort((a, b) => {
      if (a[config.key] < b[config.key]) return config.direction === 'ascending' ? -1 : 1;
      if (a[config.key] > b[config.key]) return config.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  };

  const requestSort = (key: keyof Campaign) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCampaigns = reactStableSort(campaigns, sortConfig);

  const getPlatformIcon = (platform: Platform) => {
    const p = platform.toLowerCase();
    if (p === 'meta') {
      return (
        <div className="w-6 h-6 rounded-md bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold" title="Meta Ads">
          M
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-md bg-[#4285F4] text-white flex items-center justify-center text-xs font-bold" title="Google Ads">
        G
      </div>
    );
  };

  const renderSortableHeader = (label: string, key: keyof Campaign) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => requestSort(key)}
    >
      <div className="flex items-center">
        {label}
        <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Rendimiento de Campañas</h2>
        <span className="text-sm text-gray-500 font-medium">{campaigns.length} campañas activas</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Red</th>
              {renderSortableHeader('Campaña', 'name')}
              {renderSortableHeader('Estado', 'status')}
              {renderSortableHeader('Pdto Diario', 'dailyBudget')}
              {renderSortableHeader('Inversión', 'spend')}
              {renderSortableHeader('Clics', 'clicks')}
              {renderSortableHeader('CTR %', 'ctr')}
              {renderSortableHeader('Conv.', 'conversions')}
              {renderSortableHeader('CPA', 'cpa')}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-36">Acción AI</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  {getPlatformIcon(campaign.platform)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{campaign.name}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status === 'Active' ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                    {campaign.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">${campaign.dailyBudget}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${campaign.spend}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{campaign.clicks.toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{campaign.ctr}%</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">{campaign.conversions}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${campaign.cpa}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onAnalyze(campaign)}
                    className="inline-flex items-center justify-center px-3 py-1.5 border border-purple-200 text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Analizar IA
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
