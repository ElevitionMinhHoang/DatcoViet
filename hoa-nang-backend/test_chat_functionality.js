const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';
let authToken = '';

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testChatFunctionality() {
  try {
    console.log('🧪 Testing Chat Functionality...\n');

    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    authToken = loginResponse.data.access_token;
    console.log('✅ Login successful\n');

    // Step 2: Get or create chat room
    console.log('2. Getting chat room...');
    const roomResponse = await axios.get(`${BASE_URL}/chat/room`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const chatRoom = roomResponse.data;
    console.log('✅ Chat room:', chatRoom.id);
    console.log('   User ID:', chatRoom.userId);
    console.log('   Status:', chatRoom.status);
    console.log('');

    // Step 3: Send a test message
    console.log('3. Sending test message...');
    const messageData = {
      roomId: chatRoom.id,
      message: 'Hello, this is a test message from the backend!'
    };
    const messageResponse = await axios.post(`${BASE_URL}/chat/message`, messageData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Message sent successfully');
    console.log('   Message ID:', messageResponse.data.id);
    console.log('   Content:', messageResponse.data.message);
    console.log('');

    // Step 4: Get messages from the room
    console.log('4. Getting room messages...');
    const messagesResponse = await axios.get(`${BASE_URL}/chat/room/${chatRoom.id}/messages`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Messages retrieved:', messagesResponse.data.length);
    messagesResponse.data.forEach((msg, index) => {
      console.log(`   ${index + 1}. ${msg.sender?.name || 'Unknown'}: ${msg.message}`);
    });
    console.log('');

    // Step 5: Get unread count
    console.log('5. Getting unread count...');
    const unreadResponse = await axios.get(`${BASE_URL}/chat/unread-count`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Unread count:', unreadResponse.data.count);
    console.log('');

    console.log('🎉 All chat functionality tests passed!');
    console.log('\n📝 Summary:');
    console.log('   - Authentication: ✅');
    console.log('   - Chat room creation: ✅');
    console.log('   - Message sending: ✅');
    console.log('   - Message retrieval: ✅');
    console.log('   - Unread count: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNRESET') {
      console.log('💡 Connection reset - this might be due to server restart or port conflicts');
      console.log('💡 Check if the backend is running on port 3000');
    }
    
    if (error.response?.status === 401) {
      console.log('💡 Tip: Make sure the JWT_SECRET is properly configured in .env file');
    }
  }
}

// Run the test
testChatFunctionality();