async function testFrontendIntegration() {
  console.log('Testing Frontend API Integration...\n');

  // Test 1: Check if backend is accessible
  console.log('1. Testing backend connectivity...');
  try {
    const response = await fetch('http://localhost:3000/api/v1/menus');
    console.log(`   Status: ${response.status}`);
    console.log(`   OK: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Menu items count: ${data.length}`);
    } else {
      console.log('   ERROR: Backend not accessible');
    }
  } catch (error) {
    console.log(`   ERROR: ${error.message}`);
  }

  // Test 2: Test authentication
  console.log('\n2. Testing authentication...');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123456'
      })
    });
    
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   OK: ${loginResponse.ok}`);
    
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('   SUCCESS: Authentication working');
      console.log(`   Token received: ${data.access_token ? 'Yes' : 'No'}`);
    } else {
      const errorData = await loginResponse.text();
      console.log(`   ERROR: ${errorData}`);
    }
  } catch (error) {
    console.log(`   ERROR: ${error.message}`);
  }

  // Test 3: Test CORS
  console.log('\n3. Testing CORS headers...');
  try {
    const response = await fetch('http://localhost:3000/api/v1/menus', {
      method: 'OPTIONS'
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
    console.log(`   Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods')}`);
  } catch (error) {
    console.log(`   ERROR: ${error.message}`);
  }

  console.log('\nTest completed.');
}

testFrontendIntegration();