const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testStaffOrders() {
  try {
    console.log('=== Testing Staff Orders API ===');
    
    // Login first
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('Login failed');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login successful!');
    
    // Test staff orders API (alternative endpoint)
    const ordersResponse = await fetch(`${API_BASE_URL}/orders/staff`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Staff Orders API Response Status:', ordersResponse.status);
    
    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      console.log('\n✅ Staff Orders API Success!');
      console.log('Total orders from API:', ordersData.length);
      
      if (ordersData.length > 0) {
        console.log('\n=== Order Details from API ===');
        ordersData.forEach((order, index) => {
          console.log(`\nOrder #${index + 1}:`);
          console.log(`  ID: ${order.id}`);
          console.log(`  User: ${order.user?.name || 'N/A'} (${order.user?.email || 'N/A'})`);
          console.log(`  Total: ${order.total}`);
          console.log(`  Status: ${order.status}`);
          console.log(`  Created: ${order.createdAt}`);
          console.log(`  Items count: ${order.items?.length || 0}`);
          if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
              console.log(`    - ${item.menu?.name || 'Unknown'} x${item.quantity} (${item.price} VND)`);
            });
          }
        });
      } else {
        console.log('No orders returned from API');
      }
    } else {
      const errorText = await ordersResponse.text();
      console.log('❌ Staff Orders API Error:', errorText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testStaffOrders();