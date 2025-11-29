// Test script to debug order creation
const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testOrderAPI() {
  try {
    console.log('Testing order API...');
    
    // First, let's check what menu items are available
    const menusResponse = await fetch(`${API_BASE_URL}/menus`);
    const menus = await menusResponse.json();
    console.log('Available menu items:', menus.map(m => ({ id: m.id, name: m.name, isActive: m.isActive })));
    
    // Test with a valid menu item
    const testOrderData = {
      items: [
        {
          menuId: 10, // Using ID 10 which should exist
          quantity: 1
        }
      ]
    };
    
    console.log('Testing with order data:', testOrderData);
    
    // Test without auth first to see if it's an auth issue
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    } else {
      const result = await response.json();
      console.log('Success! Order created:', result);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOrderAPI();