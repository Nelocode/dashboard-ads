import axios from 'axios';
import { prisma } from '../index';

// Constantes de API
const META_API_BASE = 'https://graph.facebook.com/v19.0';
const GOOGLE_ADS_API_BASE = 'https://googleads.googleapis.com/v15';

export const syncAllAccounts = async () => {
  const accounts = await prisma.adAccount.findMany();
  console.log(`[SyncService]: Iniciando sincronización para ${accounts.length} cuentas.`);

  for (const account of accounts) {
    try {
      if (account.platform === 'meta') {
        await syncMetaCampaigns(account);
      } else if (account.platform === 'google') {
        await syncGoogleCampaigns(account);
      }
    } catch (error) {
      console.error(`[SyncService]: Error sincronizando cuenta ${account.accountId}:`, error);
    }
  }
};

const syncMetaCampaigns = async (account: any) => {
  try {
    // Obtenemos campañas con insights del último periodo (7 días por defecto)
    const response = await axios.get(`${META_API_BASE}/${account.accountId}/campaigns`, {
      params: {
        access_token: account.accessToken,
        fields: 'id,name,status,daily_budget,insights.date_preset(last_7d){spend,clicks,conversions,ctr,inline_link_click_ctr,cpc}',
      },
    });

    const campaigns = response.data.data;

    for (const camp of campaigns) {
      const insight = camp.insights?.data?.[0] || {};
      
      await prisma.campaignCache.upsert({
        where: { externalId: camp.id },
        update: {
          name: camp.name,
          status: camp.status,
          dailyBudget: parseFloat(camp.daily_budget) || 0,
          spend: parseFloat(insight.spend) || 0,
          clicks: parseInt(insight.clicks) || 0,
          ctr: parseFloat(insight.ctr) || 0,
          conversions: parseInt(insight.conversions?.[0]?.value) || 0, // Meta suele devolver un array en conversions
          cpa: parseFloat(insight.spend) / (parseInt(insight.conversions?.[0]?.value) || 1),
          adAccountId: account.id,
        },
        create: {
          platform: 'meta',
          externalId: camp.id,
          name: camp.name,
          status: camp.status,
          dailyBudget: parseFloat(camp.daily_budget) || 0,
          spend: parseFloat(insight.spend) || 0,
          clicks: parseInt(insight.clicks) || 0,
          ctr: parseFloat(insight.ctr) || 0,
          conversions: parseInt(insight.conversions?.[0]?.value) || 0,
          cpa: parseFloat(insight.spend) / (parseInt(insight.conversions?.[0]?.value) || 1),
          date: new Date(),
          adAccountId: account.id,
        },
      });
    }
  } catch (error: any) {
    console.error(`[SyncMeta]: Error en cuenta ${account.accountId}:`, error.response?.data || error.message);
    throw error;
  }
};

const syncGoogleCampaigns = async (account: any) => {
  // Google Ads API requiere un proceso más complejo con GAQL
  // En este MVP simplificado, mostramos la estructura base
  console.log(`[SyncService]: Sincronizando Google Ads para ${account.accountId}`);
  // Aquí iría la llamada a fetch con el Developer Token y OAuth
};
