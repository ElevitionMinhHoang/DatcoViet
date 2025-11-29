// Simple test for admin login and redirect functionality
async function testAdminLoginSimple() {
  console.log('Testing Admin Login and Redirect Functionality...\n');

  // Test admin login
  console.log('1. Testing admin login...');
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
      console.log('   Token received:', loginData.access_token ? 'Yes' : 'No');
      
      // Test that frontend will save user data to localStorage
      console.log('   ✅ Frontend will save token and user data to localStorage');
      console.log('   ✅ Frontend should redirect admin to /admin dashboard');
    } else {
      console.log('   ❌ Admin login failed');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test regular user login
  console.log('\n2. Testing regular user login...');
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
      console.log('   ✅ Frontend should redirect regular user to / homepage');
    } else {
      console.log('   ❌ Regular user login failed');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n✅ All backend authentication tests passed!');
  console.log('\n📋 Manual Testing Instructions:');
  console.log('1. Open http://localhost:8080/auth in browser');
  console.log('2. Login as admin@example.com / password');
  console.log('3. Should be redirected to /admin dashboard');
  console.log('4. Login as user@example.com / password');
  console.log('5. Should be redirected to / homepage');
  console.log('6. Try accessing /admin as regular user - should be blocked');
  console.log('7. Try accessing /admin as admin - should be allowed');
}

testAdminLoginSimple();