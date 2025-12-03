const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createChatTables() {
  try {
    console.log('Creating chat tables...');
    
    // Create ChatStatus enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "ChatStatus" AS ENUM ('ACTIVE', 'CLOSED', 'ARCHIVED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    // Create ChatRoom table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ChatRoom" (
        "id" SERIAL NOT NULL,
        "userId" INTEGER NOT NULL,
        "status" "ChatStatus" NOT NULL DEFAULT 'ACTIVE',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
      );
    `;
    
    // Create ChatMessage table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ChatMessage" (
        "id" SERIAL NOT NULL,
        "roomId" INTEGER NOT NULL,
        "senderId" INTEGER NOT NULL,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
      );
    `;
    
    // Add foreign key constraints
    await prisma.$executeRaw`
      DO $$ BEGIN
        ALTER TABLE "ChatRoom"
        ADD CONSTRAINT "ChatRoom_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await prisma.$executeRaw`
      DO $$ BEGIN
        ALTER TABLE "ChatMessage"
        ADD CONSTRAINT "ChatMessage_roomId_fkey"
        FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await prisma.$executeRaw`
      DO $$ BEGIN
        ALTER TABLE "ChatMessage"
        ADD CONSTRAINT "ChatMessage_senderId_fkey"
        FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    console.log('✅ Chat tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating chat tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createChatTables();