const prisma = require('./src/config/database');

async function main() {
  const users = await prisma.user.findMany({ include: { patient: true } });
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
