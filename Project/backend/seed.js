const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Job = require('./models/Job');
const User = require('./models/User');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal');

const seedData = async () => {
  try {
    // Check if admin user exists
    let admin = await User.findOne({ email: 'admin@test.com' });
    if (!admin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = new User({
        name: 'Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: admin@test.com / admin123');
    }


    // Check if jobseeker user exists
    let jobseeker = await User.findOne({ email: 'jobseeker@test.com' });
    if (!jobseeker) {
      // Create jobseeker user
      const hashedPassword = await bcrypt.hash('jobseeker123', 10);
      jobseeker = new User({
        name: 'Job Seeker',
        email: 'jobseeker@test.com',
        password: hashedPassword,
        role: 'jobseeker',
        skills: ['JavaScript', 'React', 'Node.js']
      });
      await jobseeker.save();
      console.log('Jobseeker user created: jobseeker@test.com / jobseeker123');
    }

    // Check if recruiter user exists
    let recruiter = await User.findOne({ email: 'recruiter@test.com' });
    if (!recruiter) {
      // Create recruiter user
      const hashedPassword = await bcrypt.hash('recruiter123', 10);
      recruiter = new User({
        name: 'Recruiter',
        email: 'recruiter@test.com',
        password: hashedPassword,
        role: 'recruiter',
        skills: ['Hiring', 'Management']
      });
      await recruiter.save();
      console.log('Recruiter user created: recruiter@test.com / recruiter123');
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
