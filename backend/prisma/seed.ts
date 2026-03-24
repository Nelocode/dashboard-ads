import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Limpiar base de datos
  await prisma.campaignCache.deleteMany();
  await prisma.adAccount.deleteMany();
  await prisma.userCompany.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  
  // Crear Usuario Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dashads.com',
      password: hashedPassword,
      name: 'Nelson Admin',
      role: 'ADMIN',
      permissions: JSON.stringify(['view_all', 'manage_users', 'manage_config', 'manage_companies']),
      skin: 'midnight'
    }
  });

  // Crear Empresa de Prueba
  const company = await prisma.company.create({
    data: {
      name: 'Agencia Digital Pro',
      logo: 'https://placehold.co/100x100?text=AD'
    }
  });

  // Vincular Admin a Empresa
  await prisma.userCompany.create({
    data: {
      userId: admin.id,
      companyId: company.id
    }
  });

  // Crear Cuenta de Anuncios Mock
  const adAccount = await prisma.adAccount.create({
    data: {
      platform: 'meta',
      accountId: 'act_123456789',
      accountName: 'Cuenta Principal Meta',
      accessToken: 'eaab_mock_token',
      companyId: company.id
    }
  });

  // Crear Campañas
  await prisma.campaignCache.createMany({
    data: [
      {
        platform: 'meta',
        externalId: 'meta_1',
        name: 'Venta Directa - Colección Primavera',
        status: 'Active',
        dailyBudget: 50.0,
        spend: 1240.5,
        clicks: 850,
        ctr: 2.1,
        conversions: 45,
        cpa: 27.5,
        date: new Date(),
        adAccountId: adAccount.id
      },
      {
        platform: 'meta',
        externalId: 'meta_2',
        name: 'Retargeting - Carrito Abandonado',
        status: 'Active',
        dailyBudget: 30.0,
        spend: 600.0,
        clicks: 320,
        ctr: 4.8,
        conversions: 112,
        cpa: 5.35,
        date: new Date(),
        adAccountId: adAccount.id
      }
    ]
  });

  console.log('Base de datos sembrada con éxito. Usuario: admin@dashads.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
