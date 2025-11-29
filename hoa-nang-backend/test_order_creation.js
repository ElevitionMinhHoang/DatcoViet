const BASE_URL = 'http://localhost:3000/api/v1';

async function testOrderCreation() {
  try {
    console.log('Testing order creation with authenticated user...');
    
    // First login with the test user
    const loginData = {
      email: 'testuser123@example.com',
      password: 'password123'
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
      return;
    }
    
    console.log('Login successful!');
    const loginResult = await loginResponse.json();
    const token = loginResult.access_token;
    console.log('Token received:', token.substring(0, 20) + '...');
    
    // Test order creation - use a real menu ID
    console.log('\nTesting order creation...');
    
    const orderData = {
      items: [
        {
          menuId: 10, // Use a real menu ID (Nem rán)
          quantity: 2
        }
      ]
    };
    
    console.log('Sending order data:', JSON.stringify(orderData, null, 2));
    
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
      console.log('Full error response:', JSON.stringify(errorData, null, 2));
      return;
    }
    
    console.log('Order created successfully!');
    const orderResult = await orderResponse.json();
    console.log('Order created:', JSON.stringify(orderResult, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testOrderCreation();