const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFeastSetOrder() {
  try {
    console.log('=== Testing Feast Set Order Creation ===');

    // Get the feast sets we just added
    const feastSets = await prisma.menu.findMany({
      where: { 
        category: 'Mâm Cỗ',
        isActive: true 
      },
      orderBy: { id: 'asc' }
    });

    console.log(`Found ${feastSets.length} feast sets in database:`);
    feastSets.forEach(feastSet => {
      console.log(`- ID: ${feastSet.id}, Name: ${feastSet.name}, Price: ${feastSet.price}`);
    });

    // Get a test user
    const testUser = await prisma.user.findFirst({
      where: { email: 'user@example.com' }
    });

    if (!testUser) {
      console.log('Test user not found. Creating one...');
      // Create a test user if needed
      const newUser = await prisma.user.create({
        data: {
          email: 'testfeast@example.com',
          password: 'password123',
          name: 'Feast Test User',
          phone: '0123456789',
          role: 'USER'
        }
      });
      console.log(`Created test user: ${newUser.name} (ID: ${newUser.id})`);
    }

    console.log('\n=== Testing Order Creation with Feast Sets ===');

    // Test creating an order with feast sets
    const feastSetOrder = {
      userId: testUser?.id || 1,
      items: [
        {
          menuId: 37, // Mâm cỗ gia đình truyền thống
          quantity: 1
        },
        {
          menuId: 38, // Mâm cỗ tiệc cưới
          quantity: 1
        }
      ]
    };

    console.log('Order data:', feastSetOrder);

    // Check if menu items exist and are active
    const menuItems = await prisma.menu.findMany({
      where: {
        id: { in: feastSetOrder.items.map(item => item.menuId) },
        isActive: true
      }
    });

    console.log(`\nFound ${menuItems.length} valid menu items:`);
    menuItems.forEach(item => {
      console.log(`- ${item.name} (ID: ${item.id}) - Active: ${item.isActive}`);
    });

    if (menuItems.length === feastSetOrder.items.length) {
      console.log('\n✅ All menu items are valid and active!');
      console.log('Feast sets can now be ordered successfully.');
    } else {
      console.log('\n❌ Some menu items are invalid or inactive.');
      console.log('Expected:', feastSetOrder.items.length, 'Found:', menuItems.length);
    }

    // Check recent orders to see if any feast sets have been ordered
    console.log('\n=== Checking Recent Orders with Feast Sets ===');
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        items: {
          include: {
            menu: true
          }
        }
      }
    });

    const feastSetOrders = recentOrders.filter(order => 
      order.items.some(item => item.menu.category === 'Mâm Cỗ')
    );

    console.log(`Found ${feastSetOrders.length} recent orders containing feast sets:`);
    feastSetOrders.forEach(order => {
      console.log(`\nOrder ID: ${order.id}, Total: ${order.total}`);
      order.items.forEach(item => {
        if (item.menu.category === 'Mâm Cỗ') {
          console.log(`  - ${item.menu.name} (ID: ${item.menuId}) x ${item.quantity}`);
        }
      });
    });

  } catch (error) {
    console.error('Error testing feast set order:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFeastSetOrder();