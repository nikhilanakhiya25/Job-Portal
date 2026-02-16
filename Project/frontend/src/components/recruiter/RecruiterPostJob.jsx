import React, { useState, useContext } from 'react';
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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Work,
  Add,
  ArrowBack
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecruiterPostJob = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: [],
    experience: '',
    salary: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/recruiter/jobs',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Job posted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        skillsRequired: [],
        experience: '',
        salary: '',
        location: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/recruiter/manage-jobs');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/recruiter/manage-jobs')}
        sx={{ mb: 2 }}
      >
        Back to Jobs
      </Button>

      <Typography variant="h4" gutterBottom>
        <Work sx={{ verticalAlign: 'middle', mr: 1 }} />
        Post New Job
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Senior Software Engineer"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={6}
                  required
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Required Skills
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <TextField
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddSkill}
                    startIcon={<Add />}
                  >
                    Add
                  </Button>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {formData.skillsRequired.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Experience Required</InputLabel>
                  <Select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    label="Experience Required"
                  >
                    <MenuItem value="0-1 years">0-1 years (Fresher)</MenuItem>
                    <MenuItem value="1-3 years">1-3 years (Junior)</MenuItem>
                    <MenuItem value="3-5 years">3-5 years (Mid-level)</MenuItem>
                    <MenuItem value="5+ years">5+ years (Senior)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Salary Range"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 8-12 LPA or $50,000 - $70,000"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Mumbai, India or Remote"
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || formData.skillsRequired.length === 0}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Post Job'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/recruiter/manage-jobs')}
                  >
                    Cancel
                  </Button>
                </Box>
                
                {formData.skillsRequired.length === 0 && (
                  <Typography variant="caption" color="error" display="block" mt={1}>
                    Please add at least one required skill
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecruiterPostJob;
