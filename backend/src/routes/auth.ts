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

    let permissions = [];
    try {
      permissions = JSON.parse(user.permissions || '[]');
    } catch (e) {
      console.error('Error parsing user permissions:', e);
      permissions = [];
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        permissions,
        skin: user.skin
      }, 
      SECRET, 
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
        permissions,
        requiresPasswordChange: user.requiresPasswordChange
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
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const redirectUri = `${protocol}://${host}/api/auth/callback/${platform}`;
    
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
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const redirectUri = `${protocol}://${host}/api/auth/callback/${platform}`;

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
    res.redirect(`/integrations?status=success&companyId=${companyId}`);
  } catch (error) {
    next(error);
  }
});

// Change Password
router.post('/change-password', async (req: Request, res: Response): Promise<any> => {
  const { currentPassword, newPassword } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json(ApiResponse.error('UNAUTHORIZED', 'No autorizado'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(404).json(ApiResponse.error('NOT_FOUND', 'Usuario no encontrado'));
    }

    // Si viene de una clave temporal generada, podríamos saltarnos el check de currentPassword
    // pero por seguridad es mejor pedirla si el usuario la conoce.
    // Para simplificar el flujo de "primer login", permitiremos omitir currentPassword si requiresPasswordChange es true.
    if (user.requiresPasswordChange) {
       // Ok, solo pedimos la nueva
    } else {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json(ApiResponse.error('INVALID_CREDENTIALS', 'La contraseña actual es incorrecta'));
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        requiresPasswordChange: false
      }
    });

    return res.json(ApiResponse.success(null, 'Contraseña actualizada con éxito'));
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json(ApiResponse.error('SERVER_ERROR', 'Error al cambiar la contraseña'));
  }
});

export default router;
