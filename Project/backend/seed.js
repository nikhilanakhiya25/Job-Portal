const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Job = require('./models/Job');
const User = require('./models/User');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');

const seedData = async () => {
  try {
    // Check if admin user exists
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = new User({
        name: 'Admin',
        email: 'admin@jobportal.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created');
    }

    // Check if regular user exists
    let user = await User.findOne({ email: 'user@jobportal.com' });
    if (!user) {
      // Create regular user
      const hashedPassword = await bcrypt.hash('user123', 10);
      user = new User({
        name: 'John Doe',
        email: 'user@jobportal.com',
        password: hashedPassword,
        role: 'jobseeker',
        skills: ['JavaScript', 'React', 'Node.js']
      });
      await user.save();
      console.log('Regular user created');
    }

    // Check if jobs already exist
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      console.log('Jobs already exist, skipping seed');
      return;
    }

    const jobs = [
      {
        title: 'Frontend Developer',
        description: 'Develop user interfaces using React and modern web technologies.',
        skillsRequired: ['JavaScript', 'React', 'CSS', 'HTML'],
        experience: '1-3 years',
        salary: '6 LPA',
        company: 'TCS',
        location: 'Mumbai',
        postedBy: admin._id
      },
      {
        title: 'Backend Developer',
        description: 'Build server-side applications and APIs using Node.js and MongoDB.',
        skillsRequired: ['Node.js', 'MongoDB', 'Express', 'JavaScript'],
        experience: '1-3 years',
        salary: '8 LPA',
        company: 'Infosys',
        location: 'Bangalore',
        postedBy: admin._id
      },
      {
        title: 'Full Stack Developer',
        description: 'Develop both frontend and backend applications for web platforms.',
        skillsRequired: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        experience: '3-5 years',
        salary: '10 LPA',
        company: 'Wipro',
        location: 'Hyderabad',
        postedBy: admin._id
      }
    ];

    await Job.insertMany(jobs);
    console.log('Sample jobs added successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
