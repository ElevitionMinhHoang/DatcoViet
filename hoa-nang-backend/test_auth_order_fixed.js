const BASE_URL = 'http://localhost:3000/api/v1';

async function testAuthAndOrder() {
  try {
    console.log('Testing authentication and order creation with real user...');
    
    // Use a real user from the database
    const loginData = {
      email: 'user@example.com',
      password: 'password123' // This should be the actual password
    };
    
    console.log('Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('Login failed:', errorData);
      console.log('Authentication failed. The password might be incorrect.');
      console.log('Please check the password for user@example.com in the database.');
      return;
    }
    
    console.log('Login successful!');
    const loginResult = await loginResponse.json();
    const token = loginResult.access_token;
    console.log('Token received:', token.substring(0, 20) + '...');
    
    // Test order creation
    console.log('\nTesting order creation...');
    
    const orderData = {
      menuItems: [
        {
          menuId: 1, // Use a real menu ID
          quantity: 2
        }
      ],
      totalAmount: 200000,
      deliveryAddress: '123 Test Street, Hanoi',
      deliveryTime: '2025-11-20T15:00:00Z',
      paymentMethod: 'CASH'
    };
    
    const orderResponse = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('Order creation response status:', orderResponse.status);
    
    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.log('Order creation failed:', errorData);
      return;
    }
    
    console.log('Order created successfully!');
    const orderResult = await orderResponse.json();
    console.log('Order ID:', orderResult.id);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAuthAndOrder();