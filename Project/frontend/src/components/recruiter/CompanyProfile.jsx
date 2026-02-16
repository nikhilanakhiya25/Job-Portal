import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  Business,
  Language,
  LocationOn,
  Group,
  CalendarToday,
  Description,
  Save,
  Edit
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const CompanyProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    location: '',
    size: '',
    founded: ''
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/recruiter/company', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          industry: response.data.industry || '',
          website: response.data.website || '',
          location: response.data.location || '',
          size: response.data.size || '',
          founded: response.data.founded || ''
        });
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load company profile');
      }
      // 404 means no company exists yet, which is fine
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/recruiter/company', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Company profile saved successfully!');
      setIsEditing(false);
      
      // Update user context with company info
      if (setUser && response.data) {
        setUser(prev => ({
          ...prev,
          company: response.data
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const hasCompany = formData.name !== '';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Business sx={{ verticalAlign: 'middle', mr: 1 }} />
        Company Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          {!isEditing && hasCompany ? (
            // View Mode
            <Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
                  <Business sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5">{formData.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {formData.industry}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Description sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">{formData.description}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">{formData.location}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Language sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {formData.website || 'No website provided'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Group sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">{formData.size} employees</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      Founded: {formData.founded || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                {hasCompany ? 'Edit Company Profile' : 'Create Company Profile'}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Company Size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select size</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size} employees
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Founded Year"
                    name="founded"
                    type="number"
                    value={formData.founded}
                    onChange={handleChange}
                    inputProps={{ min: 1800, max: new Date().getFullYear() }}
                  />
                </Grid>
              </Grid>

              <Box mt={3} display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (hasCompany ? 'Update Profile' : 'Create Profile')}
                </Button>
                
                {hasCompany && (
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CompanyProfile;
