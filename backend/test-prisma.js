const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('USUARIOS EN DB:', users.map(u => ({ email: u.email, role: u.role, skin: u.skin })));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
