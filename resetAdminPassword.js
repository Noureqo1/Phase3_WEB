const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clipsphere');

const resetAdminPassword = async () => {
  try {
    console.log('Resetting admin password...');
    
    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin user found!');
      process.exit(1);
    }
    
    // Reset password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    admin.hashedPassword = hashedPassword;
    await admin.save();
    
    console.log('✅ Admin password reset successfully!');
    console.log('');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('🔗 Login at: http://localhost:3000/auth/login');
    console.log('');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  }
};

resetAdminPassword();
