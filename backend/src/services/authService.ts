import axios from 'axios';
import prisma from '../lib/prisma';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const META_AUTH_URL = 'https://www.facebook.com/v19.0/dialog/oauth';
const META_TOKEN_URL = 'https://graph.facebook.com/v19.0/oauth/access_token';

export const getGoogleAuthUrl = (clientId: string, redirectUri: string) => {
  const scope = 'https://www.googleapis.com/auth/adwords';
  return `${GOOGLE_AUTH_URL}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
};

export const getMetaAuthUrl = (clientId: string, redirectUri: string) => {
  const scope = 'ads_read,ads_management';
  return `${META_AUTH_URL}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
};

export const exchangeCodeForTokens = async (
  platform: 'google' | 'meta',
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
) => {
  if (platform === 'google') {
    const response = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });
    return response.data; // access_token, refresh_token, expires_in
  } else {
    const response = await axios.get(META_TOKEN_URL, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      },
    });
    return response.data; // access_token, expires_in
  }
};

export const refreshGoogleToken = async (
  refreshToken: string,
  clientId: string,
  clientSecret: string
) => {
  const response = await axios.post(GOOGLE_TOKEN_URL, {
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });
  return response.data; // access_token, expires_in
};

export const saveAdAccount = async (
  platform: string,
  accountId: string,
  accountName: string,
  accessToken: string,
  companyId: string,
  refreshToken?: string
) => {
  return await prisma.adAccount.upsert({
    where: { accountId },
    update: {
      accessToken,
      refreshToken,
      accountName,
    },
    create: {
      platform,
      accountId,
      accountName,
      accessToken,
      refreshToken,
      companyId,
    },
  });
};

export const getPlatformConfig = async (platform: string) => {
  const config = await prisma.platformConfig.findUnique({
    where: { platform }
  });
  
  if (config) return config;

  // Fallback a variables de entorno si no hay configuración en DB
  const envPrefix = platform.toUpperCase(); // META o GOOGLE
  const clientId = process.env[`${envPrefix}_CLIENT_ID`];
  const clientSecret = process.env[`${envPrefix}_CLIENT_SECRET`];

  if (clientId && clientSecret) {
    return {
      platform,
      clientId,
      clientSecret,
      developerToken: process.env[`${envPrefix}_DEVELOPER_TOKEN`] || null
    };
  }

  throw new Error(`Configuración no encontrada para la plataforma: ${platform}. Por favor, configura CLIENT_ID y CLIENT_SECRET en el archivo .env o en la base de datos.`);
};
