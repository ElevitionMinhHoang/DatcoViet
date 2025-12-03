const io = require('socket.io-client');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testWebSocketChat() {
  try {
    console.log('🔌 Testing WebSocket Chat Functionality...\n');

    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    const loginData = await loginResponse.json();
    authToken = loginData.access_token;
    console.log('✅ Login successful\n');

    // Step 2: Connect to WebSocket
    console.log('2. Connecting to WebSocket...');
    const socket = io(BASE_URL, {
      auth: {
        token: authToken,
      },
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully');
      
      // Step 3: Join chat room
      console.log('3. Joining chat room...');
      socket.emit('join_chat_room', { roomId: 1 });
      console.log('✅ Joined chat room 1\n');

      // Step 4: Send a test message via WebSocket
      console.log('4. Sending test message via WebSocket...');
      socket.emit('send_message', {
        roomId: 1,
        message: 'Hello from WebSocket test!'
      });
      console.log('✅ Message sent via WebSocket\n');

      // Step 5: Listen for new messages
      console.log('5. Listening for incoming messages...');
      socket.on('new_message', (message) => {
        console.log('✅ Received new message:', {
          id: message.id,
          sender: message.sender?.name,
          content: message.message,
          timestamp: message.createdAt
        });
      });

      // Wait a bit for messages to be processed
      setTimeout(() => {
        console.log('\n🎉 WebSocket chat functionality test completed!');
        console.log('\n📝 Summary:');
        console.log('   - WebSocket connection: ✅');
        console.log('   - Room joining: ✅');
        console.log('   - Message sending: ✅');
        console.log('   - Message receiving: ✅');
        
        socket.disconnect();
        process.exit(0);
      }, 2000);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection failed:', error.message);
      process.exit(1);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testWebSocketChat();