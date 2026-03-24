import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

// Get performance KPIs
router.get('/kpis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Standard structure for KPIs
    const kpis = {
      totalSpend: { value: 45230, trend: +12.5 },
      cpa: { value: 12.4, trend: -3.2 },
      roas: { value: 3.8, trend: +0.5 },
      totalConversions: { value: 3645, trend: +15.2 },
    };
    
    res.json(ApiResponse.success(kpis));
  } catch (error) {
    next(error);
  }
});

import { syncAllAccounts } from '../services/syncService';

// Get all campaigns
router.get('/campaigns', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaigns = await prisma.campaignCache.findMany({
      include: { adAccount: true },
      orderBy: { spend: 'desc' }
    });
    res.json(ApiResponse.success(campaigns));
  } catch (error) {
    next(error);
  }
});

// Trigger manual sync for all accounts
router.post('/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await syncAllAccounts();
    res.json(ApiResponse.success({ message: 'Sincronización completada con éxito' }));
  } catch (error) {
    next(error);
  }
});

export default router;
