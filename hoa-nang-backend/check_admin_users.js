const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdminUsers() {
  try {
    console.log('=== Checking Admin Users ===');
    
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true }
    });
    
    console.log(`Total users: ${users.length}`);
    console.log('\n=== All Users ===');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Role: ${user.role}`);
    });
    
    const adminUsers = users.filter(user => user.role === 'ADMIN');
    console.log(`\n=== Admin Users: ${adminUsers.length} ===`);
    adminUsers.forEach(user => {
      console.log(`ID: ${user.id}, Email: ${user.email}, Name: ${user.name}`);
    });
    
    if (adminUsers.length === 0) {
      console.log('\n⚠️  No admin users found! Creating one...');
      
      // Create an admin user
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@hoanang.com',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          name: 'Admin User',
          role: 'ADMIN',
          phone: '0123456789'
        }
      });
      
      console.log('✅ Created admin user:', newAdmin);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUsers();