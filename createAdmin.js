const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clipsphere');

const createAdminUser = async () => {
  try {
    console.log('Checking for admin users...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Password: [existing password]');
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@clipsphere.com',
      hashedPassword: hashedPassword,
      role: 'admin',
      active: true,
      accountstatus: 'active'
    });
    
    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Email: admin@clipsphere.com');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('🔗 Login at: http://localhost:3000/auth/login');
    console.log('');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
