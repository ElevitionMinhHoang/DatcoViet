// Test admin login and redirect functionality
async function testAdminRedirect() {
  console.log('Testing Admin Login and Redirect...\n');

  // Test admin login
  console.log('1. Testing admin login and redirect...');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('   ✅ Admin login successful');
      console.log('   Token:', loginData.access_token ? 'Received' : 'Not received');
      
      // Get user profile to verify role
      const profileResponse = await fetch('http://localhost:3000/api/v1/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.access_token}`,
          'Origin': 'http://localhost:8080'
        }
      });

      if (profileResponse.ok) {
        const userProfile = await profileResponse.json();
        console.log('   User role:', userProfile.role);
        console.log('   User email:', userProfile.email);
        
        if (userProfile.role === 'ADMIN') {
          console.log('   ✅ User is correctly identified as ADMIN');
          console.log('   ✅ Frontend should redirect to /admin after login');
        } else {
          console.log('   ❌ User should be ADMIN but role is:', userProfile.role);
        }
      } else {
        console.log('   ❌ Failed to get user profile');
      }
    } else {
      console.log('   ❌ Admin login failed');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test regular user login
  console.log('\n2. Testing regular user login and redirect...');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
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

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('   ✅ Regular user login successful');
      
      // Get user profile to verify role
      const profileResponse = await fetch('http://localhost:3000/api/v1/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.access_token}`,
          'Origin': 'http://localhost:8080'
        }
      });

      if (profileResponse.ok) {
        const userProfile = await profileResponse.json();
        console.log('   User role:', userProfile.role);
        
        if (userProfile.role === 'USER') {
          console.log('   ✅ User is correctly identified as USER');
          console.log('   ✅ Frontend should redirect to / after login');
        } else {
          console.log('   ❌ User should be USER but role is:', userProfile.role);
        }
      }
    } else {
      console.log('   ❌ Regular user login failed');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\nTest completed.');
  console.log('\nManual Testing Instructions:');
  console.log('1. Open http://localhost:8080/auth in browser');
  console.log('2. Login as admin@example.com / password');
  console.log('3. Should be redirected to /admin dashboard');
  console.log('4. Login as user@example.com / password');
  console.log('5. Should be redirected to / homepage');
}

testAdminRedirect();