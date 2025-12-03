const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

async function getAdminToken() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    if (!admin) {
      console.log('No admin user found');
      return;
    }
    console.log('Admin found:', admin.email);
    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    console.log('Token:', token);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

getAdminToken();