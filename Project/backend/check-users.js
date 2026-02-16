const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal')
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const users = await User.find({ 
      email: { 
        $in: ['jobseeker@test.com', 'recruiter@test.com', 'admin@test.com'] 
      } 
    });
    
    console.log('Found users:', users.length);
    users.forEach(u => {
      console.log('  -', u.email, '| role:', u.role, '| status:', u.accountStatus);
      console.log('    Password hash:', u.password.substring(0, 20) + '...');
    });
    
    if (users.length === 0) {
      console.log('\nNo test users found! Run: node seed-users.js');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
