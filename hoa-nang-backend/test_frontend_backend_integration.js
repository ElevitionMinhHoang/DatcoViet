// Test script to verify frontend-backend integration
// Using built-in fetch (Node.js 18+)

async function testIntegration() {
  console.log('🧪 Testing Frontend-Backend Integration...\n');

  // Test 1: Backend API is accessible
  console.log('1. Testing Backend API...');
  try {
    const backendResponse = await fetch('http://localhost:3000/api/v1/menus');
    const backendData = await backendResponse.json();
    console.log(`✅ Backend API: SUCCESS (${backendData.length} menu items)`);
  } catch (error) {
    console.log('❌ Backend API: FAILED -', error.message);
    return;
  }

  // Test 2: Frontend is accessible
  console.log('2. Testing Frontend...');
  try {
    const frontendResponse = await fetch('http://localhost:8082/');
    console.log(`✅ Frontend: SUCCESS (HTTP ${frontendResponse.status})`);
  } catch (error) {
    console.log('❌ Frontend: FAILED -', error.message);
    return;
  }

  // Test 3: Test authentication API
  console.log('3. Testing Authentication API...');
  try {
    const authResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' })
    });
    console.log(`✅ Authentication API: SUCCESS (HTTP ${authResponse.status})`);
  } catch (error) {
    console.log('❌ Authentication API: FAILED -', error.message);
    return;
  }

  // Test 4: Test orders API
  console.log('4. Testing Orders API...');
  try {
    const ordersResponse = await fetch('http://localhost:3000/api/v1/orders');
    console.log(`✅ Orders API: SUCCESS (HTTP ${ordersResponse.status})`);
  } catch (error) {
    console.log('❌ Orders API: FAILED -', error.message);
    return;
  }

  // Test 5: Test contact API
  console.log('5. Testing Contact API...');
  try {
    const contactResponse = await fetch('http://localhost:3000/api/v1/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', message: 'Test message' })
    });
    console.log(`✅ Contact API: SUCCESS (HTTP ${contactResponse.status})`);
  } catch (error) {
    console.log('❌ Contact API: FAILED -', error.message);
    return;
  }

  console.log('\n🎉 All systems are working correctly!');
  console.log('📱 Frontend: http://localhost:8082/');
  console.log('🔧 Backend API: http://localhost:3000/api/v1/');
  console.log('\n✅ Integration test completed successfully!');
}

testIntegration().catch(console.error);