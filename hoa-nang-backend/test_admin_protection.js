// Using global fetch available in Node.js

async function testAdminProtection() {
  console.log('Testing Admin Route Protection...\n');

  // Test 1: Login as regular user
  console.log('1. Testing login as regular user...');
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
      console.log('   Token received:', loginData.access_token ? 'Yes' : 'No');
      
      // Test 2: Try to access admin route with regular user token
      console.log('\n2. Testing access to admin route with regular user...');
      const adminResponse = await fetch('http://localhost:3000/api/v1/orders/staff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.access_token}`,
          'Origin': 'http://localhost:8080'
        }
      });

      console.log('   Admin route status:', adminResponse.status);
      console.log('   Admin route OK:', adminResponse.ok);
      
      if (!adminResponse.ok) {
        console.log('   ✅ Regular user correctly blocked from admin route');
      } else {
        console.log('   ❌ Regular user should be blocked from admin route');
      }
    } else {
      console.log('   ❌ Regular user login failed');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 3: Login as admin
  console.log('\n3. Testing login as admin...');
  try {
    const adminLoginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
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

    if (adminLoginResponse.ok) {
      const adminLoginData = await adminLoginResponse.json();
      console.log('   ✅ Admin login successful');
      console.log('   Token received:', adminLoginData.access_token ? 'Yes' : 'No');
      
      // Test 4: Try to access admin route with admin token
      console.log('\n4. Testing access to admin route with admin user...');
      const adminRouteResponse = await fetch('http://localhost:3000/api/v1/orders/staff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminLoginData.access_token}`,
          'Origin': 'http://localhost:8080'
        }
      });

      console.log('   Admin route status:', adminRouteResponse.status);
      console.log('   Admin route OK:', adminRouteResponse.ok);
      
      if (adminRouteResponse.ok) {
        console.log('   ✅ Admin user can access admin route');
      } else {
        console.log('   ❌ Admin user should be able to access admin route');
      }
    } else {
      console.log('   ❌ Admin login failed');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\nTest completed.');
}

testAdminProtection();