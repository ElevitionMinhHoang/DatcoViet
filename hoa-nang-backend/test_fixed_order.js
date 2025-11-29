// Test script to verify the fixed order creation
const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testOrderCreation() {
  console.log('Testing order creation with valid menu IDs...\n');

  // Test user credentials - use existing user
  const testUser = {
    email: 'user@example.com',
    password: 'password'
  };

  let token;

  try {
    // Login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    token = loginData.access_token;
    console.log('✅ Login successful\n');

    // Create order with valid menu IDs
    console.log('2. Creating order with valid menu IDs...');
    const orderData = {
      items: [
        { menuId: 10, quantity: 2 }, // Nem rán
        { menuId: 11, quantity: 1 }  // Gỏi cuốn tôm thịt
      ]
    };

    const orderResponse = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.log('❌ Order creation failed:', orderResponse.status, errorText);
      return;
    }

    const orderResult = await orderResponse.json();
    console.log('✅ Order created successfully!');
    console.log('Order details:', JSON.stringify(orderResult, null, 2));

    // Create payment
    console.log('\n3. Creating payment...');
    const paymentData = {
      orderId: orderResult.id,
      method: 'COD',
      amount: 160000 // 2x Nem rán (50k) + 1x Gỏi cuốn (60k) = 160k
    };

    const paymentResponse = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.log('❌ Payment creation failed:', paymentResponse.status, errorText);
      return;
    }

    const paymentResult = await paymentResponse.json();
    console.log('✅ Payment created successfully!');
    console.log('Payment details:', JSON.stringify(paymentResult, null, 2));

    console.log('\n🎉 TEST COMPLETED SUCCESSFULLY!');
    console.log('The order creation and payment workflow is now working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOrderCreation();