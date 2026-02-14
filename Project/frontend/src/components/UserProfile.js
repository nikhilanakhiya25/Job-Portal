import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { Person, Save } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SKILL_OPTIONS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#', 'PHP',
  'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker',
  'Kubernetes', 'Git', 'Agile', 'Scrum', 'TypeScript', 'Angular', 'Vue.js'
];

const UserProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    experience: '',
    education: '',
    skills: [],
    resume: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = (skill) => {
    if (!profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setProfile(prev => ({
        ...prev,
        resume: file
      }));
    } else {
      alert('Please upload a PDF file only.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      Object.keys(profile).forEach(key => {
        if (key === 'skills') {
          formData.append(key, JSON.stringify(profile[key]));
        } else if (key === 'resume' && profile[key] instanceof File) {
          formData.append(key, profile[key]);
        } else if (key !== 'resume') {
          formData.append(key, profile[key]);
        }
      });

      const response = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
              >
                {profile.name?.charAt(0)?.toUpperCase() || <Person />}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {profile.name || 'Your Name'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Professional Information
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experience"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                    placeholder="e.g., 2-3 years"
                    disabled={saving}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Education"
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech Computer Science"
                    disabled={saving}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    disabled={saving}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>

              <Box sx={{ mb: 2 }}>
                {profile.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleSkillRemove(skill)}
                    sx={{ mr: 1, mb: 1 }}
                    disabled={saving}
                  />
                ))}
              </Box>

              <TextField
                select
                fullWidth
                label="Add Skill"
                onChange={(e) => handleSkillAdd(e.target.value)}
                disabled={saving}
                sx={{ mb: 3 }}
              >
                {SKILL_OPTIONS.filter(skill => !profile.skills.includes(skill)).map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </TextField>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Resume
              </Typography>

              <Box sx={{ mb: 3 }}>
                <input
                  accept=".pdf"
                  style={{ display: 'none' }}
                  id="resume-upload"
                  type="file"
                  onChange={handleResumeUpload}
                  disabled={saving}
                />
                <label htmlFor="resume-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={saving}
                  >
                    Upload Resume (PDF)
                  </Button>
                </label>
                {profile.resume && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {profile.resume.name || 'Resume uploaded'}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
