require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    // Delete old admin
    await User.deleteMany({ email: 'admin@zaiqazone.com' });

    // Create new admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@zaiqazone.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin created!');
    console.log('📧 Email: admin@zaiqazone.com');
    console.log('🔑 Password: admin123');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();