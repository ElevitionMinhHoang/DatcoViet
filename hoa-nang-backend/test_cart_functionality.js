// Test script to check cart functionality
console.log("Testing cart functionality...");

// Check if localStorage has cart data
const cartData = localStorage.getItem('cart');
console.log('Cart data from localStorage:', cartData);

// Check if CartContext is working
console.log('Testing CartContext...');

// Simulate adding an item to cart
const testItem = {
  id: "10",
  name: "Test Dish",
  description: "Test description",
  image: "/images/placeholder.svg",
  price: 50000,
  category: "Test",
  unit: "phần",
  isAvailable: true
};

console.log('Test item to add:', testItem);

// Check if the item would be valid
const validMenuIds = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
const menuId = Number(testItem.id);
const isValid = validMenuIds.includes(menuId);
console.log(`Item validation: ID ${menuId}, Valid: ${isValid}`);

console.log("Test completed. Check browser console for actual cart functionality.");