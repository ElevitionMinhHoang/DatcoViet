const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addFeastSets() {
  try {
    console.log('=== Adding Feast Sets to Database ===');

    // Define feast sets that match the mock data in frontend
    const feastSets = [
      {
        name: 'Mâm cỗ gia đình truyền thống',
        price: 450000,
        category: 'Mâm Cỗ',
        image: '/images/hero-feast.jpg',
        isActive: true
      },
      {
        name: 'Mâm cỗ tiệc cưới',
        price: 1200000,
        category: 'Mâm Cỗ',
        image: '/images/wedding-feast.jpg',
        isActive: true
      },
      {
        name: 'Mâm cỗ tiệc tân gia',
        price: 800000,
        category: 'Mâm Cỗ',
        image: '/images/housewarming-feast.jpg',
        isActive: true
      },
      {
        name: 'Mâm cỗ giỗ chạp',
        price: 600000,
        category: 'Mâm Cỗ',
        image: '/images/ancestral-feast.jpg',
        isActive: true
      },
      {
        name: 'Mâm cỗ lễ hội',
        price: 700000,
        category: 'Mâm Cỗ',
        image: '/images/festival-feast.jpg',
        isActive: true
      }
    ];

    console.log(`Adding ${feastSets.length} feast sets to database...`);

    for (const feastSet of feastSets) {
      // Check if menu item already exists by name
      const existingMenu = await prisma.menu.findFirst({
        where: { name: feastSet.name }
      });

      if (existingMenu) {
        console.log(`Menu item "${feastSet.name}" already exists. Updating...`);
        await prisma.menu.update({
          where: { id: existingMenu.id },
          data: feastSet
        });
        console.log(`✓ Updated: ${feastSet.name}`);
      } else {
        const createdMenu = await prisma.menu.create({
          data: feastSet
        });
        console.log(`✓ Created: ${feastSet.name} (ID: ${createdMenu.id})`);
      }
    }

    console.log('\n=== Feast Sets Added Successfully ===');
    
    // Verify the feast sets were added
    const allMenus = await prisma.menu.findMany({
      where: { category: 'Mâm Cỗ' },
      orderBy: { id: 'asc' }
    });

    console.log(`\nTotal feast sets in database: ${allMenus.length}`);
    allMenus.forEach(menu => {
      console.log(`- ID: ${menu.id}, Name: ${menu.name}, Price: ${menu.price}`);
    });

    console.log('\n=== All Valid Menu IDs Now ===');
    const allActiveMenus = await prisma.menu.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { id: 'asc' }
    });

    const validMenuIds = allActiveMenus.map(menu => menu.id);
    console.log('Valid Menu IDs:', validMenuIds);
    console.log('Total active menu items:', validMenuIds.length);

  } catch (error) {
    console.error('Error adding feast sets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addFeastSets();