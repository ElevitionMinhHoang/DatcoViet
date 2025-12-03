const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'address'
    `;
    console.log('Result:', result);
    if (result.length > 0) {
      console.log('Column address exists');
    } else {
      console.log('Column address does NOT exist');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();