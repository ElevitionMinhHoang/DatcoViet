const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAdminOrders() {
  try {
    console.log('=== Checking Orders in Database ===');
    
    // Check total orders
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            menu: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Total orders found: ${orders.length}`);
    
    if (orders.length > 0) {
      console.log('\n=== Order Details ===');
      orders.forEach((order, index) => {
        console.log(`\nOrder #${index + 1}:`);
        console.log(`  ID: ${order.id}`);
        console.log(`  User: ${order.user.name} (${order.user.email})`);
        console.log(`  Total: ${order.total} VND`);
        console.log(`  Status: ${order.status}`);
        console.log(`  Created: ${order.createdAt}`);
        console.log(`  Items: ${order.items.length}`);
        order.items.forEach(item => {
          console.log(`    - ${item.menu.name} x${item.quantity} (${item.price} VND)`);
        });
      });
    } else {
      console.log('No orders found in database.');
    }
    
    // Check if there are any PENDING orders
    const pendingOrders = orders.filter(order => order.status === 'PENDING');
    console.log(`\n=== PENDING Orders: ${pendingOrders.length} ===`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminOrders();