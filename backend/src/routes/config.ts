import { Router } from 'express';
import { prisma } from '../index';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

// Get config for all platforms
router.get('/', async (req, res, next) => {
  try {
    const configs = await prisma.platformConfig.findMany();
    res.json(ApiResponse.success(configs));
  } catch (error) {
    next(error);
  }
});

// Get or create config for a platform
router.post('/', async (req, res, next) => {
  try {
    const { platform, clientId, clientSecret, developerToken } = req.body;
    
    const config = await prisma.platformConfig.upsert({
      where: { platform },
      update: { clientId, clientSecret, developerToken },
      create: { platform, clientId, clientSecret, developerToken },
    });
    
    res.json(ApiResponse.success(config));
  } catch (error) {
    next(error);
  }
});

// Get active AI Config
router.get('/ai', async (req, res, next) => {
  try {
    let config = await prisma.aiConfig.findFirst({
      where: { isActive: true }
    });
    
    // Default to ollama if none active
    if (!config) {
      config = await prisma.aiConfig.upsert({
        where: { provider: 'ollama' },
        update: { isActive: true },
        create: { provider: 'ollama', isActive: true, modelName: 'qwen2.5-coder:latest' }
      });
    }
    
    res.json(ApiResponse.success(config));
  } catch (error) {
    next(error);
  }
});

// Update AI Config
router.post('/ai', async (req, res, next) => {
  try {
    const { provider, apiKey, modelName } = req.body;
    
    // Deactivate all first
    await prisma.aiConfig.updateMany({
      data: { isActive: false }
    });

    const config = await prisma.aiConfig.upsert({
      where: { provider },
      update: { apiKey, modelName, isActive: true },
      create: { provider, apiKey, modelName, isActive: true },
    });
    
    res.json(ApiResponse.success(config));
  } catch (error) {
    next(error);
  }
});

export default router;
