// Script to check cart data in localStorage
const fs = require('fs');
const path = require('path');

// This script simulates checking localStorage cart data
console.log('=== Checking Cart Data Analysis ===');

// Valid menu IDs from database
const validMenuIds = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

console.log('Valid Menu IDs:', validMenuIds);

// Common invalid cart items that might be causing issues
const commonInvalidItems = [
  { id: '1', name: 'Mâm cỗ gia đình truyền thống' },
  { id: '2', name: 'Mâm cỗ tiệc cưới' },
  { id: '3', name: 'Mâm cỗ tiệc tân gia' },
  { id: '4', name: 'Mâm cỗ giỗ chạp' },
  { id: '5', name: 'Mâm cỗ lễ hội' }
];

console.log('\n=== Common Invalid Cart Items ===');
commonInvalidItems.forEach(item => {
  const isValid = validMenuIds.includes(parseInt(item.id));
  console.log(`ID: ${item.id}, Name: ${item.name}, Valid: ${isValid}`);
});

console.log('\n=== Cart Validation Logic ===');
console.log('1. Cart items are validated against validMenuIds array');
console.log('2. Items with IDs not in validMenuIds are filtered out');
console.log('3. If all items are filtered out, order fails with "Giỏ hàng không có món ăn hợp lệ"');

console.log('\n=== Solution ===');
console.log('1. Make sure user adds valid menu items (IDs 10-36)');
console.log('2. Clear localStorage cart if it contains invalid items');
console.log('3. Use the cart cleanup utility if needed');

// Check if there are any orders in the database to see what items users are ordering
console.log('\n=== Checking Recent Orders ===');
console.log('Run this SQL query in Prisma Studio:');
console.log('SELECT * FROM "Order" ORDER BY "createdAt" DESC LIMIT 5;');
console.log('SELECT * FROM "OrderItem" ORDER BY "createdAt" DESC LIMIT 10;');