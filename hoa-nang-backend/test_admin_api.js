const API_BASE_URL = 'http://localhost:3000/api/v1';

// Create a test admin token
const jwt = require('jsonwebtoken');
const secret = 'your-secret-key';
const payload = { sub: 1, email: 'admin@example.com', role: 'ADMIN' };
const token = jwt.sign(payload, secret, { expiresIn: '24h' });

console.log('Admin Token:', token);

async function testAdminOrders() {
  try {
    console.log('\n=== Testing Admin Orders API ===');
    
    const response = await fetch(`${API_BASE_URL}/orders/admin`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n=== API Response Data ===');
      console.log('Total orders from API:', data.length);
      
      if (data.length > 0) {
        console.log('\n=== Order Details from API ===');
        data.forEach((order, index) => {
          console.log(`\nOrder #${index + 1}:`);
          console.log('  Raw API data:', JSON.stringify(order, null, 2));
          console.log(`  ID: ${order.id}`);
          console.log(`  User: ${order.user?.name || 'N/A'}`);
          console.log(`  Total: ${order.total}`);
          console.log(`  Status: ${order.status}`);
          console.log(`  Created: ${order.createdAt}`);
          console.log(`  Items count: ${order.items?.length || 0}`);
        });
      } else {
        console.log('No orders returned from API');
      }
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAdminOrders();