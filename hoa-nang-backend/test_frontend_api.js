const fetch = require('node-fetch');

async function testFrontendAPI() {
  try {
    console.log('Testing frontend API calls...');
    
    // Test menus API
    const menusResponse = await fetch('http://localhost:3000/api/v1/menus', {
      headers: {
        'Origin': 'http://localhost:8080'
      }
    });
    const menusData = await menusResponse.json();
    console.log('Menus API response:', menusData.length, 'items');
    
    // Test auth API
    const authResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'password'
      })
    });
    console.log('Auth API status:', authResponse.status);
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testFrontendAPI();