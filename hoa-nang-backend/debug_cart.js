// Script to debug cart data and check what IDs are being sent
console.log('Debugging cart data...');

// Check localStorage for cart data
const cartData = localStorage.getItem('cart');
console.log('Cart data from localStorage:', cartData);

if (cartData) {
  try {
    const cartItems = JSON.parse(cartData);
    console.log('Parsed cart items:', cartItems);
    
    console.log('\nCart item IDs and types:');
    cartItems.forEach((item, index) => {
      console.log(`Item ${index + 1}:`);
      console.log(`  ID: ${item.id} (type: ${typeof item.id})`);
      console.log(`  Name: ${item.item.name}`);
      console.log(`  Type: ${item.type}`);
      console.log(`  Item ID: ${item.item.id} (type: ${typeof item.item.id})`);
    });
    
    // Check what would be sent to backend
    const orderData = {
      items: cartItems.map(item => ({
        menuId: Number(item.item.id),
        quantity: item.quantity
      }))
    };
    
    console.log('\nOrder data that would be sent to backend:');
    console.log(JSON.stringify(orderData, null, 2));
    
  } catch (error) {
    console.error('Error parsing cart data:', error);
  }
} else {
  console.log('No cart data found in localStorage');
}