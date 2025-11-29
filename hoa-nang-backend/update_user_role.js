const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUserRole() {
  try {
    // Update user with ID 22 to ADMIN role
    const updatedUser = await prisma.user.update({
      where: { id: 22 },
      data: { role: 'ADMIN' },
    });
    
    console.log('User updated successfully:', {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();