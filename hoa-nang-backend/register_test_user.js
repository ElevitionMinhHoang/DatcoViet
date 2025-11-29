const BASE_URL = 'http://localhost:3000/api/v1';

async function registerTestUser() {
  try {
    console.log('Registering new test user...');
    
    const registerData = {
      email: 'testuser123@example.com',
      password: 'password123',
      name: 'Test User 123',
      phone: '0123456789'
    };
    
    console.log('Registering...');
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });
    
    console.log('Register response status:', registerResponse.status);
    
    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      console.log('Register failed:', errorData);
      return;
    }
    
    console.log('User registered successfully!');
    const registerResult = await registerResponse.json();
    console.log('User ID:', registerResult.id);
    
    // Now try to login with the new user
    console.log('\nTesting login with new user...');
    
    const loginData = {
      email: 'testuser123@example.com',
      password: 'password123'
    };
    
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
    
    return token;
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

registerTestUser();