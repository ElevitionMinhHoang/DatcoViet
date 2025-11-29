const API_BASE_URL = 'http://localhost:3000/api/v1';

async function loginAndTest() {
  try {
    console.log('=== Logging in as Admin ===');
    
    // Login as admin user
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password' // Default password from seed
      })
    });
    
    console.log('Login Response Status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      const token = loginData.access_token;
      console.log('✅ Login successful! Token:', token);
      
      // Now test admin orders API with real token
      console.log('\n=== Testing Admin Orders API ===');
      
      const ordersResponse = await fetch(`${API_BASE_URL}/orders/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Orders API Response Status:', ordersResponse.status);
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        console.log('\n✅ Orders API Success!');
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
        console.log('❌ Orders API Error:', errorText);
      }
      
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', errorText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

loginAndTest();