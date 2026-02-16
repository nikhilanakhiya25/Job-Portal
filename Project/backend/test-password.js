const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal')
  .then(async () => {
    console.log('Testing password comparison...\n');
    
    const user = await User.findOne({ email: 'jobseeker@test.com' });
    if (!user) {
      console.log('User not found!');
      mongoose.connection.close();
      return;
    }
    
    console.log('User found:', user.email);
    console.log('Stored password hash:', user.password.substring(0, 30) + '...');
    
    const testPassword = 'jobseeker123';
    console.log('\nTesting password:', testPassword);
    
    // Test bcrypt comparison
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('bcrypt.compare result:', isMatch);
    
    // Test the model method
    const isMatchMethod = await user.comparePassword(testPassword);
    console.log('user.comparePassword result:', isMatchMethod);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
