const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');

const seedUsers = async () => {
  try {
    console.log('Creating test users...');
    
    // Delete existing test users
    await User.deleteMany({ 
      email: { 
        $in: ['admin@test.com', 'jobseeker@test.com', 'recruiter@test.com'] 
      } 
    });
    console.log('Cleared existing test users');

    // Create admin user (password will be hashed by User model pre-save middleware)
    const admin = new User({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',  // Plain password - will be hashed by pre-save hook
      role: 'admin',
      accountStatus: 'active'
    });
    await admin.save();
    console.log('✓ Admin user created: admin@test.com / admin123');

    // Create jobseeker user (password will be hashed by User model pre-save middleware)
    const jobseeker = new User({
      name: 'Job Seeker',
      email: 'jobseeker@test.com',
      password: 'jobseeker123',  // Plain password - will be hashed by pre-save hook
      role: 'jobseeker',
      accountStatus: 'active',
      skills: ['JavaScript', 'React', 'Node.js']
    });
    await jobseeker.save();
    console.log('✓ Jobseeker user created: jobseeker@test.com / jobseeker123');

    // Create recruiter user (password will be hashed by User model pre-save middleware)
    const recruiter = new User({
      name: 'Recruiter',
      email: 'recruiter@test.com',
      password: 'recruiter123',  // Plain password - will be hashed by pre-save hook
      role: 'recruiter',
      accountStatus: 'active',
      skills: ['Hiring', 'Management']
    });
    await recruiter.save();
    console.log('✓ Recruiter user created: recruiter@test.com / recruiter123');


    console.log('\nAll test users created successfully!');
    console.log('\nTest Credentials:');
    console.log('  Admin:     admin@test.com / admin123');
    console.log('  Jobseeker: jobseeker@test.com / jobseeker123');
    console.log('  Recruiter: recruiter@test.com / recruiter123');
    
  } catch (err) {
    console.error('Error creating users:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedUsers();
