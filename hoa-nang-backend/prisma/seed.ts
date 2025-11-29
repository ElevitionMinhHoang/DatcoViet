import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.menu.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '0123456789',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
        email: 'user@example.com',
        password: hashedPassword,
        name: 'Regular User',
        phone: '0987654321',
        role: 'USER',
    },
  });

  await prisma.user.create({
    data: {
      email: 'shipper@example.com',
      password: hashedPassword,
      name: 'Shipper User',
      phone: '0912345678',
      role: 'SHIPPER',
    },
  });

  await prisma.menu.createMany({
    data: [
      // Món khai vị
      {
        name: 'Nem rán',
        price: 50000,
        category: 'Khai vị',
        image: '/images/dishes/nem_ran.jpg',
        isActive: true,
      },
      {
        name: 'Gỏi cuốn tôm thịt',
        price: 60000,
        category: 'Khai vị',
        image: '/images/dishes/goi_cuon_tom_thit.jpg',
        isActive: true,
      },
      {
        name: 'Chả giò chay',
        price: 40000,
        category: 'Khai vị',
        image: '/images/dishes/cha_gio_chay.jpg',
        isActive: true,
      },
      {
        name: 'Bò bía',
        price: 45000,
        category: 'Khai vị',
        image: '/images/dishes/bo_bia.jpg',
        isActive: true,
      },
      // Món chính
      {
        name: 'Thịt kho trứng',
        price: 45000,
        category: 'Món chính',
        image: '/images/dishes/thit_kho_trung.jpg',
        isActive: true,
      },
      {
        name: 'Cá kho tộ',
        price: 55000,
        category: 'Món chính',
        image: '/images/dishes/ca_kho_to.jpg',
        isActive: true,
      },
      {
        name: 'Gà rang muối',
        price: 65000,
        category: 'Món chính',
        image: '/images/dishes/ga_rang_muoi.jpg',
        isActive: true,
      },
      {
        name: 'Tôm rim mặn ngọt',
        price: 75000,
        category: 'Món chính',
        image: '/images/dishes/tom_rim_man_ngot.jpg',
        isActive: true,
      },
      {
        name: 'Bò xào hành tây',
        price: 85000,
        category: 'Món chính',
        image: '/images/dishes/bo_xao_hanh_tay.jpg',
        isActive: true,
      },
      {
        name: 'Cá chiên xù',
        price: 60000,
        category: 'Món chính',
        image: '/images/dishes/ca_chien_xu.jpg',
        isActive: true,
      },
      // Món phụ
      {
        name: 'Xôi ngũ sắc',
        price: 100000,
        category: 'Món phụ',
        image: '/images/dishes/xoi_ngu_sac.jpg',
        isActive: true,
      },
      {
        name: 'Cơm trắng',
        price: 20000,
        category: 'Món phụ',
        image: '/images/dishes/com_trang.jpg',
        isActive: true,
      },
      {
        name: 'Bánh mì',
        price: 5000,
        category: 'Món phụ',
        image: '/images/dishes/banh_mi.jpg',
        isActive: true,
      },
      {
        name: 'Rau muống xào tỏi',
        price: 20000,
        category: 'Món phụ',
        image: '/images/dishes/rau_muong_xao_toi.jpg',
        isActive: true,
      },
      // Món tráng miệng
      {
        name: 'Chè đậu đen',
        price: 15000,
        category: 'Tráng miệng',
        image: '/images/dishes/che_dau_den.jpg',
        isActive: true,
      },
      {
        name: 'Bánh flan',
        price: 20000,
        category: 'Tráng miệng',
        image: '/images/dishes/banh_flan.jpg',
        isActive: true,
      },
      {
        name: 'Trái cây theo mùa',
        price: 40000,
        category: 'Tráng miệng',
        image: '/images/dishes/trai_cay_theo_mua.jpg',
        isActive: true,
      },
      {
        name: 'Kem dừa',
        price: 20000,
        category: 'Tráng miệng',
        image: '/images/dishes/kem_dua.jpg',
        isActive: true,
      },
      // Đồ uống
      {
        name: 'Trà đá',
        price: 5000,
        category: 'Đồ uống',
        image: '/images/drinks/tra_da.jpg',
        isActive: true,
      },
      {
        name: 'Trà sen',
        price: 25000,
        category: 'Đồ uống',
        image: '/images/drinks/tra_sen.jpg',
        isActive: true,
      },
      {
        name: 'Nước cam ép',
        price: 35000,
        category: 'Đồ uống',
        image: '/images/drinks/nuoc_cam_ep.jpg',
        isActive: true,
      },
      {
        name: 'Sinh tố bơ',
        price: 40000,
        category: 'Đồ uống',
        image: '/images/drinks/sinh_to_bo.jpg',
        isActive: true,
      },
      {
        name: 'Bia Tiger',
        price: 30000,
        category: 'Đồ uống',
        image: '/images/drinks/bia_tiger.jpg',
        isActive: true,
      },
      {
        name: 'Rượu nếp',
        price: 50000,
        category: 'Đồ uống',
        image: '/images/drinks/ruou_nep.jpg',
        isActive: true,
      },
      {
        name: 'Coca Cola',
        price: 15000,
        category: 'Đồ uống',
        image: '/images/drinks/coca_cola.jpg',
        isActive: true,
      },
      {
        name: 'Nước dừa tươi',
        price: 25000,
        category: 'Đồ uống',
        image: '/images/drinks/nuoc_dua_tuoi.jpg',
        isActive: true,
      },
      {
        name: 'Cà phê sữa đá',
        price: 25000,
        category: 'Đồ uống',
        image: '/images/drinks/ca_phe_sua_da.jpg',
        isActive: true,
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
