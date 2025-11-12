import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
        email: 'user@example.com',
        password: hashedPassword,
        role: Role.USER,
    },
  });

  await prisma.user.create({
    data: {
      email: 'shipper@example.com',
      password: hashedPassword,
      role: Role.SHIPPER,
    },
  });

  await prisma.menu.createMany({
    data: [
      {
        name: 'Mâm Cỗ Truyền Thống',
        price: 1500000,
        category: 'Mâm Cỗ',
        image: 'https://example.com/mam-co-truyen-thong.jpg',
      },
      {
        name: 'Mâm Cỗ Đặc Biệt',
        price: 2500000,
        category: 'Mâm Cỗ',
        image: 'https://example.com/mam-co-dac-biet.jpg',
      },
      {
        name: 'Gà Luộc',
        price: 250000,
        category: 'Món Ăn',
        image: 'https://example.com/ga-luoc.jpg',
      },
      {
        name: 'Xôi Gấc',
        price: 100000,
        category: 'Món Ăn',
        image: 'https://example.com/xoi-gac.jpg',
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
