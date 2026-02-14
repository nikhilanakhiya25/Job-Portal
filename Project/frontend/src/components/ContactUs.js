import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Alert,
  Chip
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  AccessTime,
  Support,
  Business
} from '@mui/icons-material';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields');
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <Email fontSize="large" />,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'support@jobportal.com',
      color: '#3b82f6'
    },
    {
      icon: <Phone fontSize="large" />,
      title: 'Call Us',
      description: 'Mon-Fri from 9am to 6pm',
      value: '+1 (555) 123-4567',
      color: '#10b981'
    },
    {
      icon: <LocationOn fontSize="large" />,
      title: 'Visit Us',
      description: 'Come say hello at our office',
      value: '123 Career Street, Business District, NY 10001',
      color: '#f59e0b'
    },
    {
      icon: <AccessTime fontSize="large" />,
      title: 'Business Hours',
      description: 'We are here to help',
      value: 'Monday - Friday: 9:00 AM - 6:00 PM',
      color: '#8b5cf6'
    }
  ];

  const faqs = [
    {
      question: 'How do I post a job?',
      answer: 'Simply create an account, verify your company, and use our easy job posting form to list your position.'
    },
    {
      question: 'Is it free to apply for jobs?',
      answer: 'Yes! Job seekers can create an account and apply to jobs completely free of charge.'
    },
    {
      question: 'How does the matching algorithm work?',
      answer: 'Our AI analyzes your skills, experience, and preferences to match you with the most relevant job opportunities.'
    },
    {
      question: 'How can I contact support?',
      answer: 'You can use the form below, email us directly, or call our support line during business hours.'
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          py: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold', fontSize: { xs: '2.5rem', md: '3.5rem' } }}
              >
                Get In Touch
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95, mb: 3, lineHeight: 1.8 }}>
                Have questions? We'd love to hear from you! Our team is here to help 
                and provide support for all your job searching needs.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Support sx={{ color: 'white !important' }} />} 
                  label="24/7 Support" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Chip 
                  icon={<Business sx={{ color: 'white !important' }} />} 
                  label="For Employers" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop"
                alt="Customer support"
                sx={{ width: '100%', borderRadius: 4, boxShadow: 6 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 6 }}>
        <Grid container spacing={3}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: 'white',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Box sx={{ color: info.color, mb: 2 }}>{info.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {info.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {info.description}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                  {info.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form and FAQ Section */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                  Send us a Message
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Fill out the form below and we'll get back to you as soon as possible.
                </Typography>

                {submitted && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Thank you for your message! We'll get back to you within 24 hours.
                  </Alert>
                )}

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        select
                        SelectProps={{ native: true }}
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="jobs">Job Posting</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        multiline
                        rows={6}
                        placeholder="Tell us how we can help you..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<Send />}
                        sx={{
                          py: 1.5,
                          fontWeight: 'bold',
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                          }
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>

            {/* FAQ Section */}
            <Grid item xs={12} md={5}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                Frequently Asked Questions
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Quick answers to common questions
              </Typography>

              <Box>
                {faqs.map((faq, index) => (
                  <Paper
                    key={index}
                    elevation={2}
                    sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}
                  >
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {faq.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Additional Contact Option */}
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  mt: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Need Immediate Assistance?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.95 }}>
                  For urgent inquiries, please call our support line.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Phone />}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  Call Now: +1 (555) 123-4567
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map Section */}
      <Box sx={{ bgcolor: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Find Our Office
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Visit us at our headquarters
          </Typography>
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', height: 400 }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <LocationOn sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                123 Career Street, Business District
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New York, NY 10001
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactUs;
