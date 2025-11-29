// Test script to debug authentication and order creation
const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testAuthAndOrder() {
  try {
    console.log('Testing authentication and order creation...');
    
    // First, let's login to get a token
    const loginData = {
      email: 'customer@example.com',
      password: 'password123'
    };
    
    console.log('Logging in...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('Login failed:', errorText);
      return;
    }
    
    const loginResult = await loginResponse.json();
    console.log('Login successful, token:', loginResult.access_token ? 'Received' : 'Missing');
    
    const token = loginResult.access_token;
    if (!token) {
      console.log('No token received from login');
      return;
    }
    
    // Now test order creation with the token
    const testOrderData = {
      items: [
        {
          menuId: 10, // Using ID 10 which should exist
          quantity: 1
        }
      ]
    };
    
    console.log('Testing order creation with token...');
    const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testOrderData)
    });
    
    console.log('Order response status:', orderResponse.status);
    
    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.log('Order creation failed:', errorText);
    } else {
      const orderResult = await orderResponse.json();
      console.log('Order created successfully:', orderResult);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAuthAndOrder();