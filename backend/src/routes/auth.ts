import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { 
  getGoogleAuthUrl, 
  getMetaAuthUrl, 
  exchangeCodeForTokens, 
  saveAdAccount,
  getPlatformConfig
} from '../services/authService';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'supersecret';

// Real login logic
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json(ApiResponse.error('INVALID_CREDENTIALS', 'Email o contraseña incorrectos'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(ApiResponse.error('INVALID_CREDENTIALS', 'Email o contraseña incorrectos'));
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        permissions: JSON.parse(user.permissions),
        skin: user.skin
      }, 
      process.env.JWT_SECRET || 'supersecret', 
      { expiresIn: '24h' }
    );

    return res.json(ApiResponse.success({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        skin: user.skin,
        permissions: JSON.parse(user.permissions)
      } 
    }));
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(ApiResponse.error('SERVER_ERROR', 'Error interno del servidor'));
  }
});

// OAuth Initialization
router.get('/connect/:platform', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { platform } = req.params;
    const { companyId } = req.query; // El frontend debe pasar la empresa seleccionada

    if (!companyId) {
      return res.status(400).json(ApiResponse.error('VALIDATION_ERROR', 'Debes seleccionar una empresa antes de conectar'));
    }

    const config = await getPlatformConfig(platform as string);
    const redirectUri = `http://localhost:3001/api/auth/callback/${platform}`;
    
    // Pasamos companyId en el parámetro 'state' de OAuth para recuperarlo en el callback
    const state = JSON.stringify({ companyId });
    const authUrl = (platform as string) === 'google' 
      ? getGoogleAuthUrl(config.clientId, redirectUri) + `&state=${encodeURIComponent(state)}`
      : getMetaAuthUrl(config.clientId, redirectUri) + `&state=${encodeURIComponent(state)}`;
      
    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
});

// OAuth Callback
router.get('/callback/:platform', async (req: Request, res: Response, next: NextFunction) => {
  const { platform } = req.params;
  const { code, state } = req.query;
  
  if (!code || !state) {
    return res.status(400).json(ApiResponse.error('AUTH_ERROR', 'Faltan parámetros de autenticación'));
  }

  try {
    const { companyId } = JSON.parse(state as string);
    const config = await getPlatformConfig(platform as string);
    const redirectUri = `http://localhost:3001/api/auth/callback/${platform}`;

    const tokens = await exchangeCodeForTokens(
      platform as 'google' | 'meta', 
      code as string, 
      config.clientId, 
      config.clientSecret, 
      redirectUri
    );

    // En un MVP real, aquí obtendríamos el ID de la cuenta de Ads usando el token recién obtenido
    const accountId = platform === 'google' ? `google-acc-${Date.now()}` : `meta-acc-${Date.now()}`;
    const accountName = platform === 'google' ? 'Google Ads Account' : 'Meta Marketing Account';

    await saveAdAccount(
      platform as string,
      accountId,
      accountName,
      tokens.access_token,
      companyId as string,
      tokens.refresh_token
    );

    // Redirigir de vuelta al frontend con éxito
    res.redirect(`http://localhost:5173/integrations?status=success&companyId=${companyId}`);
  } catch (error) {
    next(error);
  }
});

export default router;
