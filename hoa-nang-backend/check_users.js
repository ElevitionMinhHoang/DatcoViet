const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    
    const users = await prisma.user.findMany();
    
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Role: ${user.role}`);
    });
    
    if (users.length === 0) {
      console.log('No users found. Creating test user...');
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: '$2b$10$examplepasswordhash', // This will be hashed properly in auth service
          name: 'Test User',
          phone: '0123456789',
          role: 'CUSTOMER'
        }
      });
      
      console.log('Test user created:', testUser);
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();