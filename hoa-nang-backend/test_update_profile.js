const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';
const EMAIL = 'test@example.com';
const PASSWORD = 'password123';

async function test() {
  try {
    // Login
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: EMAIL,
      password: PASSWORD,
    });
    const token = loginRes.data.access_token;
    console.log('Logged in, token:', token.substring(0, 20) + '...');

    // Get current user
    const meRes = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Current user:', meRes.data);

    // Update profile
    const updateRes = await axios.patch(
      `${API_BASE}/users/me`,
      {
        name: 'Updated Name',
        phone: '0987654321',
        address: '123 Test Street',
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Update response:', updateRes.data);

    // Verify update
    const verifyRes = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Updated user:', verifyRes.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

test();