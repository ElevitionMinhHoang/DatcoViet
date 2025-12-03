const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

async function testProfileUpdate() {
  try {
    // 1. Login
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    const token = loginRes.data.access_token;
    console.log('Login successful, token:', token.substring(0, 20) + '...');

    // 2. Get current profile
    const profileRes = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Current profile:', profileRes.data);

    // 3. Update profile with address
    const updateData = {
      name: 'Test User Updated',
      phone: '0987654321',
      address: '456 New Street, Hanoi'
    };
    const updateRes = await axios.patch(`${API_BASE}/users/me`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update response:', updateRes.data);

    // 4. Verify updated profile
    const verifyRes = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Updated profile:', verifyRes.data);

    // Check if address is present
    if (verifyRes.data.address === updateData.address) {
      console.log('✅ Profile update successful, address saved.');
    } else {
      console.log('❌ Address mismatch:', verifyRes.data.address);
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testProfileUpdate();