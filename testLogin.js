const axios = require('axios');

const testLogin = async (email, password) => {
  try {
    console.log(`\n🔍 Testing login for: ${email}`);
    
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email,
      password
    });

    console.log('✅ Login successful!');
    console.log('📋 Response:', {
      token: response.data.data.token ? 'Present' : 'Missing',
      user: {
        id: response.data.data.user.id,
        email: response.data.data.user.email,
        username: response.data.data.user.username,
        role: response.data.data.user.role
      }
    });

    return response.data.data;
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('🚨 Error:', error.response?.data?.message || error.message);
    return null;
  }
};

const testAllUsers = async () => {
  const users = [
    { email: 'creator1@clipsphere.local', password: 'user123' },
    { email: 'creator2@clipsphere.local', password: 'user123' },
    { email: 'user1@clipsphere.local', password: 'user123' },
    { email: 'user2@clipsphere.local', password: 'user123' },
    { email: 'user3@clipsphere.local', password: 'user123' },
    { email: 'admin@clipsphere.local', password: 'admin123' }
  ];

  console.log('🧪 Testing All User Logins...');
  console.log('=====================================');

  for (const user of users) {
    await testLogin(user.email, user.password);
  }

  console.log('\n🎉 Login testing complete!');
};

testAllUsers();
