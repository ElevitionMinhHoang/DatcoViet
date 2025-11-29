const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createContactTable() {
  try {
    console.log('Creating Contact table...');
    
    // Create table using raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Contact" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
      );
    `;
    
    console.log('Contact table created successfully!');
    
    // Test the table
    const testContact = await prisma.contact.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      }
    });
    
    console.log('Test contact created:', testContact);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createContactTable();