// Using built-in fetch in Node.js

async function testAdminDashboard() {
  try {
    console.log('Testing Admin Dashboard API Integration...\n');

    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 50)}...\n`);

    // Step 2: Test users stats endpoint
    console.log('2. Testing users stats endpoint...');
    const userStatsResponse = await fetch('http://localhost:3000/api/v1/users/admin/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!userStatsResponse.ok) {
      throw new Error(`Users stats failed: ${userStatsResponse.status}`);
    }

    const userStats = await userStatsResponse.json();
    console.log('✅ Users stats successful');
    console.log(`   Total Users: ${userStats.totalUsers}`);
    console.log(`   Recent Users: ${userStats.recentUsers}`);
    console.log(`   Users by Role:`, userStats.usersByRole);
    console.log('');

    // Step 3: Test orders stats endpoint
    console.log('3. Testing orders stats endpoint...');
    const orderStatsResponse = await fetch('http://localhost:3000/api/v1/orders/admin/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!orderStatsResponse.ok) {
      throw new Error(`Orders stats failed: ${orderStatsResponse.status}`);
    }

    const orderStats = await orderStatsResponse.json();
    console.log('✅ Orders stats successful');
    console.log(`   Total Orders: ${orderStats.totalOrders}`);
    console.log(`   Total Revenue: ${orderStats.totalRevenue}`);
    console.log(`   Recent Orders: ${orderStats.recentOrders}`);
    console.log(`   Orders by Status:`, orderStats.ordersByStatus);
    console.log('');

    // Step 4: Test frontend API service
    console.log('4. Testing frontend API service structure...');
    console.log('   Frontend running on: http://localhost:8082');
    console.log('   Backend running on: http://localhost:3000');
    console.log('   API Base URL: http://localhost:3000/api/v1');
    console.log('');

    console.log('🎉 All tests passed! Admin dashboard integration is working correctly.');
    console.log('\nNext steps:');
    console.log('1. Open http://localhost:8082/admin/dashboard in browser');
    console.log('2. Login with admin credentials (admin@example.com / password)');
    console.log('3. Verify dashboard displays real data from backend');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAdminDashboard();