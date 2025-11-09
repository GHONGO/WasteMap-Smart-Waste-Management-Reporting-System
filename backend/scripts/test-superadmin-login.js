import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testSuperAdminLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find superadmin user
    const superadmin = await User.findOne({ role: 'superadmin' });
    
    if (!superadmin) {
      console.log('❌ No superadmin user found in database');
      console.log('\nTo create a superadmin user, run:');
      console.log('node scripts/create-superadmin.js');
      process.exit(1);
    }

    console.log('\n📋 Superadmin User Found:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${superadmin.name}`);
    console.log(`Email: ${superadmin.email}`);
    console.log(`Role: ${superadmin.role}`);
    console.log(`Password Hash: ${superadmin.password.substring(0, 20)}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test password matching
    console.log('🔐 Testing Password Authentication:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Test with a sample password (you'll need to provide the actual password)
    const testPassword = process.argv[2] || 'test123';
    console.log(`Testing with password: "${testPassword}"`);
    
    const isMatch = await superadmin.matchPassword(testPassword);
    
    if (isMatch) {
      console.log('✅ Password matches! Login will work.');
    } else {
      console.log('❌ Password does NOT match!');
      console.log('\n⚠️  If you inserted the user directly in MongoDB, the password might not be hashed.');
      console.log('   You need to hash the password using bcrypt.');
      console.log('\n   To fix this, you can:');
      console.log('   1. Delete the user from MongoDB');
      console.log('   2. Run: node scripts/create-superadmin.js');
      console.log('   3. Or update the password in MongoDB with a hashed value');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if password is properly hashed
    const isHashed = superadmin.password.startsWith('$2a$') || superadmin.password.startsWith('$2b$');
    if (!isHashed) {
      console.log('⚠️  WARNING: Password does not appear to be hashed!');
      console.log('   Passwords must be hashed with bcrypt (starting with $2a$ or $2b$)');
      console.log('   The password you inserted is plain text and will not work.\n');
    }

    console.log('✅ Backend is ready to handle superadmin login!');
    console.log('\n📝 To login:');
    console.log('   1. Go to http://localhost:5173/login');
    console.log(`   2. Email: ${superadmin.email}`);
    console.log('   3. Password: (the password you used when creating the user)');
    console.log('\n🎯 After login, you should see:');
    console.log('   - "Super Admin" link in the navbar');
    console.log('   - Access to /superadmin route');
    console.log('   - Purple role badge showing "superadmin"');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testSuperAdminLogin();

