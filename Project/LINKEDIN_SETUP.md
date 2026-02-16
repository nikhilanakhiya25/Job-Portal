# LinkedIn Login Integration Setup Guide

## ✅ What Was Implemented

### 1. **LinkedIn OAuth Login Button**
- Added "Continue with LinkedIn" button on the login page
- Styled with LinkedIn's official blue color (#0077b5)
- Integrated with the existing login flow

### 2. **Backend API Endpoint**
- Created `/api/auth/linkedin` endpoint to handle OAuth callback
- Exchanges authorization code for access token
- Retrieves user profile and email from LinkedIn
- Creates new user or updates existing user
- Returns JWT token for authentication

### 3. **User Model Updates**
- Added `linkedInId` field to store LinkedIn user ID
- Added `linkedInProfile` object with firstName, lastName, and profileUrl

### 4. **Frontend Components**
- `LinkedInLogin.jsx` - Reusable LinkedIn login button component
- Updated `Login.js` to include the LinkedIn button
- Added LinkedIn callback route in `App.js`

## 🔧 Setup Instructions

### Step 1: Create LinkedIn Developer App

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Sign in with your LinkedIn account
3. Click "Create App"
4. Fill in the app details:
   - **App Name**: Your Job Portal Name
   - **LinkedIn Page**: (Optional) Your company page
   - **Privacy Policy URL**: http://localhost:3000/privacy
   - **App Logo**: Upload your app logo

### Step 2: Configure OAuth Settings

1. In your LinkedIn app, go to "Auth" tab
2. Add Redirect URL:
   ```
   http://localhost:3000/linkedin/callback
   ```
3. Note down your **Client ID** and **Client Secret**

### Step 3: Request API Access

1. Go to "Products" tab in LinkedIn Developer Portal
2. Request access to:
   - **Sign In with LinkedIn** (for basic profile)
   - **Share on LinkedIn** (optional, for job sharing)

### Step 4: Configure Environment Variables

#### Backend (`backend/.env`):
```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

#### Frontend (`.env` file in project root):
```env
REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
REACT_APP_LINKEDIN_REDIRECT_URI=http://localhost:3000/linkedin/callback
```

### Step 5: Restart Servers

```bash
# Stop current servers (Ctrl+C in terminal)

# Restart backend
cd backend
npm start

# Restart frontend (in new terminal)
cd frontend
npm start
```

## 🧪 Testing the Integration

1. Open your app at `http://localhost:3000`
2. Go to the Login page
3. Click "Continue with LinkedIn" button
4. You should be redirected to LinkedIn authorization page
5. Authorize the app
6. You'll be redirected back and automatically logged in

## 📋 What Data is Retrieved

When a user logs in with LinkedIn, the following data is retrieved:
- ✅ First Name
- ✅ Last Name
- ✅ Email Address
- ✅ LinkedIn Profile URL
- ✅ LinkedIn User ID

## 🔒 Security Notes

- The LinkedIn access token is NOT stored (only exchanged for your JWT token)
- User passwords are auto-generated for LinkedIn users (random secure password)
- All standard authentication protections still apply

## 🚀 Next Steps (Optional Features)

You can extend this integration with:

1. **Import LinkedIn Profile Data**
   - Work experience
   - Education
   - Skills
   - Profile photo

2. **Share Jobs to LinkedIn**
   - Allow recruiters to share job postings
   - One-click share button

3. **Apply with LinkedIn**
   - Job seekers can apply using their LinkedIn profile
   - Auto-fill application forms

## ❓ Troubleshooting

### "Invalid redirect_uri"
- Make sure the redirect URI in your LinkedIn app matches exactly
- Must include `http://localhost:3000/linkedin/callback`

### "Unauthorized scope"
- You need to request the "Sign In with LinkedIn" product
- Approval may take 1-2 business days

### "Client authentication failed"
- Check that your Client ID and Client Secret are correct
- Make sure they're set in the `.env` files

## 📞 Support

For LinkedIn API issues:
- [LinkedIn Developer Documentation](https://docs.microsoft.com/en-us/linkedin/)
- [LinkedIn Developer Forum](https://stackoverflow.com/questions/tagged/linkedin)

For app-specific issues:
- Check the browser console for error messages
- Check the backend terminal for server logs
