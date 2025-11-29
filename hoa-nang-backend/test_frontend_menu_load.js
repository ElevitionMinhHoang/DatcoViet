async function testFrontendMenuLoad() {
  console.log('Testing Frontend Menu Loading...\n');

  // Test if frontend can load menu items from backend
  console.log('1. Testing menu loading from frontend perspective...');
  try {
    // Simulate frontend API call
    const response = await fetch('http://localhost:3000/api/v1/menus', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   OK: ${response.ok}`);
    console.log(`   Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Menu items loaded: ${data.length}`);
      
      // Check if feast sets are included
      const feastSets = data.filter(item => item.category === 'Mâm Cỗ');
      console.log(`   Feast sets found: ${feastSets.length}`);
      
      if (feastSets.length > 0) {
        console.log('   Feast sets:');
        feastSets.forEach(feast => {
          console.log(`     - ${feast.name} (ID: ${feast.id}) - ${feast.price} VND`);
        });
      }
    } else {
      console.log('   ERROR: Failed to load menu items');
    }
  } catch (error) {
    console.log(`   ERROR: ${error.message}`);
  }

  // Test authentication from frontend perspective
  console.log('\n2. Testing authentication from frontend perspective...');
  try {
    const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123456'
      })
    });
    
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   OK: ${loginResponse.ok}`);
    console.log(`   Access-Control-Allow-Origin: ${loginResponse.headers.get('access-control-allow-origin')}`);
    
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('   SUCCESS: Frontend authentication working');
      console.log(`   Token received: ${data.access_token ? 'Yes' : 'No'}`);
    } else {
      const errorData = await loginResponse.text();
      console.log(`   ERROR: ${errorData}`);
    }
  } catch (error) {
    console.log(`   ERROR: ${error.message}`);
  }

  console.log('\nTest completed.');
}

testFrontendMenuLoad();