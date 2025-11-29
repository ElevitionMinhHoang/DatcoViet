const API_BASE_URL = 'http://localhost:3000/api/v1';

async function testContactAPI() {
  console.log('Testing Contact API...\n');

  const testData = {
    name: 'Nguyễn Văn A',
    email: 'test@example.com',
    message: 'Đây là tin nhắn test từ API'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Contact form submitted successfully!');
      console.log('Response:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testContactAPI();