import { z } from 'zod';

export const CampaignMetricsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre de la campaña es requerido'),
  spend: z.number().nonnegative('El gasto debe ser un número positivo'),
  cpa: z.number().nonnegative('El CPA debe ser un número positivo'),
  roas: z.number().nonnegative('El ROAS debe ser un número positivo'),
  conversions: z.number().int().nonnegative('Las conversiones deben ser un número entero positivo'),
  status: z.string().optional(),
  platform: z.string().optional(),
});

export type CampaignMetrics = z.infer<typeof CampaignMetricsSchema>;

export const AnalyzeRequestSchema = z.object({
  name: z.string(),
  metrics: CampaignMetricsSchema,
});
