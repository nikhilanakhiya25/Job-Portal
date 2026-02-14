const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = null;

// Test admin login
async function testAdminLogin() {
  try {
    console.log('Testing Admin Login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@jobportal.com',
      password: 'admin123'
    });
    
    if (response.data.role === 'admin') {
      console.log('✅ Admin login successful');
      authToken = response.data.token;
      return true;
    } else {
      console.log('❌ User is not an admin');
      return false;
    }
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test admin stats endpoint
async function testAdminStats() {
  try {
    console.log('\nTesting Admin Stats Endpoint...');
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Admin stats retrieved successfully');
    console.log('Stats:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Admin stats failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test get users endpoint
async function testGetUsers() {
  try {
    console.log('\nTesting Get Users Endpoint...');
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Users retrieved successfully');
    console.log(`Total users: ${response.data.pagination.total}`);
    return true;
  } catch (error) {
    console.log('❌ Get users failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test get jobs endpoint
async function testGetJobs() {
  try {
    console.log('\nTesting Get Jobs Endpoint...');
    const response = await axios.get(`${API_URL}/admin/jobs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Jobs retrieved successfully');
    console.log(`Total jobs: ${response.data.pagination.total}`);
    return true;
  } catch (error) {
    console.log('❌ Get jobs failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test analytics endpoint
async function testAnalytics() {
  try {
    console.log('\nTesting Analytics Endpoint...');
    const response = await axios.get(`${API_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Analytics retrieved successfully');
    console.log('Skill demand count:', response.data.skillDemand?.length || 0);
    return true;
  } catch (error) {
    console.log('❌ Analytics failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test activity logs endpoint
async function testActivityLogs() {
  try {
    console.log('\nTesting Activity Logs Endpoint...');
    const response = await axios.get(`${API_URL}/admin/logs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Activity logs retrieved successfully');
    console.log(`Total logs: ${response.data.pagination.total}`);
    return true;
  } catch (error) {
    console.log('❌ Activity logs failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== Admin Panel API Testing ===\n');
  
  const loginSuccess = await testAdminLogin();
  if (!loginSuccess) {
    console.log('\n❌ Cannot proceed without admin login');
    return;
  }
  
  await testAdminStats();
  await testGetUsers();
  await testGetJobs();
  await testAnalytics();
  await testActivityLogs();
  
  console.log('\n=== Testing Complete ===');
}

runTests().catch(console.error);
