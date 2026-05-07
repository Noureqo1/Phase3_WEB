const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const verifyUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clipsphere');
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log('\n📋 All Users in Database:');
    console.log('=====================================');
    
    users.forEach(user => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Username: ${user.username}`);
      console.log(`🔑 Role: ${user.role}`);
      console.log(`🆔 ID: ${user._id}`);
      console.log('-------------------------------------');
    });

    // Check specific test users
    const testUsers = [
      'creator1@clipsphere.local',
      'creator2@clipsphere.local', 
      'user1@clipsphere.local',
      'user2@clipsphere.local',
      'user3@clipsphere.local',
      'admin@clipsphere.local'
    ];

    console.log('\n🔍 Verifying Test Users:');
    console.log('=====================================');
    
    for (const email of testUsers) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`✅ ${email} - Found (${user.username})`);
      } else {
        console.log(`❌ ${email} - Not found`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyUsers();
