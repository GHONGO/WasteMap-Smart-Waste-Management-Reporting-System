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

const checkAndFixSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all users
    const allUsers = await User.find({});
    console.log(`📋 Found ${allUsers.length} user(s) in database:\n`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Find superadmin
    const superadmin = await User.findOne({ role: 'superadmin' });
    
    if (!superadmin) {
      console.log('\n❌ No superadmin user found!');
      console.log('\n📝 To create a superadmin user, you can:');
      console.log('   1. Run: node scripts/create-superadmin.js');
      console.log('   2. Or manually insert in MongoDB with hashed password\n');
      
      const create = await question('Do you want to create a superadmin now? (yes/no): ');
      if (create.toLowerCase() === 'yes') {
        rl.close();
        // Import and run create script
        const { exec } = await import('child_process');
        exec('node scripts/create-superadmin.js', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          console.log(stdout);
        });
        return;
      }
      rl.close();
      process.exit(0);
    }

    console.log('\n✅ Superadmin user found!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${superadmin.name}`);
    console.log(`Email: ${superadmin.email}`);
    console.log(`Role: ${superadmin.role}`);
    console.log(`Password Hash: ${superadmin.password.substring(0, 30)}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check if password is hashed
    const isHashed = superadmin.password.startsWith('$2a$') || superadmin.password.startsWith('$2b$') || superadmin.password.startsWith('$2y$');
    
    if (!isHashed) {
      console.log('⚠️  WARNING: Password is NOT hashed!');
      console.log('   If you inserted the user directly in MongoDB, the password needs to be hashed.\n');
      
      const fix = await question('Do you want to set a new password for this user? (yes/no): ');
      if (fix.toLowerCase() === 'yes') {
        const newPassword = await question('Enter new password (min 6 chars): ');
        if (newPassword.length < 6) {
          console.log('❌ Password must be at least 6 characters!');
          rl.close();
          process.exit(1);
        }
        
        // Hash and update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        superadmin.password = hashedPassword;
        await superadmin.save();
        
        console.log('\n✅ Password updated and hashed successfully!');
        console.log(`\n📝 Login credentials:`);
        console.log(`   Email: ${superadmin.email}`);
        console.log(`   Password: ${newPassword}`);
      } else {
        console.log('\n⚠️  Password is not hashed. Login will fail.');
        console.log('   You need to hash the password using bcrypt.');
        rl.close();
        process.exit(1);
      }
    } else {
      console.log('✅ Password is properly hashed!');
      
      // Test password if provided
      const testPassword = process.argv[2];
      if (testPassword) {
        console.log(`\n🔐 Testing password: "${testPassword}"`);
        const isMatch = await superadmin.matchPassword(testPassword);
        if (isMatch) {
          console.log('✅ Password matches! Login will work.');
        } else {
          console.log('❌ Password does NOT match!');
        }
      } else {
        console.log('\n💡 To test password, run:');
        console.log(`   node scripts/check-and-fix-superadmin.js "your-password"`);
      }
    }

    console.log('\n📝 To login:');
    console.log('   1. Make sure backend is running: npm run dev');
    console.log('   2. Make sure frontend is running: cd ../frontend && npm run dev');
    console.log('   3. Go to http://localhost:5173/login');
    console.log(`   4. Email: ${superadmin.email}`);
    console.log('   5. Enter your password');
    console.log('\n🎯 After successful login, you should see:');
    console.log('   - "Super Admin" link in the navbar (purple badge)');
    console.log('   - Access to /superadmin route');
    console.log('   - Role displayed as "superadmin"');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

checkAndFixSuperAdmin();

