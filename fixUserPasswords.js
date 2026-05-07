const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

const users = [
  { email: 'creator1@clipsphere.local', username: 'creator_one', password: 'user123' },
  { email: 'creator2@clipsphere.local', username: 'creator_two', password: 'user123' },
  { email: 'user1@clipsphere.local', username: 'regular_user1', password: 'user123' },
  { email: 'user2@clipsphere.local', username: 'regular_user2', password: 'user123' },
  { email: 'user3@clipsphere.local', username: 'regular_user3', password: 'user123' }
];

const fixPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clipsphere');
    console.log('Connected to MongoDB');

    console.log('🔧 Fixing user passwords...');
    
    for (const userData of users) {
      const user = await User.findOne({ email: userData.email });
      
      if (!user) {
        console.log(`❌ User ${userData.email} not found`);
        continue;
      }

      // Hash password with the same method as auth service
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Update user password
      user.hashedPassword = hashedPassword;
      await user.save();

      console.log(`✅ Fixed password for: ${userData.email} (${userData.username})`);
    }

    console.log('\n🎉 All user passwords have been fixed!');
    console.log('\n📋 Updated Login Credentials:');
    console.log('=====================================');
    users.forEach(user => {
      console.log(`📧 ${user.email}`);
      console.log(`👤 ${user.username}`);
      console.log(`🔑 ${user.password}`);
      console.log('-------------------------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error fixing passwords:', error);
    process.exit(1);
  }
};

fixPasswords();
