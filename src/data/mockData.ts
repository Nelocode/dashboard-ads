export type Platform = 'Meta' | 'Google' | 'meta' | 'google';
export type CampaignStatus = 'Active' | 'Paused' | 'active' | 'paused' | 'ARCHIVED';

export interface KpiItem {
  value: number;
  trend: number;
}

export interface KpiData {
  totalSpend: KpiItem;
  cpa: KpiItem;
  roas: KpiItem;
  totalConversions: KpiItem;
}

export interface Campaign {
  id: string;
  platform: Platform;
  name: string;
  status: CampaignStatus;
  dailyBudget: number;
  spend: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
}

export const kpiData: KpiData = {
  totalSpend: { value: 45230, trend: +12.5 },
  cpa: { value: 12.4, trend: -3.2 },
  roas: { value: 3.8, trend: +0.5 },
  totalConversions: { value: 3645, trend: +15.2 },
};

export const chartData = [
  { date: 'Mon', metaSpend: 4000, googleSpend: 2400, metaConv: 240, googleConv: 140 },
  { date: 'Tue', metaSpend: 3000, googleSpend: 1398, metaConv: 2210, googleConv: 120 },
  { date: 'Wed', metaSpend: 2000, googleSpend: 9800, metaConv: 2290, googleConv: 800 },
  { date: 'Thu', metaSpend: 2780, googleSpend: 3908, metaConv: 2000, googleConv: 278 },
  { date: 'Fri', metaSpend: 1890, googleSpend: 4800, metaConv: 2181, googleConv: 189 },
  { date: 'Sat', metaSpend: 2390, googleSpend: 3800, metaConv: 2500, googleConv: 239 },
  { date: 'Sun', metaSpend: 3490, googleSpend: 4300, metaConv: 2100, googleConv: 349 },
];

export const mockCampaigns: Campaign[] = [
  { id: '1', platform: 'Meta', name: 'Retargeting_Q4_All', status: 'Active', dailyBudget: 150, spend: 1450, clicks: 3200, ctr: 2.1, conversions: 120, cpa: 12.08 },
  { id: '2', platform: 'Google', name: 'Search_Brand_Keywords', status: 'Active', dailyBudget: 300, spend: 2800, clicks: 5120, ctr: 8.5, conversions: 450, cpa: 6.22 },
  { id: '3', platform: 'Meta', name: 'Lookalike_1%_Purchasers', status: 'Active', dailyBudget: 250, spend: 2200, clicks: 1800, ctr: 1.2, conversions: 85, cpa: 25.88 },
  { id: '4', platform: 'Google', name: 'PerformanceMax_Main_Products', status: 'Active', dailyBudget: 500, spend: 4500, clicks: 8200, ctr: 3.4, conversions: 310, cpa: 14.51 },
  { id: '5', platform: 'Meta', name: 'Video_Awareness_TopFunnel', status: 'Paused', dailyBudget: 100, spend: 850, clicks: 4500, ctr: 1.8, conversions: 12, cpa: 70.83 },
  { id: '6', platform: 'Google', name: 'Display_Remarketing_Cart', status: 'Active', dailyBudget: 80, spend: 650, clicks: 1200, ctr: 0.9, conversions: 55, cpa: 11.81 },
];
