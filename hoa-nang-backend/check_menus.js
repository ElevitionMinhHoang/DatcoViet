const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMenus() {
  try {
    console.log('=== Checking Menu Items in Database ===');
    
    const menus = await prisma.menu.findMany({
      select: { id: true, name: true, isActive: true }
    });
    
    console.log(`Total menu items: ${menus.length}`);
    console.log('\n=== All Menu Items ===');
    menus.forEach(menu => {
      console.log(`ID: ${menu.id}, Name: ${menu.name}, Active: ${menu.isActive}`);
    });
    
    const activeMenus = menus.filter(menu => menu.isActive);
    console.log(`\n=== Active Menu Items: ${activeMenus.length} ===`);
    activeMenus.forEach(menu => {
      console.log(`ID: ${menu.id}, Name: ${menu.name}`);
    });
    
    console.log('\n=== Active Menu IDs ===');
    console.log(activeMenus.map(m => m.id).join(', '));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMenus();