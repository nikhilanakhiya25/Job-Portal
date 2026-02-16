const axios = require('axios');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// LinkedIn OAuth Configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_LINKEDIN_CLIENT_SECRET';

// @desc    Handle LinkedIn OAuth callback
// @route   POST /api/auth/linkedin
// @access  Public
const linkedInAuth = async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    // Step 1: Exchange authorization code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    // Step 2: Get user profile from LinkedIn
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    // Step 3: Get user email from LinkedIn
    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    const linkedInId = profileResponse.data.id;
    const firstName = profileResponse.data.localizedFirstName;
    const lastName = profileResponse.data.localizedLastName;
    const email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress;

    if (!email) {
      return res.status(400).json({ message: 'Could not retrieve email from LinkedIn' });
    }

    // Step 4: Find or create user
    let user = await User.findOne({ email: email });

    if (!user) {
      // Create new user from LinkedIn data
      user = await User.create({
        name: `${firstName} ${lastName}`,
        email: email,
        password: await require('bcryptjs').hash(Math.random().toString(36).slice(-8), 10), // Random password
        role: 'jobseeker', // Default role for LinkedIn users
        accountStatus: 'active',
        linkedInId: linkedInId,
        linkedInProfile: {
          firstName: firstName,
          lastName: lastName,
          profileUrl: `https://www.linkedin.com/in/${linkedInId}`
        }
      });
    } else {
      // Update LinkedIn info for existing user
      user.linkedInId = linkedInId;
      user.linkedInProfile = {
        firstName: firstName,
        lastName: lastName,
        profileUrl: `https://www.linkedin.com/in/${linkedInId}`
      };
      await user.save();
    }

    // Step 5: Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    // Step 6: Return user data and token
    res.json({
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        accountStatus: user.accountStatus,
        linkedInProfile: user.linkedInProfile
      }
    });

  } catch (error) {
    console.error('LinkedIn auth error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'LinkedIn authentication failed',
      error: error.response?.data || error.message
    });
  }
};

// @desc    Get LinkedIn profile data (for importing to user profile)
// @route   GET /api/auth/linkedin/profile
// @access  Private
const getLinkedInProfile = async (req, res) => {
  try {
    // This would require storing the LinkedIn access token
    // and making additional API calls to get full profile data
    res.json({ 
      message: 'LinkedIn profile import feature',
      note: 'This requires additional LinkedIn API permissions (r_basicprofile)'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  linkedInAuth,
  getLinkedInProfile
};
