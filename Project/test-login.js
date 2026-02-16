const axios = require('axios');

async function testLogins() {
  console.log('Testing login API...\n');
  
  const testUsers = [
    { email: 'jobseeker@test.com', password: 'jobseeker123', role: 'Jobseeker' },
    { email: 'recruiter@test.com', password: 'recruiter123', role: 'Recruiter' },
    { email: 'admin@test.com', password: 'admin123', role: 'Admin' }
  ];

  for (const user of testUsers) {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: user.email,
        password: user.password
      });
      console.log(`✓ ${user.role} login successful: ${res.data.role}`);
      console.log(`  Token: ${res.data.token ? 'Received' : 'Missing'}`);
    } catch (err) {
      console.log(`✗ ${user.role} login failed: ${err.response?.data?.message || err.message}`);
    }
  }
}

testLogins();
