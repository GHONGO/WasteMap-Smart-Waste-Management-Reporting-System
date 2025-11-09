import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get user input
    const name = await question('Enter name (default: Super Admin): ') || 'Super Admin';
    const email = await question('Enter email (required): ');
    const password = await question('Enter password (required, min 6 chars): ');
    const phone = await question('Enter phone (optional): ') || '';

    if (!email || !password) {
      console.log('❌ Email and password are required!');
      rl.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters!');
      rl.close();
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`\n⚠️  User with email ${email} already exists!`);
      const overwrite = await question('Do you want to update this user to superadmin? (yes/no): ');
      if (overwrite.toLowerCase() === 'yes') {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.role = 'superadmin';
        existingUser.name = name;
        if (phone) existingUser.phone = phone;
        await existingUser.save();
        console.log('\n✅ User updated to superadmin successfully!');
      } else {
        console.log('❌ Operation cancelled.');
        rl.close();
        process.exit(0);
      }
    } else {
      // Create new superadmin user
      // Password will be automatically hashed by the pre-save hook
      const superadmin = await User.create({
        name,
        email,
        password, // Will be hashed automatically
        phone,
        role: 'superadmin',
      });

      console.log('\n✅ Superadmin user created successfully!');
      console.log('\n📋 User Details:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Name: ${superadmin.name}`);
      console.log(`Email: ${superadmin.email}`);
      console.log(`Role: ${superadmin.role}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    console.log('📝 To login:');
    console.log('   1. Go to http://localhost:5173/login');
    console.log(`   2. Email: ${email}`);
    console.log(`   3. Password: ${password}`);
    console.log('\n🎯 After login, you should see:');
    console.log('   - "Super Admin" link in the navbar');
    console.log('   - Access to /superadmin route');
    console.log('   - Purple role badge showing "superadmin"');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

createSuperAdmin();

