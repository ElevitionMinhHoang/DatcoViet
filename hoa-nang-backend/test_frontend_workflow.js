const BASE_URL = 'http://localhost:3000/api/v1';

async function testFrontendWorkflow() {
  try {
    console.log('Testing complete frontend workflow...\n');

    // Step 1: Register a new user (simulating frontend registration)
    console.log('1. Registering new user...');
    const registerData = {
      email: 'frontendtest@example.com',
      password: 'password123',
      name: 'Frontend Test User',
      phone: '0987654321'
    };

    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      console.log('Register failed:', errorData);
      return;
    }
    console.log('✓ User registered successfully\n');

    // Step 2: Login (simulating frontend login)
    console.log('2. Logging in...');
    const loginData = {
      email: 'frontendtest@example.com',
      password: 'password123'
    };

    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('Login failed:', errorData);
      return;
    }

    const loginResult = await loginResponse.json();
    const token = loginResult.access_token;
    console.log('✓ Login successful, token received\n');

    // Step 3: Get user info (simulating frontend getting user data)
    console.log('3. Getting user info...');
    const userResponse = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.log('Get user info failed:', errorData);
      return;
    }

    const userInfo = await userResponse.json();
    console.log('✓ User info retrieved:', { id: userInfo.id, email: userInfo.email, name: userInfo.name, role: userInfo.role });
    console.log('');

    // Step 4: Create order (simulating frontend checkout)
    console.log('4. Creating order...');
    const orderData = {
      items: [
        {
          menuId: 10, // Nem rán
          quantity: 2
        },
        {
          menuId: 14, // Thịt kho trứng
          quantity: 1
        }
      ]
    };

    console.log('Order data:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.log('Order creation failed:', errorData);
      return;
    }

    const orderResult = await orderResponse.json();
    console.log('✓ Order created successfully!');
    console.log('Order details:', {
      id: orderResult.id,
      total: orderResult.total,
      status: orderResult.status,
      items: orderResult.items.map(item => ({
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.price
      }))
    });
    console.log('');

    // Step 5: Create payment (simulating frontend payment)
    console.log('5. Creating payment...');
    const paymentData = {
      orderId: orderResult.id,
      method: 'COD',
      amount: orderResult.total
    };

    const paymentResponse = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      console.log('Payment creation failed:', errorData);
      return;
    }

    const paymentResult = await paymentResponse.json();
    console.log('✓ Payment created successfully!');
    console.log('Payment details:', {
      id: paymentResult.id,
      orderId: paymentResult.orderId,
      method: paymentResult.method,
      amount: paymentResult.amount,
      status: paymentResult.status
    });
    console.log('');

    // Step 6: Get user orders (simulating frontend order history)
    console.log('6. Getting user orders...');
    const ordersResponse = await fetch(`${BASE_URL}/orders/my-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!ordersResponse.ok) {
      const errorData = await ordersResponse.json();
      console.log('Get orders failed:', errorData);
      return;
    }

    const userOrders = await ordersResponse.json();
    console.log('✓ User orders retrieved successfully!');
    console.log(`Total orders: ${userOrders.length}`);
    userOrders.forEach(order => {
      console.log(`- Order #${order.id}: ${order.status}, Total: ${order.total}, Items: ${order.items.length}`);
    });

    console.log('\n🎉 Frontend workflow test completed successfully!');
    console.log('All steps from registration to order creation and payment work correctly.');

  } catch (error) {
    console.error('Error in frontend workflow test:', error.message);
  }
}

testFrontendWorkflow();