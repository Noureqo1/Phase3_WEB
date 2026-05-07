const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

const users = [
  {
    email: 'creator1@clipsphere.local',
    username: 'creator_one',
    password: 'user123',
    role: 'user'
  },
  {
    email: 'creator2@clipsphere.local',
    username: 'creator_two',
    password: 'user123',
    role: 'user'
  },
  {
    email: 'user1@clipsphere.local',
    username: 'regular_user1',
    password: 'user123',
    role: 'user'
  },
  {
    email: 'user2@clipsphere.local',
    username: 'regular_user2',
    password: 'user123',
    role: 'user'
  },
  {
    email: 'user3@clipsphere.local',
    username: 'regular_user3',
    password: 'user123',
    role: 'user'
  }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clipsphere');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createUsers = async () => {
  try {
    await connectDB();
    console.log('Creating multiple test users...');

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email: userData.email }, { username: userData.username }] 
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        hashedPassword: hashedPassword,
        role: userData.role
      });

      console.log(`✅ Created user: ${userData.email} (${userData.username})`);
    }

    console.log('\n🎉 All test users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('=====================================');
    users.forEach(user => {
      console.log(`📧 ${user.email}`);
      console.log(`👤 ${user.username}`);
      console.log(`🔑 ${user.password}`);
      console.log('-------------------------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createUsers();
