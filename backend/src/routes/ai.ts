import { Router, Request, Response, NextFunction } from 'express';
import { analyzeCampaignData } from '../services/aiService';
import { AnalyzeRequestSchema } from '../schemas/validation';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

router.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { name, metrics } = AnalyzeRequestSchema.parse(req.body);
    
    const analysis = await analyzeCampaignData(name, metrics);
    res.json(ApiResponse.success(analysis));
  } catch (error) {
    next(error);
  }
});

export default router;
